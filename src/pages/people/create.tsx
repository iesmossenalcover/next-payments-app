import { SuccessAlert } from "@/components/Alerts";
import { Selector, SelectorComponent } from "@/components/Selector";
import Toggle from "@/components/Toggle";
import { createPerson, getGroupsSelector } from "@/lib/apis/payments/client";
import { Person } from "@/lib/apis/payments/models";
import { useEffect, useState } from "react";

const defaultPerson: Person = {
    id: 0,
    name: "",
    surname1: "",
    documentId: "",
    groupId: 0,
    amipa: false,
    preEnrollment: false,
};

const Create = () => {
    const [loading, setLoading] = useState(false)
    const [created, setCreated] = useState(false)
    const [errors, setErrors] = useState<Map<string, string[]>>()

    const onSubmit = async (p: Person) => {
        setLoading(true);
        const data = await createPerson(p);
        if (data.error) {
            setErrors(data.errors);
            setLoading(false);
        }
        else {
            const id = data.data as number;
            setCreated(true);
        }
    }

    const formDisabled = () => loading;

    return (
        <div className="max-w-lg m-auto">
            <div className="m-5">
                {created ?
                    <SuccessAlert text="Persona afegida correctament" /> :
                    <PersonComponent
                        disabled={formDisabled()}
                        errors={errors}
                        onSubmit={onSubmit}
                        person={defaultPerson} />
                }
            </div>
        </div>
    )
}


interface PersonComponentProps {
    errors?: Map<string, string[]>
    person: Person,
    disabled: boolean,
    onSubmit: (p: Person) => void,
}

const PersonComponent = ({ person, onSubmit, errors, disabled }: PersonComponentProps) => {
    const [isStudent, setIsStudent] = useState(true)
    const [groups, setGroups] = useState<Selector | undefined>();

    useEffect(() => {
        getGroupsSelector()
            .then(x => setGroups(x));
    }, [])

    const onFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const p: Person = {
            id: 0,
            name: formData.get("name") as string,
            surname1: formData.get("surname1") as string,
            surname2: formData.get("surname2") as string,
            documentId: formData.get("documentId") as string,
            groupId: parseInt(formData.get("groupId") as string),
            academicRecordNumber: isStudent ? parseInt(formData.get("academicRecordNumber") as string) || 0 : undefined,
            preEnrollment: formData.get("preEnrollment") === "on" ? true : false,
            amipa: formData.get("amipa") === "on" ? true : false,
        };
        onSubmit(p);
    }

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
                    />
                </div>

                <div className="mt-3 mb-3">
                    <Toggle
                        name="preEnrollment"
                        id="preEnrollment"
                        value={person.preEnrollment}
                        text="Prematrícula"
                    />
                </div>
            </>
        )
    }

    if (!groups || !groups) return null;

    return (
        <form action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">

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
                    name=""
                    id=""
                    value={isStudent}
                    text="És estudiant?"
                    onToggled={x => setIsStudent(x)}
                />
            </div>
            {displayStudentFields()}
            <div>
                <input
                    disabled={disabled}
                    className="w-full mt-6 bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                    value="Afegir persona"
                    type="submit" />
            </div>

        </form>
    )
}

export default Create;