import { getGroupsSelector } from "@/lib/apis/payments/client";
import { Person } from "@/lib/apis/payments/models";
import { Dispatch } from "react";
import { SelectorComponent } from "../Selector";
import Toggle from "../Toggle";
import { useStartApiRequest } from "@/lib/hooks/useApiRequest";
import { displayKeyErrors } from "@/lib/utils";

interface PersonComponentProps {
    errors?: Map<string, string[]>
    person: Person,
    setPerson: Dispatch<Person>
}

const PersonFields = ({ person, errors, setPerson }: PersonComponentProps) => {
    const { data: groups } = useStartApiRequest(getGroupsSelector);

    if (groups)
        groups.selected = person.groupId ? person.groupId.toString() : "";

    return (
        <>
            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="name">Nom</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="name" name="name"
                    value={person.name}
                    onChange={(e) => setPerson({ ...person, name: e.target.value })} />
                {displayKeyErrors("name", errors)}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="surname1">Primer llinatge</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="surname1" name="surname1"
                    value={person.surname1}
                    onChange={(e) => setPerson({ ...person, surname1: e.target.value })} />
                {displayKeyErrors("surname1", errors)}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="surname2">Segon llinatge</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="surname2" name="surname2"
                    value={person.surname2 ?? ""}
                    onChange={(e) => setPerson({ ...person, surname2: e.target.value })} />
                {displayKeyErrors("surname2", errors)}
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
                    value={person.documentId}
                    onChange={(e) => setPerson({ ...person, documentId: e.target.value })} />
                {displayKeyErrors("documentId", errors)}
            </div>
            {groups ?
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
                        onSelect={val => setPerson({ ...person, groupId: parseInt(val) })} />
                    {displayKeyErrors("groupId", errors)}
                </div>
                : null
            }
            <div>
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="academicRecordNumber">Número expedient acadèmic</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="academicRecordNumber"
                    name="academicRecordNumber"
                    type="number"
                    value={person.academicRecordNumber ?? ""}
                    onChange={(e) => setPerson({ ...person, academicRecordNumber: parseInt(e.target.value) })} />
                {displayKeyErrors("academicRecordNumber", errors)}
            </div>
            <div className="mt-5">
                <Toggle
                    name="amipa"
                    id="amipa"
                    value={person.amipa}
                    onToggled={val => setPerson({ ...person, amipa: val })}
                    text="Amipa"
                />
            </div>
            <div className="mt-3">
                <Toggle
                    name="enrolled"
                    id="enrolled"
                    value={person.enrolled}
                    onToggled={val => setPerson({ ...person, enrolled: val })}
                    text="Matriculat"
                />
            </div>
            <div className="mt-5">
                <label htmlFor="subjectsInfo" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">ASSIGNATURES <span className="lowercase">(una per línia)</span></label>
                <textarea
                    id="subjectsInfo"
                    name="subjectsInfo"
                    rows={4}
                    value={person.subjectsInfo ?? ""}
                    onChange={(e) => setPerson({ ...person, subjectsInfo: e.target.value })}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div className="mt-3">
                {displayKeyErrors("", errors)}
            </div>
        </>
    )
}

export default PersonFields;