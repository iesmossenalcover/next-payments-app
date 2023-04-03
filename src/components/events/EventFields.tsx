import { Event } from "@/lib/apis/payments/models";
import { useState } from "react";
import Toggle from "../Toggle";

interface EventComponentProps {
    errors?: Map<string, string[]>
    event: Event,
}

const EventFields = ({ event, errors }: EventComponentProps) => {

    const [isEnrollment, setIsEnrollment] = useState(!!event.enrollment)
    const [isAmpipa, setIsAmpipa] = useState(!!event.amipa)

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
                    id="name" name="name" defaultValue={event.name} />
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
                    defaultValue={event.description}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                </textarea>

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
                    name="price" defaultValue={event.price} />
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
                    id="amipaPrice" name="amipaPrice" defaultValue={event.amipaPrice} />
                {displayErrors("amipaPrice")}
            </div>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="start">Publicar</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Data finalització"
                        name="start" id="start" type="datetime-local" defaultValue={event.publishDate} />
                </div>
                <span className="mx-2 pt-7 text-gray-500 uppercase tracking-wide text-lg font-bold mb-2">fins</span>
                <div>
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="end">Retirar</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Data finalització"
                        name="end" id="end" type="datetime-local" defaultValue={event.unpublishDate} />
                </div>
            </div>
            <div className="mb-6">
                <Toggle
                    name="enrollment"
                    id="enrollment"
                    className="text-green-600"
                    value={isEnrollment}
                    text="És un event de matricula?"
                    onToggled={x => setIsEnrollment(x)}
                />
            </div>

            <div className="mb-6">
                <Toggle
                    name="amipa"
                    value={isAmpipa}
                    id="amipa"
                    className="text-orange-600"
                    text="És un event per ser soci d'AMIPA?"
                    onToggled={x => setIsAmpipa(x)}
                />
            </div>

        </>
    )
}

export default EventFields;