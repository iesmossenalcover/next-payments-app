import { getGroupsSelector } from "@/lib/apis/payments/client";
import { Person } from "@/lib/apis/payments/models";
import { useState, useEffect } from "react";
import { Selector, SelectorComponent } from "../Selector";
import Toggle from "../Toggle";
import { useStartApiRequest } from "@/lib/hooks/useApiRequest";
import { displayKeyErrors } from "@/lib/utils";

interface PersonComponentProps {
    errors?: Map<string, string[]>
    person: Person,
    allowSetStudent: boolean
}

const
    PersonFields = ({ person, errors }: PersonComponentProps) => {
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
                        id="name" name="name" defaultValue={person.name} />
                    {displayKeyErrors("name", errors)}
                </div>

                <div className="mb-6">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="surname1">Primer llinatge</label>
                    <input
                        className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                        id="surname1" name="surname1" defaultValue={person.surname1} />
                    {displayKeyErrors("surname1", errors)}
                </div>

                <div className="mb-6">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="surname2">Segon llinatge</label>
                    <input
                        className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                        id="surname2" name="surname2" defaultValue={person.surname2} />
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
                        defaultValue={person.documentId} />
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
                            onSelect={() => { }} />
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
                        id="academicRecordNumber" name="academicRecordNumber" defaultValue={person.academicRecordNumber} />
                    {displayKeyErrors("academicRecordNumber", errors)}
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
                    <label htmlFor="subjectsInfo" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">ASSIGNATURES <span className="lowercase">(una per línia)</span></label>
                    <textarea id="subjectsInfo"
                        name="subjectsInfo"
                        rows={4}
                        defaultValue={person.subjectsInfo}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                <div className="mt-3">
                    {displayKeyErrors("", errors)}
                </div>
            </>
        )
    }

export default PersonFields;