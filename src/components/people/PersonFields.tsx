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

const PersonFields = ({ person, errors, allowSetStudent = true }: PersonComponentProps) => {
    const [isStudent, setIsStudent] = useState(true)
    const [groups, setGroups] = useState<Selector | undefined>();

    useEffect(() => {
        getGroupsSelector()
            .then(x => {
                x.selected = person.groupId.toString();
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

    const displayStudentFields = () => {
        if (!isStudent) return null;

        return (
            <>
                <div>
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="academicRecordNumber">Número expedient acadèmic</label>
                    <input
                        className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                        id="academicRecordNumber" name="academicRecordNumber" defaultValue={person.academicRecordNumber} />
                    {displayErrors("academicRecordNumber")}
                </div>

                <div className="mt-3">
                    <Toggle
                        name="amipa"
                        id="amipa"
                        value={person.amipa}
                        text="Amipa"
                        enabled={true}
                    />
                </div>
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
            <div className="mt-3 mb-3">
                <Toggle
                    name="isStudent"
                    id="isStudent"
                    value={isStudent}
                    text="És estudiant?"
                    enabled={allowSetStudent}
                    onToggled={x => setIsStudent(x)}
                />
            </div>
            {displayStudentFields()}
        </>
    )
}

export default PersonFields;