import { useMemo } from "react";
import { EventPeopleGroup, EventPerson } from "@/lib/apis/payments/models";
import { matchesPerson } from "@/lib/hooks/useEventPeople";

interface EventPeopleGroupProps {
    group: EventPeopleGroup,
    query: string,
    selected: Set<number>,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onToggle: (id: number, checked: boolean) => void,
    onSetMany: (ids: number[], checked: boolean) => void,
}

const PersonRow = ({ person, checked, onToggle }: { person: EventPerson, checked: boolean, onToggle: (id: number, checked: boolean) => void }) => {
    const reference = person.academicRecordNumber ?? person.documentId;

    return (
        <label
            htmlFor={`in_event_${person.id}`}
            className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors ${checked ? "bg-brand-50/70 hover:bg-brand-50" : "hover:bg-slate-50"}`}>
            <span className="flex items-center">
                <input
                    id={`in_event_${person.id}`}
                    type="checkbox"
                    checked={checked}
                    onChange={e => onToggle(person.id, e.target.checked)}
                    className="h-4 w-4 rounded" />
                <span className={`ml-3 text-sm ${checked ? "font-medium text-slate-900" : "text-slate-700"}`}>{person.fullName}</span>
            </span>
            <span className="text-xs text-slate-400 tabular-nums">{reference}</span>
        </label>
    )
}

const Group = ({ group, query, selected, open, onOpenChange, onToggle, onSetMany }: EventPeopleGroupProps) => {
    const { name, people } = group;

    const visible = useMemo(
        () => query ? people.filter(x => matchesPerson(x, query)) : people,
        [people, query]);

    const selectedCount = useMemo(
        () => people.filter(x => selected.has(x.id)).length,
        [people, selected]);

    /*
        Verd: tot el grup apuntat. Groc: només una part, per veure d'un cop d'ull
        quins grups queden a mitges. Gris: cap persona apuntada.
    */
    const countClass = selectedCount === 0 ? "badge-gray"
        : selectedCount === people.length ? "badge-green"
            : "badge-amber";

    // Cercant, els grups sense cap coincidència no es mostren i la resta s'obrin sols.
    if (query && visible.length === 0) return null;
    const expanded = query ? true : open;

    // Marcar/desmarcar afecta el que es veu: amb cerca activa, només els resultats.
    const visibleIds = visible.map(x => x.id);
    const allVisibleSelected = visible.length > 0 && visible.every(x => selected.has(x.id));

    return (
        <div className="card mb-3 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <button
                    className="flex items-center rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    onClick={() => onOpenChange(!expanded)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <h3 className="ml-2 font-semibold text-slate-900">{name}</h3>
                    <span className={`badge ml-3 tabular-nums ${countClass}`}>
                        {selectedCount}/{people.length}
                    </span>
                    {query &&
                        <span className="ml-2 text-sm text-slate-400">{visible.length} resultats</span>
                    }
                </button>
                <div className="flex items-center gap-1">
                    <button
                        className="btn btn-ghost btn-sm text-brand-600 hover:text-brand-700"
                        disabled={allVisibleSelected}
                        onClick={() => onSetMany(visibleIds, true)}>Marcar {query ? "resultats" : "tots"}</button>
                    <button
                        className="btn btn-ghost btn-sm hover:bg-red-50 hover:text-red-600"
                        disabled={selectedCount === 0}
                        onClick={() => onSetMany(visibleIds, false)}>Desmarcar</button>
                </div>
            </div>
            {expanded &&
                <ul className="grid gap-0.5 border-t border-slate-100 p-2 lg:grid-cols-2">
                    {visible.map(x => (
                        <li key={x.id}>
                            <PersonRow person={x} checked={selected.has(x.id)} onToggle={onToggle} />
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}

export default Group;
