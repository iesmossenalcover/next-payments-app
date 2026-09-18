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
            className={`flex items-center justify-between py-2 px-3 rounded cursor-pointer hover:bg-gray-50 ${checked ? "bg-green-50" : ""}`}>
            <span className="flex items-center">
                <input
                    id={`in_event_${person.id}`}
                    type="checkbox"
                    checked={checked}
                    onChange={e => onToggle(person.id, e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-3 font-medium">{person.fullName}</span>
            </span>
            <span className="text-sm text-gray-400 tabular-nums">{reference}</span>
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

    // Cercant, els grups sense cap coincidència no es mostren i la resta s'obrin sols.
    if (query && visible.length === 0) return null;
    const expanded = query ? true : open;

    // Marcar/desmarcar afecta el que es veu: amb cerca activa, només els resultats.
    const visibleIds = visible.map(x => x.id);
    const allVisibleSelected = visible.length > 0 && visible.every(x => selected.has(x.id));

    return (
        <div className="mb-3 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-3 py-2">
                <button
                    className="flex items-center text-left"
                    onClick={() => onOpenChange(!expanded)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <h3 className="ml-2 font-semibold">{name}</h3>
                    <span className={`ml-3 text-sm px-2 py-0.5 rounded-full tabular-nums ${selectedCount > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                        {selectedCount}/{people.length}
                    </span>
                    {query &&
                        <span className="ml-2 text-sm text-gray-400">{visible.length} resultats</span>
                    }
                </button>
                <div className="text-sm">
                    <button
                        className="text-blue-600 hover:underline disabled:text-gray-300 disabled:no-underline"
                        disabled={allVisibleSelected}
                        onClick={() => onSetMany(visibleIds, true)}>Marcar {query ? "resultats" : "tots"}</button>
                    <button
                        className="ml-4 text-gray-500 hover:text-red-600 hover:underline disabled:text-gray-300 disabled:no-underline"
                        disabled={selectedCount === 0}
                        onClick={() => onSetMany(visibleIds, false)}>Desmarcar</button>
                </div>
            </div>
            {expanded &&
                <ul className="border-t border-gray-100 px-2 py-2">
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
