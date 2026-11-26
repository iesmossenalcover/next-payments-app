import { CalendarDateTime } from "@/components/form";
import { EventRequestData } from "@/lib/apis/payments/models";
import { Dispatch } from "react";
import RecipientsPicker from "./RecipientsPicker";

interface EventRequestFieldsProps {
    errors?: Map<string, string[]>,
    data: EventRequestData,
    setData: Dispatch<EventRequestData>,
}

// Formulari de la sol·licitud. De moment només els camps mínims; s'ampliarà més endavant.
const EventRequestFields = ({ data, errors, setData }: EventRequestFieldsProps) => {
    const displayErrors = (key: string) => {
        if (!errors || !errors.has(key)) return null;
        return <>{(errors.get(key) as string[]).map((x, idx) => <p key={idx} className="form-error">{x}</p>)}</>;
    }

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
                        <CalendarDateTime
                            id="startDate"
                            title="Data d'inici"
                            required={true}
                            value={data.startDate || undefined}
                            rangeStart={data.startDate}
                            rangeEnd={data.endDate}
                            onChange={(iso) => setData({ ...data, startDate: iso ?? "" })} />
                        {displayErrors("startDate")}
                    </div>
                    <div>
                        <label className="form-label" htmlFor="endDate">Data de finalització</label>
                        <CalendarDateTime
                            id="endDate"
                            title="Data de finalització"
                            defaultTime="17:00"
                            placeholder="Opcional"
                            value={data.endDate}
                            rangeStart={data.startDate}
                            rangeEnd={data.endDate}
                            onChange={(iso) => setData({ ...data, endDate: iso })} />
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
                        <CalendarDateTime
                            id="paymentDeadline"
                            title="Data límit de pagament"
                            defaultTime="23:59"
                            placeholder="Opcional"
                            value={data.paymentDeadline}
                            rangeStart={data.startDate}
                            rangeEnd={data.endDate}
                            onChange={(iso) => setData({ ...data, paymentDeadline: iso })} />
                        {displayErrors("paymentDeadline")}
                    </div>
                </div>
            </section>

            <section>
                <RecipientsPicker recipients={data.recipients} onChange={(recipients) => setData({ ...data, recipients })} />
                {displayErrors("recipients")}
            </section>
        </div>
    )
}

export default EventRequestFields;
