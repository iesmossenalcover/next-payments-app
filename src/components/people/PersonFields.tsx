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
        <div className="space-y-5">
            <div>
                <label
                    className="form-label"
                    htmlFor="name">Nom</label>
                <input
                    className="form-input"
                    id="name" name="name"
                    value={person.name}
                    onChange={(e) => setPerson({ ...person, name: e.target.value })} />
                {displayKeyErrors("name", errors)}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        className="form-label"
                        htmlFor="surname1">Primer llinatge</label>
                    <input
                        className="form-input"
                        id="surname1" name="surname1"
                        value={person.surname1}
                        onChange={(e) => setPerson({ ...person, surname1: e.target.value })} />
                    {displayKeyErrors("surname1", errors)}
                </div>

                <div>
                    <label
                        className="form-label"
                        htmlFor="surname2">Segon llinatge</label>
                    <input
                        className="form-input"
                        id="surname2" name="surname2"
                        value={person.surname2 ?? ""}
                        onChange={(e) => setPerson({ ...person, surname2: e.target.value })} />
                    {displayKeyErrors("surname2", errors)}
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        className="form-label"
                        htmlFor="documentId"
                    >
                        Document d&apos;identitat</label>
                    <input
                        id="documentId"
                        name="documentId"
                        className="form-input"
                        value={person.documentId}
                        onChange={(e) => setPerson({ ...person, documentId: e.target.value })} />
                    {displayKeyErrors("documentId", errors)}
                </div>

                <div>
                    <label
                        className="form-label"
                        htmlFor="academicRecordNumber">Número expedient acadèmic</label>
                    <input
                        className="form-input"
                        id="academicRecordNumber"
                        name="academicRecordNumber"
                        type="number"
                        value={person.academicRecordNumber ?? ""}
                        onChange={(e) => setPerson({ ...person, academicRecordNumber: parseInt(e.target.value) })} />
                    {displayKeyErrors("academicRecordNumber", errors)}
                </div>
            </div>

            {groups ?
                <div>
                    <label
                        className="form-label"
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

            <div className="flex flex-wrap gap-x-8 gap-y-4 rounded-lg bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                <Toggle
                    name="amipa"
                    id="amipa"
                    value={person.amipa}
                    onToggled={val => setPerson({ ...person, amipa: val })}
                    text="Amipa"
                />
                <Toggle
                    name="enrolled"
                    id="enrolled"
                    value={person.enrolled}
                    onToggled={val => setPerson({ ...person, enrolled: val })}
                    text="Matriculat"
                />
            </div>

            <div>
                <label
                    className="form-label"
                    htmlFor="schoolAlert">Alerta escolar</label>
                <input
                    className="form-input"
                    id="schoolAlert"
                    name="schoolAlert"
                    value={person.schoolAlert ?? ""}
                    onChange={(e) => setPerson({ ...person, schoolAlert: e.target.value })} />
                {displayKeyErrors("schoolAlert", errors)}
            </div>
            <div>
                <label htmlFor="subjectsInfo" className="form-label">Assignatures <span className="font-normal text-slate-400">(una per línia)</span></label>
                <textarea
                    id="subjectsInfo"
                    name="subjectsInfo"
                    rows={4}
                    value={person.subjectsInfo ?? ""}
                    onChange={(e) => setPerson({ ...person, subjectsInfo: e.target.value })}
                    className="form-input"></textarea>
            </div>
            {displayKeyErrors("", errors)}
        </div>
    )
}

export default PersonFields;
