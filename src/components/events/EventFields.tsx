import { getGroupsSelector } from "@/lib/apis/payments/client";
import { Event } from "@/lib/apis/payments/models";
import { useState, useEffect } from "react";
import { Selector, SelectorComponent } from "../Selector";
import Toggle from "../Toggle";

interface EventComponentProps {
    errors?: Map<string, string[]>
    event: Event,
    allowSetEvent: boolean
}

const EventFields = ({ event, errors, allowSetEvent = true }: EventComponentProps) => {

    const [isEnrollment, setIsEnrollment] = useState(!!event.enrollment)

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
                    htmlFor="price">Preu</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="price" name="price" defaultValue={event.price} />
                {displayErrors("price")}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="amipaPrice">Preu Amipa</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="amipaPrice" name="amipaPrice" defaultValue={event.amipaPrice} />
                {displayErrors("amipaPrice")}
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="start">Publicar</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Data finalització"
                        name="start" id="start" type="date" defaultValue={event.amipaPrice} />
                </div>
                <span className="mx-2 pt-7 text-gray-500 uppercase tracking-wide text-lg font-bold mb-2">fins</span>
                <div>
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="end">Retirar</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Data finalització"
                        name="end" id="end" type="date" defaultValue={event.amipaPrice} />
                </div>
            </div>
            <div className="mt-3 mb-3">
                <Toggle
                    name="enrollment"
                    id="enrollment"
                    value={isEnrollment}
                    text="És un event de matricula?"
                    onToggled={x => setIsEnrollment(x)}
                />
            </div>

        </>
    )
}

export default EventFields;