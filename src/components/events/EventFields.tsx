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
                {list.map((x, idx) => <p key={idx} className="text-red-500 italic">{x}</p>)}
            </>
        )
    }

    return (
        <>
            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="name">Nom</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="name" name="name"
                    value={event.name}
                    onChange={(e) => setEvent({ ...event, name: e.target.value })} />
                {displayErrors("name")}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="description">Descripció</label>

                <textarea
                    id="description"
                    name="description"
                    rows={5}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={event.description}
                    onChange={(e) => setEvent({ ...event, description: e.target.value })}>
                </textarea>

                {displayErrors("description")}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="date">Data esdeveniment</label>

                <DateTime
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    id="date"
                    name="date"
                    type="datetime-local"
                    initialValue={toInputDateTime(new Date(event.date))}
                    required={true}
                    onDateChanged={date => setEvent({ ...event, date: date ? date.toISOString() : new Date().toISOString() })} />

                {displayErrors("description")}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="price">Preu</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="price"
                    type="number"
                    step="any"
                    name="price"
                    value={event.price}
                    onChange={(e) => setEvent({ ...event, price: parseFloat(e.target.value) })} />
                {displayErrors("price")}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="amipaPrice">Preu Amipa</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    type="number"
                    step="any"
                    id="amipaPrice" name="amipaPrice"
                    value={event.amipaPrice}
                    onChange={(e) => setEvent({ ...event, amipaPrice: parseFloat(e.target.value) })} />
                {displayErrors("amipaPrice")}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="maxQuantity">Quanitat màxima que pot adquirir una persona</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    type="number"
                    step="1"
                    min="1"
                    id="maxQuantity" name="maxQuantity"
                    value={event.maxQuantity}
                    onChange={(e) => setEvent({ ...event, maxQuantity: parseFloat(e.target.value) })} />
                {displayErrors("maxQuantity")}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="start">Publicar</label>
                <DateTime
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    id="start"
                    name="start"
                    type="datetime-local"
                    required={true}
                    initialValue={toInputDateTime(new Date(event.publishDate))}
                    onDateChanged={date => setEvent({ ...event, publishDate: date ? date.toISOString() : new Date().toISOString() })}
                />
                {displayErrors("publishDate")}
            </div>
            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="end">Retirar</label>
                <DateTime
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    id="end"
                    name="end"
                    type="datetime-local"
                    required={false}
                    initialValue={event.unpublishDate ? toInputDateTime(new Date(event.unpublishDate)) : ""}
                    onDateChanged={date => setEvent({ ...event, unpublishDate: date ? date.toISOString() : undefined })}
                />
                {displayErrors("unpublishDate")}
            </div>
            <div className="mb-6">
                <Toggle
                    name="enrollment"
                    id="enrollment"
                    className="text-green-600"
                    text="És un event de matricula?"
                    onToggled={val => setEvent({ ...event, enrollment: val })}
                    value={event.enrollment}
                />
            </div>

            <div className="mb-6">
                <Toggle
                    name="amipa"
                    id="amipa"
                    className="text-orange-600"
                    text="És un event per ser soci d'AMIPA?"
                    onToggled={val => setEvent({ ...event, amipa: val })}
                    value={event.amipa}
                />
            </div>

        </>
    )
}

export default EventFields;