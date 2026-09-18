import { useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "@/components/layout/SideBar";
import { DangerAlert } from "@/components/Alerts";
import { Spinner } from "@/components/Loading";
import EventPeopleGroup from "@/components/events/EventPeopleGroup";
import PasteSelector from "@/components/events/PasteSelector";
import useEventPeople, { matchesPerson, normalize, SaveResult } from "@/lib/hooks/useEventPeople";
import useDebounce from "@/lib/hooks/useDebounce";
import { displayDate } from "@/lib/utils";

const PeopleToEvent = () => {
    const router = useRouter();
    // La ruta es diu [id] però el que s'hi passa és el codi de l'esdeveniment.
    const { id } = router.query;

    const {
        event, people, loading, loadError, selected, changes, isDirty, saving,
        toggle, setMany, clear, markByReferences, save,
    } = useEventPeople(id as string | undefined);

    const [search, setSearch] = useState("");
    const [openGroups, setOpenGroups] = useState<Set<number>>(new Set());
    const [saveResult, setSaveResult] = useState<SaveResult | undefined>(undefined);

    const query = normalize(useDebounce(search, 200));

    const matches = useMemo(
        () => query ? people.filter(x => matchesPerson(x, query)).length : people.length,
        [people, query]);

    const onSave = async () => {
        setSaveResult(await save());
    }

    const onToggle = (personId: number, checked: boolean) => {
        setSaveResult(undefined);
        toggle(personId, checked);
    }

    const onSetMany = (ids: number[], checked: boolean) => {
        setSaveResult(undefined);
        setMany(ids, checked);
    }

    const onClear = () => {
        if (selected.size === 0) return;

        if (confirm(`Desmarcar les ${selected.size} persones seleccionades?`)) {
            setSaveResult(undefined);
            clear();
        }
    }

    const onGroupOpenChange = (groupId: number, open: boolean) => {
        setOpenGroups(prev => {
            const next = new Set(prev);
            if (open) next.add(groupId); else next.delete(groupId);
            return next;
        });
    }

    const setAllGroupsOpen = (open: boolean) => {
        setOpenGroups(open && event ? new Set(event.peopleGroups.map(x => x.id)) : new Set());
    }

    const renderToolbar = () => (
        <div className="sticky top-0 bg-white pt-8 pb-3 z-10 border-b border-gray-200">
            <div className="flex justify-between items-center">
                <div className="flex items-baseline">
                    <h4 className="font-bold text-3xl">{event?.code}</h4>
                    <span className="mx-3 text-3xl text-gray-300">–</span>
                    <h4 className="font-bold text-2xl text-gray-600">{event?.name}</h4>
                    {event && <span className="ml-3 text-gray-500">· {displayDate(event.date)}</span>}
                </div>
                <button
                    disabled={saving || !isDirty}
                    className={`
                        ml-10
                        text-white
                        font-bold
                        py-2
                        px-5
                        rounded ${!saving && isDirty ? "bg-green-600 hover:bg-green-900" : "bg-gray-400"}`}
                    onClick={onSave}>{saving ? "Guardant..." : "Guardar"}</button>
            </div>

            <div className="flex items-baseline mt-3">
                <h4 className="font-semibold">Persones apuntades: {selected.size} de {people.length}</h4>
                {isDirty &&
                    <span className="ml-3 text-sm text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        sense guardar
                        {changes.added > 0 ? ` +${changes.added}` : ""}
                        {changes.removed > 0 ? ` −${changes.removed}` : ""}
                    </span>
                }
                {selected.size > 0 &&
                    <button
                        className="ml-4 text-sm text-gray-500 hover:text-red-600 hover:underline"
                        onClick={onClear}>Desmarcar tot</button>
                }
                {saveResult &&
                    <span className={`ml-4 text-sm italic ${saveResult.ok ? "text-green-700" : "text-red-600"}`}>
                        {saveResult.message}
                    </span>
                }
            </div>

            <div className="flex items-center mt-3">
                <input
                    type="search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="block p-2.5 w-full max-w-xl text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cercar per nom, expedient o document d'identitat..." />
                {query
                    ? <span className="ml-4 text-sm text-gray-500">{matches} coincidències</span>
                    : <span className="ml-4 text-sm">
                        <button className="text-blue-600 hover:underline" onClick={() => setAllGroupsOpen(true)}>Obrir tots</button>
                        <button className="ml-4 text-blue-600 hover:underline" onClick={() => setAllGroupsOpen(false)}>Tancar tots</button>
                    </span>
                }
            </div>
        </div>
    )

    if (loading) return <div className="mt-20 text-center"><Spinner /></div>;
    if (loadError) return <div className="m-10"><DangerAlert title="Error" text={loadError} /></div>;
    if (!event) return null;

    return (
        <>
            <Head>
                <title>Esdeveniments - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="px-10 pb-16">
                {renderToolbar()}

                <div className="mt-6">
                    <PasteSelector onApply={markByReferences} />

                    {query && matches === 0 &&
                        <p className="text-gray-500 italic">Cap persona coincideix amb la cerca.</p>
                    }
                    {event.peopleGroups.map(x => (
                        <EventPeopleGroup
                            key={x.id}
                            group={x}
                            query={query}
                            selected={selected}
                            open={openGroups.has(x.id)}
                            onOpenChange={open => onGroupOpenChange(x.id, open)}
                            onToggle={onToggle}
                            onSetMany={onSetMany} />
                    ))}
                </div>
            </main>
        </>
    );
}

export default function PeopleToEventPage() {
    return (
        <Container>
            <PeopleToEvent />
        </Container>
    )
};
