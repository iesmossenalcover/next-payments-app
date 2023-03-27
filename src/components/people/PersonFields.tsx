import { getGroupsSelector } from "@/lib/apis/payments/client";
import { Person } from "@/lib/apis/payments/models";
import { useState, useEffect } from "react";
import { Selector, SelectorComponent } from "../Selector";
import Toggle from "../Toggle";

interface PersonComponentProps {
    errors?: Map<string, string[]>
    person: Person,
    allowSetStudent: boolean
}

const PersonFields = ({ person, errors }: PersonComponentProps) => {
    const [groups, setGroups] = useState<Selector | undefined>();

    useEffect(() => {
        getGroupsSelector()
            .then(x => {
                x.selected = person.groupId?.toString() ?? "";
                setGroups(x);
            });
    }, [person.groupId])

    const displayErrors = (key: string) => {
        if (!errors || !errors.has(key)) return null;

        const list = errors.get(key) as string[];
        return (
            <>
                {list.map((x, idx) => <p key={idx} className="text-red-500 italic">{x}</p>)}
            </>
        )
    }

    if (!groups || !groups) return null;

    return (
        <>
            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="name">Nom</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="name" name="name" defaultValue={person.name} />
                {displayErrors("name")}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="surname1">Primer llinatge</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="surname1" name="surname1" defaultValue={person.surname1} />
                {displayErrors("surname1")}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="surname2">Segon llinatge</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="surname2" name="surname2" defaultValue={person.surname2} />
                {displayErrors("surname2")}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="documentId"
                >
                    Document d&apos;identitat</label>
                <input
                    id="documentId"
                    name="documentId"
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    defaultValue={person.documentId} />
                {displayErrors("documentId")}
            </div>
            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="groupId"
                >
                    Grup al curs actual</label>
                <SelectorComponent
                    id="groupId"
                    name="groupId"
                    selector={groups}
                    onSelect={() => { }} />
                {displayErrors("groupId")}
            </div>
            <div>
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="academicRecordNumber">Número expedient acadèmic</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="academicRecordNumber" name="academicRecordNumber" defaultValue={person.academicRecordNumber} />
                {displayErrors("academicRecordNumber")}
            </div>
            <div className="mt-5">
                <Toggle
                    name="amipa"
                    id="amipa"
                    value={person.amipa}
                    text="Amipa"
                />
            </div>
            <div className="mt-3">
                <Toggle
                    name="enrolled"
                    id="enrolled"
                    value={person.enrolled}
                    text="Matriculat"
                />
            </div>
            <div className="mt-5">                
                <label htmlFor="subjectsInfo" className="block mb-2 text-md font-medium text-gray-900">Assignatures (una per línia)</label>
                <textarea id="subjectsInfo"
                    name="subjectsInfo"
                    rows={4}
                    defaultValue={person.subjectsInfo}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div className="mt-3">
                {displayErrors("")}
            </div>
        </>
    )
}

export default PersonFields;