import { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
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
        <div className="sticky top-0 z-10 -mx-4 border-b border-slate-200 bg-slate-50/90 px-4 pb-4 pt-6 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
            <Link href="/admin/events" className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Esdeveniments
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">{event?.name}</h1>
                    <span className="badge badge-gray font-mono">{event?.code}</span>
                    {event && <span className="text-sm text-slate-500">{displayDate(event.date)}</span>}
                </div>
                <button
                    disabled={saving || !isDirty}
                    className="btn btn-primary min-w-[8rem]"
                    onClick={onSave}>
                    {saving && <Spinner className="h-4 w-4 text-white" />}
                    {saving ? "Guardant..." : "Guardar"}
                </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="text-slate-600">
                    Persones apuntades: <span className="font-semibold text-slate-900 tabular-nums">{selected.size}</span> de <span className="tabular-nums">{people.length}</span>
                </span>
                {isDirty &&
                    <span className="badge badge-amber">
                        sense guardar
                        {changes.added > 0 ? ` +${changes.added}` : ""}
                        {changes.removed > 0 ? ` −${changes.removed}` : ""}
                    </span>
                }
                {selected.size > 0 &&
                    <button
                        className="font-medium text-slate-500 transition-colors hover:text-red-600"
                        onClick={onClear}>Desmarcar tot</button>
                }
                {saveResult &&
                    <span className={`badge ${saveResult.ok ? "badge-green" : "badge-red"}`}>
                        {saveResult.message}
                    </span>
                }
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="relative w-full max-w-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="form-input pl-11"
                        placeholder="Cercar per nom, expedient o document d'identitat..." />
                </div>
                {query
                    ? <span className="text-sm text-slate-500">{matches} coincidències</span>
                    : <span className="flex items-center gap-1">
                        <button className="btn btn-ghost btn-sm" onClick={() => setAllGroupsOpen(true)}>Obrir tots</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setAllGroupsOpen(false)}>Tancar tots</button>
                    </span>
                }
            </div>
        </div>
    )

    if (loading) return <div className="flex justify-center py-24"><Spinner /></div>;
    if (loadError) return <div className="mx-auto max-w-2xl p-10"><DangerAlert title="Error" text={loadError} /></div>;
    if (!event) return null;

    return (
        <>
            <Head>
                <title>Esdeveniments - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="px-4 pb-16 sm:px-6 lg:px-10">
                {renderToolbar()}

                <div className="mt-6">
                    <PasteSelector onApply={markByReferences} />

                    {query && matches === 0 &&
                        <p className="card px-6 py-10 text-center text-slate-500">Cap persona coincideix amb la cerca.</p>
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
