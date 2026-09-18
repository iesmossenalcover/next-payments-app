import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { EventPeople, EventPerson, ResponseCode } from "@/lib/apis/payments/models";
import { getEventPeople, setEventPeople } from "@/lib/apis/payments/client";

/*
    Estat de la pantalla "persones d'un esdeveniment".

    L'API torna totes les persones agrupades per grup, cada una amb inEvent.
    La selecció es guarda com un Set d'ids i es desa sencera: el backend
    reemplaça la llista d'apuntats i rebutja el desat si es lleva algú
    que ja ha pagat.
*/

export interface MarkResult {
    matched: number,
    notFound: string[],
}

export interface SaveResult {
    ok: boolean,
    message: string,
}

const LOAD_ERROR = "No s'han pogut carregar les persones de l'esdeveniment.";
const SAVE_ERROR = "No s'ha pogut guardar. Una o més persones que vols llevar ja han pagat.";

const flattenPeople = (event?: EventPeople): EventPerson[] =>
    event ? event.peopleGroups.reduce<EventPerson[]>((acc, g) => acc.concat(g.people), []) : [];

const inEventIds = (event: EventPeople): Set<number> =>
    new Set(flattenPeople(event).filter(x => x.inEvent).map(x => x.id));

const errorMessage = (errors: Map<string, string[]> | undefined, fallback: string): string => {
    if (!errors || errors.size === 0) return fallback;

    const messages = Array.from(errors.values()).reduce<string[]>((acc, x) => acc.concat(x), []);
    return messages.length > 0 ? messages.join(" ") : fallback;
}

// Sense accents ni majúscules, per poder cercar "muñoz" escrivint "munoz".
export const normalize = (text: string): string =>
    text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

// Cerca per nom, expedient acadèmic o document d'identitat.
export const matchesPerson = (person: EventPerson, query: string): boolean => {
    if (!query) return true;

    return normalize(person.fullName).includes(query)
        || (!!person.documentId && normalize(person.documentId).includes(query))
        || (!!person.academicRecordNumber && person.academicRecordNumber.toString().includes(query));
}

const useEventPeople = (code?: string) => {
    const router = useRouter();
    const [event, setEvent] = useState<EventPeople | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | undefined>(undefined);
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [persisted, setPersisted] = useState<Set<number>>(new Set());
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!code) return;

        setLoading(true);
        setLoadError(undefined);
        getEventPeople(code)
            .then(x => {
                if (x.errors || !x.data) {
                    setLoadError(errorMessage(x.errors, LOAD_ERROR));
                    return;
                }

                const ids = inEventIds(x.data);
                setEvent(x.data);
                setSelected(ids);
                setPersisted(ids);
            })
            .finally(() => setLoading(false));
    }, [code])

    const people = useMemo(() => flattenPeople(event), [event]);

    // Diferència entre el que hi ha a pantalla i el darrer estat desat.
    const changes = useMemo(() => {
        let added = 0;
        let removed = 0;
        selected.forEach(id => { if (!persisted.has(id)) added++; });
        persisted.forEach(id => { if (!selected.has(id)) removed++; });
        return { added, removed };
    }, [selected, persisted]);

    const isDirty = changes.added > 0 || changes.removed > 0;

    const toggle = useCallback((id: number, checked: boolean) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (checked) next.add(id); else next.delete(id);
            return next;
        });
    }, [])

    const setMany = useCallback((ids: number[], checked: boolean) => {
        if (ids.length === 0) return;

        setSelected(prev => {
            const next = new Set(prev);
            ids.forEach(id => { if (checked) next.add(id); else next.delete(id); });
            return next;
        });
    }, [])

    const clear = useCallback(() => setSelected(new Set()), [])

    /*
        Marca o desmarca a partir d'una llista d'expedients o documents
        d'identitat, i torna quines referències no s'han trobat.
    */
    const markByReferences = useCallback((references: string[], checked: boolean): MarkResult => {
        const byReference = new Map<string, number>();
        people.forEach(x => {
            if (x.documentId) byReference.set(normalize(x.documentId), x.id);
            if (x.academicRecordNumber) byReference.set(x.academicRecordNumber.toString(), x.id);
        });

        const ids: number[] = [];
        const notFound: string[] = [];
        references.forEach(x => {
            const id = byReference.get(normalize(x));
            if (id === undefined) notFound.push(x); else ids.push(id);
        });

        setMany(ids, checked);
        return { matched: ids.length, notFound };
    }, [people, setMany])

    const save = useCallback(async (): Promise<SaveResult> => {
        if (!code) return { ok: false, message: SAVE_ERROR };

        setSaving(true);
        try {
            const ids = Array.from(selected);
            const response = await setEventPeople(code, ids);

            if (response.code !== ResponseCode.Success) {
                return { ok: false, message: errorMessage(response.errors, SAVE_ERROR) };
            }

            setPersisted(new Set(ids));
            return { ok: true, message: `Guardat correctament: ${ids.length} persones apuntades.` };
        }
        finally {
            setSaving(false);
        }
    }, [code, selected])

    // Avisa abans de perdre canvis, tant tancant la pestanya com navegant.
    useEffect(() => {
        if (!isDirty) return;

        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        const onRouteChange = () => {
            if (confirm("Tens canvis sense guardar. Vols sortir igualment?")) return;

            router.events.emit("routeChangeError");
            // Next no ofereix cancel·lar una navegació d'altra manera.
            throw "routeChange aborted";
        };

        window.addEventListener("beforeunload", onBeforeUnload);
        router.events.on("routeChangeStart", onRouteChange);

        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            router.events.off("routeChangeStart", onRouteChange);
        };
    }, [isDirty, router])

    return {
        event,
        people,
        loading,
        loadError,
        selected,
        changes,
        isDirty,
        saving,
        toggle,
        setMany,
        clear,
        markByReferences,
        save,
    };
}

export default useEventPeople;
