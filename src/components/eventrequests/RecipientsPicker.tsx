import { getEventRequestGroupPeople, getGroupsSelector } from "@/lib/apis/payments/client";
import { EventRequestRecipient, EventRequestRecipientType, GroupPerson } from "@/lib/apis/payments/models";
import { normalize } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

// Tria dels destinataris de la sol·licitud: grups sencers o només alguns alumnes de cada grup.
// Si es marca tot el grup es guarda com a destinatari Grup (inclou els alumnes que s'hi afegeixin més tard);
// si se'n treu algun, es guarden els alumnes triats un a un.

interface RecipientsPickerProps {
    recipients: EventRequestRecipient[],
    onChange: (recipients: EventRequestRecipient[]) => void,
}

interface GroupOption {
    id: number,
    name: string,
}

const isGroup = (x: EventRequestRecipient, groupId: number) => x.type === EventRequestRecipientType.Group && x.referenceId === groupId;
const isPerson = (x: EventRequestRecipient) => x.type === EventRequestRecipientType.Person;

// Casella amb estat intermedi (alguns alumnes del grup).
const Checkbox = ({ checked, indeterminate, onChange, label }: { checked: boolean, indeterminate?: boolean, onChange: () => void, label: string }) => {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
    return <input ref={ref} type="checkbox" aria-label={label} className="h-5 w-5 shrink-0 cursor-pointer accent-brand-600" checked={checked} onChange={onChange} />;
}

const Chevron = ({ open }: { open: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const RecipientsPicker = ({ recipients, onChange }: RecipientsPickerProps) => {
    const [groups, setGroups] = useState<GroupOption[]>([]);
    const [members, setMembers] = useState<Map<number, GroupPerson[]>>(new Map());
    const [expanded, setExpanded] = useState<number>();
    const [groupFilter, setGroupFilter] = useState("");
    const [personFilter, setPersonFilter] = useState("");

    useEffect(() => {
        getGroupsSelector()
            .then(x => setGroups(x.options.map(o => ({ id: Number(o.key), name: String(o.value) }))))
            .catch(() => setGroups([]));
    }, []);

    const loadMembers = (groupId: number) => {
        if (members.has(groupId)) return Promise.resolve(members.get(groupId)!);
        return getEventRequestGroupPeople(groupId).then(list => {
            setMembers(prev => new Map(prev).set(groupId, list));
            return list;
        });
    }

    // Grup de cada alumne triat: el que diu la sol·licitud o el de la llista d'alumnes ja carregada.
    const personGroup = useMemo(() => {
        const map = new Map<number, number>();
        members.forEach((list, groupId) => list.forEach(p => map.set(p.id, groupId)));
        recipients.filter(isPerson).forEach(x => { if (x.groupId !== undefined && x.groupId !== null) map.set(x.referenceId, x.groupId); });
        return map;
    }, [members, recipients]);

    const wholeGroups = useMemo(() => new Set(recipients.filter(x => x.type === EventRequestRecipientType.Group).map(x => x.referenceId)), [recipients]);
    const peopleOf = (groupId: number) => recipients.filter(x => isPerson(x) && personGroup.get(x.referenceId) === groupId);
    const ungrouped = recipients.filter(x => isPerson(x) && !personGroup.has(x.referenceId));

    // Treu tot el que hi ha triat d'un grup (el grup sencer i els alumnes un a un).
    const withoutGroup = (groupId: number) => recipients.filter(x => !isGroup(x, groupId) && !(isPerson(x) && personGroup.get(x.referenceId) === groupId));

    const groupName = (groupId: number) => groups.find(g => g.id === groupId)?.name;

    // Desa la selecció d'un grup: si hi són tots, com a grup sencer.
    const setGroupSelection = (groupId: number, list: GroupPerson[], selectedIds: Set<number>) => {
        const rest = withoutGroup(groupId);
        if (selectedIds.size === 0) return onChange(rest);
        if (list.length > 0 && list.every(p => selectedIds.has(p.id))) {
            return onChange([...rest, { type: EventRequestRecipientType.Group, referenceId: groupId, name: groupName(groupId) }]);
        }
        onChange([...rest, ...list.filter(p => selectedIds.has(p.id)).map(p => ({
            type: EventRequestRecipientType.Person, referenceId: p.id, name: p.name, groupId, groupName: groupName(groupId),
        }))]);
    }

    const toggleGroup = (groupId: number) => {
        // Tot el grup → cap; alguns o cap → tot el grup.
        if (wholeGroups.has(groupId)) return onChange(withoutGroup(groupId));
        onChange([...withoutGroup(groupId), { type: EventRequestRecipientType.Group, referenceId: groupId, name: groupName(groupId) }]);
    }

    const togglePerson = (groupId: number, personId: number) => {
        const list = members.get(groupId) ?? [];
        const selected = new Set(wholeGroups.has(groupId) ? list.map(p => p.id) : peopleOf(groupId).map(x => x.referenceId));
        if (selected.has(personId)) selected.delete(personId); else selected.add(personId);
        setGroupSelection(groupId, list, selected);
    }

    const toggleExpanded = (groupId: number) => {
        setPersonFilter("");
        if (expanded === groupId) return setExpanded(undefined);
        setExpanded(groupId);
        loadMembers(groupId);
    }

    const filter = normalize(groupFilter);
    const visibleGroups = groups.filter(x => !filter || normalize(x.name).includes(filter));

    // Grups amb alguna cosa triada, per al resum de dalt.
    const summary = groups
        .map(g => ({ group: g, whole: wholeGroups.has(g.id), count: peopleOf(g.id).length }))
        .filter(x => x.whole || x.count > 0);

    const selectionLabel = (groupId: number) => {
        const total = members.get(groupId)?.length;
        if (wholeGroups.has(groupId)) return total !== undefined ? `Tot el grup (${total})` : "Tot el grup";
        const count = peopleOf(groupId).length;
        if (count === 0) return total !== undefined ? `${total} alumnes` : "";
        return total !== undefined ? `${count} de ${total}` : `${count} ${count === 1 ? "alumne" : "alumnes"}`;
    }

    const renderMembers = (groupId: number) => {
        const list = members.get(groupId);
        if (!list) return <div className="flex justify-center py-4"><span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" /></div>;
        if (list.length === 0) return <p className="px-3 py-3 text-sm text-slate-500">Aquest grup no té alumnes aquest curs.</p>;

        const whole = wholeGroups.has(groupId);
        const selected = new Set(whole ? list.map(p => p.id) : peopleOf(groupId).map(x => x.referenceId));
        const pf = normalize(personFilter);
        const visible = list.filter(p => !pf || normalize(p.name).includes(pf));

        return (
            <div className="space-y-2 pb-2">
                <div className="flex flex-wrap items-center gap-2 px-3">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setGroupSelection(groupId, list, new Set(list.map(p => p.id)))}>Tots</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setGroupSelection(groupId, list, new Set())}>Cap</button>
                    {list.length > 10 &&
                        <input
                            type="search"
                            aria-label="Cerca un alumne"
                            placeholder="Cerca un alumne"
                            className="form-input min-w-0 flex-1 py-1"
                            value={personFilter}
                            onChange={e => setPersonFilter(e.currentTarget.value)} />}
                </div>
                <ul>
                    {visible.map(p => (
                        <li key={p.id}>
                            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-slate-50">
                                <Checkbox label={p.name} checked={selected.has(p.id)} onChange={() => togglePerson(groupId, p.id)} />
                                <span className="min-w-0 flex-1">{p.name}</span>
                            </label>
                        </li>
                    ))}
                    {visible.length === 0 && <li className="px-3 py-2 text-sm text-slate-500">Cap alumne coincideix amb la cerca.</li>}
                </ul>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h3 className="section-title">Grups i alumnes participants</h3>
                    <p className="form-hint">Marca un grup sencer o obre&apos;l per triar només alguns alumnes.</p>
                </div>
                <input
                    type="search"
                    aria-label="Filtrar grups"
                    placeholder="Cerca un grup"
                    className="form-input sm:max-w-56"
                    value={groupFilter}
                    onChange={(e) => setGroupFilter(e.currentTarget.value)} />
            </div>

            {(summary.length > 0 || ungrouped.length > 0) &&
                <div className="flex flex-wrap gap-2">
                    {summary.map(x => (
                        <button
                            key={x.group.id}
                            type="button"
                            className="badge badge-purple cursor-pointer"
                            onClick={() => { if (expanded !== x.group.id) toggleExpanded(x.group.id); }}>
                            {x.group.name} · {x.whole ? "tot el grup" : `${x.count} ${x.count === 1 ? "alumne" : "alumnes"}`}
                        </button>
                    ))}
                    {ungrouped.length > 0 && <span className="badge badge-gray">{ungrouped.length} {ungrouped.length === 1 ? "alumne" : "alumnes"} sense grup</span>}
                </div>}

            <ul className="divide-y divide-slate-100 rounded-lg ring-1 ring-slate-200 sm:max-h-[28rem] sm:overflow-y-auto">
                {visibleGroups.map(g => {
                    const whole = wholeGroups.has(g.id);
                    const partial = !whole && peopleOf(g.id).length > 0;
                    const open = expanded === g.id;
                    return (
                        <li key={g.id} className={open ? "bg-slate-50/60" : ""}>
                            <div className="flex items-center">
                                <label className="flex min-h-12 min-w-0 flex-1 cursor-pointer items-center gap-3 px-3 py-2 text-sm">
                                    <Checkbox label={`Tot el grup ${g.name}`} checked={whole} indeterminate={partial} onChange={() => toggleGroup(g.id)} />
                                    <span className="min-w-0 flex-1 truncate font-medium text-slate-900">{g.name}</span>
                                    <span className="shrink-0 text-xs text-slate-500">{selectionLabel(g.id)}</span>
                                </label>
                                <button
                                    type="button"
                                    aria-expanded={open}
                                    aria-label={open ? `Amagar els alumnes de ${g.name}` : `Veure els alumnes de ${g.name}`}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center text-slate-500 hover:text-slate-900"
                                    onClick={() => toggleExpanded(g.id)}>
                                    <Chevron open={open} />
                                </button>
                            </div>
                            {open && renderMembers(g.id)}
                        </li>
                    );
                })}
                {visibleGroups.length === 0 && <li className="px-3 py-3 text-sm text-slate-500">No hi ha grups.</li>}
            </ul>

            {ungrouped.length > 0 &&
                <div className="rounded-lg p-3 ring-1 ring-slate-200">
                    <p className="mb-2 text-sm font-medium text-slate-900">Alumnes sense grup aquest curs</p>
                    <ul className="flex flex-wrap gap-2">
                        {ungrouped.map(x => (
                            <li key={x.referenceId} className="badge badge-gray flex items-center gap-1">
                                {x.name ?? `#${x.referenceId}`}
                                <button type="button" aria-label="Treure" className="ml-1" onClick={() => onChange(recipients.filter(r => r !== x))}>×</button>
                            </li>
                        ))}
                    </ul>
                </div>}
        </div>
    );
}

export default RecipientsPicker;
