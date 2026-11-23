import { DateTime } from "@/components/form";
import { getGroupsSelector } from "@/lib/apis/payments/client";
import { EventRequestData, EventRequestRecipientType } from "@/lib/apis/payments/models";
import { normalize, toInputDateTime } from "@/lib/utils";
import { Dispatch, useEffect, useMemo, useState } from "react";

interface EventRequestFieldsProps {
    errors?: Map<string, string[]>,
    data: EventRequestData,
    setData: Dispatch<EventRequestData>,
}

interface GroupOption {
    id: number,
    name: string,
}

// Formulari de la sol·licitud. De moment només els camps mínims; s'ampliarà més endavant.
const EventRequestFields = ({ data, errors, setData }: EventRequestFieldsProps) => {
    const [groups, setGroups] = useState<GroupOption[]>([]);
    const [groupFilter, setGroupFilter] = useState("");

    useEffect(() => {
        getGroupsSelector()
            .then(x => setGroups(x.options.map(o => ({ id: Number(o.key), name: String(o.value) }))))
            .catch(() => setGroups([]));
    }, []);

    const displayErrors = (key: string) => {
        if (!errors || !errors.has(key)) return null;
        return <>{(errors.get(key) as string[]).map((x, idx) => <p key={idx} className="form-error">{x}</p>)}</>;
    }

    const selectedGroups = useMemo(() => new Set(data.recipients
        .filter(x => x.type === EventRequestRecipientType.Group)
        .map(x => x.referenceId)), [data.recipients]);

    const toggleGroup = (id: number) => {
        const recipients = selectedGroups.has(id)
            ? data.recipients.filter(x => !(x.type === EventRequestRecipientType.Group && x.referenceId === id))
            : [...data.recipients, { type: EventRequestRecipientType.Group, referenceId: id }];
        setData({ ...data, recipients });
    }

    const filter = normalize(groupFilter);
    const visibleGroups = groups.filter(x => !filter || normalize(x.name).includes(filter));

    return (
        <div className="space-y-8">
            <section className="space-y-5">
                <h3 className="section-title">Informació general</h3>
                <div>
                    <label className="form-label" htmlFor="title">Títol</label>
                    <input
                        className="form-input"
                        id="title" name="title"
                        value={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })} />
                    {displayErrors("title")}
                </div>
                <div>
                    <label className="form-label" htmlFor="description">Descripció</label>
                    <textarea
                        className="form-input min-h-32"
                        id="description" name="description"
                        value={data.description}
                        onChange={(e) => setData({ ...data, description: e.target.value })} />
                    {displayErrors("description")}
                </div>
            </section>

            <section className="space-y-5">
                <h3 className="section-title">Dates i preu</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="form-label" htmlFor="startDate">Data d&apos;inici</label>
                        <DateTime
                            className="form-input"
                            id="startDate" name="startDate"
                            type="datetime-local"
                            required={true}
                            initialValue={data.startDate ? toInputDateTime(new Date(data.startDate)) : ""}
                            onDateChanged={(d) => setData({ ...data, startDate: d && !isNaN(d.getTime()) ? d.toISOString() : "" })} />
                        {displayErrors("startDate")}
                    </div>
                    <div>
                        <label className="form-label" htmlFor="endDate">Data de finalització</label>
                        <DateTime
                            className="form-input"
                            id="endDate" name="endDate"
                            type="datetime-local"
                            required={false}
                            initialValue={data.endDate ? toInputDateTime(new Date(data.endDate)) : ""}
                            onDateChanged={(d) => setData({ ...data, endDate: d && !isNaN(d.getTime()) ? d.toISOString() : undefined })} />
                        {displayErrors("endDate")}
                    </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="form-label" htmlFor="price">Preu</label>
                        <div className="relative">
                            <input
                                className="form-input pr-9"
                                id="price" name="price"
                                type="number" min={0} step="0.01"
                                value={data.price}
                                onChange={(e) => setData({ ...data, price: e.target.value === "" ? 0 : Number(e.target.value) })} />
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">€</span>
                        </div>
                        {displayErrors("price")}
                    </div>
                    <div>
                        <label className="form-label" htmlFor="paymentDeadline">Data límit de pagament</label>
                        <DateTime
                            className="form-input"
                            id="paymentDeadline" name="paymentDeadline"
                            type="datetime-local"
                            required={false}
                            initialValue={data.paymentDeadline ? toInputDateTime(new Date(data.paymentDeadline)) : ""}
                            onDateChanged={(d) => setData({ ...data, paymentDeadline: d && !isNaN(d.getTime()) ? d.toISOString() : undefined })} />
                        {displayErrors("paymentDeadline")}
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h3 className="section-title">Grups participants</h3>
                        <p className="form-hint">{selectedGroups.size} {selectedGroups.size === 1 ? "grup seleccionat" : "grups seleccionats"}</p>
                    </div>
                    <input
                        type="search"
                        aria-label="Filtrar grups"
                        placeholder="Cerca un grup"
                        className="form-input sm:max-w-56"
                        value={groupFilter}
                        onChange={(e) => setGroupFilter(e.currentTarget.value)} />
                </div>
                <div className="grid max-h-64 gap-1 overflow-y-auto rounded-lg p-1 ring-1 ring-slate-200 sm:grid-cols-3">
                    {visibleGroups.map(g => (
                        <label key={g.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50">
                            <input
                                type="checkbox"
                                checked={selectedGroups.has(g.id)}
                                onChange={() => toggleGroup(g.id)} />
                            {g.name}
                        </label>
                    ))}
                    {visibleGroups.length === 0 && <p className="col-span-full px-2 py-3 text-sm text-slate-500">No hi ha grups.</p>}
                </div>
                {displayErrors("recipients")}
            </section>
        </div>
    )
}

export default EventRequestFields;
