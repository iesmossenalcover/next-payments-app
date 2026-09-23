import { Event } from "@/lib/apis/payments/models";
import { Dispatch } from "react";
import Toggle from "../Toggle";
import { DateTime } from "@/components/form";
import { toInputDateTime } from "@/lib/utils";

interface EventComponentProps {
    errors?: Map<string, string[]>
    event: Event,
    setEvent: Dispatch<Event>
}

const EventFields = ({ event, errors, setEvent }: EventComponentProps) => {

    const displayErrors = (key: string) => {
        if (!errors || !errors.has(key)) return null;

        const list = errors.get(key) as string[];
        return (
            <>
                {list.map((x, idx) => <p key={idx} className="form-error">{x}</p>)}
            </>
        )
    }

    return (
        <div className="space-y-8">
            <section className="space-y-5">
                <h3 className="section-title">Informació general</h3>
                <div>
                    <label
                        className="form-label"
                        htmlFor="name">Nom</label>
                    <input
                        className="form-input"
                        id="name" name="name"
                        value={event.name}
                        onChange={(e) => setEvent({ ...event, name: e.target.value })} />
                    {displayErrors("name")}
                </div>

                <div>
                    <label
                        className="form-label"
                        htmlFor="description">Descripció</label>

                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="form-input"
                        value={event.description}
                        onChange={(e) => setEvent({ ...event, description: e.target.value })}>
                    </textarea>

                    {displayErrors("description")}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            className="form-label"
                            htmlFor="date">Data inici esdeveniment</label>

                        <DateTime
                            className="form-input"
                            id="date"
                            name="date"
                            type="datetime-local"
                            initialValue={toInputDateTime(new Date(event.date))}
                            required={true}
                            onDateChanged={date => setEvent({ ...event, date: date ? date.toISOString() : new Date().toISOString() })} />

                        {displayErrors("description")}
                    </div>

                    <div>
                        <label
                            className="form-label"
                            htmlFor="endDate">Data fi esdeveniment</label>

                        <DateTime
                            className="form-input"
                            id="endDate"
                            name="endDate"
                            type="datetime-local"
                            required={false}
                            initialValue={event.endDate ? toInputDateTime(new Date(event.endDate)) : ""}
                            onDateChanged={date => setEvent({ ...event, endDate: date ? date.toISOString() : undefined })} />

                        {displayErrors("endDate")}
                    </div>
                </div>
            </section>

            <section className="space-y-5 border-t border-slate-200 pt-8">
                <h3 className="section-title">Preus</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            className="form-label"
                            htmlFor="price">Preu</label>
                        <div className="relative">
                            <input
                                className="form-input pr-9"
                                id="price"
                                type="number"
                                step="any"
                                name="price"
                                value={event.price}
                                onChange={(e) => setEvent({ ...event, price: parseFloat(e.target.value) })} />
                            <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-slate-400">€</span>
                        </div>
                        {displayErrors("price")}
                    </div>

                    <div>
                        <label
                            className="form-label"
                            htmlFor="amipaPrice">Preu Amipa</label>
                        <div className="relative">
                            <input
                                className="form-input pr-9"
                                type="number"
                                step="any"
                                id="amipaPrice" name="amipaPrice"
                                value={event.amipaPrice}
                                onChange={(e) => setEvent({ ...event, amipaPrice: parseFloat(e.target.value) })} />
                            <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-slate-400">€</span>
                        </div>
                        {displayErrors("amipaPrice")}
                    </div>
                </div>

                <div>
                    <label
                        className="form-label"
                        htmlFor="maxQuantity">Quantitat màxima que pot adquirir una persona</label>
                    <input
                        className="form-input sm:max-w-[12rem]"
                        type="number"
                        step="1"
                        min="1"
                        id="maxQuantity" name="maxQuantity"
                        value={event.maxQuantity}
                        onChange={(e) => setEvent({ ...event, maxQuantity: parseFloat(e.target.value) })} />
                    {displayErrors("maxQuantity")}
                </div>
            </section>

            <section className="space-y-5 border-t border-slate-200 pt-8">
                <h3 className="section-title">Publicació</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            className="form-label"
                            htmlFor="start">Publicar</label>
                        <DateTime
                            className="form-input"
                            id="start"
                            name="start"
                            type="datetime-local"
                            required={true}
                            initialValue={toInputDateTime(new Date(event.publishDate))}
                            onDateChanged={date => setEvent({ ...event, publishDate: date ? date.toISOString() : new Date().toISOString() })}
                        />
                        {displayErrors("publishDate")}
                    </div>
                    <div>
                        <label
                            className="form-label"
                            htmlFor="end">Retirar</label>
                        <DateTime
                            className="form-input"
                            id="end"
                            name="end"
                            type="datetime-local"
                            required={false}
                            initialValue={event.unpublishDate ? toInputDateTime(new Date(event.unpublishDate)) : ""}
                            onDateChanged={date => setEvent({ ...event, unpublishDate: date ? date.toISOString() : undefined })}
                        />
                        {displayErrors("unpublishDate")}
                    </div>
                </div>

                <div className="space-y-4 rounded-lg bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                    <Toggle
                        name="enrollment"
                        id="enrollment"
                        className="text-slate-700"
                        text="És un event de matrícula?"
                        onToggled={val => setEvent({ ...event, enrollment: val })}
                        value={event.enrollment}
                    />

                    <Toggle
                        name="amipa"
                        id="amipa"
                        className="text-slate-700"
                        text="És un event per ser soci d'AMIPA?"
                        onToggled={val => setEvent({ ...event, amipa: val })}
                        value={event.amipa}
                    />
                </div>
            </section>
        </div>
    )
}

export default EventFields;
