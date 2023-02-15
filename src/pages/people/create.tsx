import { Selector, SelectorComponent } from "@/components/Selector";
import Toggle from "@/components/Toggle";
import { getCoursesSelector, getGroupsSelector } from "@/lib/apis/payments/client";
import { Person } from "@/lib/apis/payments/models";
import { useEffect, useState } from "react";

const Create = () => {
    const p: Person = {
        id: 0,
        name: "",
        surname1: "",
        documentId: "",
        groupId: 0,
        amipa: false,
        preEnrollment: false,
    };
    return (
        <div className="max-w-lg m-auto">
            <div className="m-5">
                <PersonComponent
                    onSubmit={x => console.log(x)}
                 person={p} />
            </div>
        </div>
    )
}


interface PersonComponentProps {
    person: Person,
    onSubmit: (p: Person) => void,
}

const PersonComponent = ({ person, onSubmit }: PersonComponentProps) => {
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
        var object: any = {};
        formData.forEach((value, key) => object[key] = value);
        onSubmit(object as Person);
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
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="academicRecordNumber" name="academicRecordNumber" defaultValue={person.academicRecordNumber} />
                        {/* <p key={idx} className="text-red-500 text-xs italic">{x}</p> */}
                </div>

                <div className="mt-3">
                    <Toggle 
                        name="amipa"
                        id="amipa"
                        value={isStudent}
                        text="Amipa"
                        />
                </div>

                <div className="mt-3 mb-3">
                    <Toggle 
                        name="preEnrollment"
                        id="preEnrollment"
                        value={isStudent}
                        text="Prematrícula"
                        />
                </div>
            </>
        )
    }

    if (!groups || !groups) return null;

    return (
        <form action="#" method="post" onSubmit={onFormSubmit}>

            <div>
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="name">Nom</label>
                <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="name" name="name" defaultValue={person.name} />
            </div>

            <div>
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="surname1">Primer llinatge</label>
                <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="surname1" name="surname1" defaultValue={person.surname1} />
            </div>

            <div>
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="surname2">Segon llinatge</label>
                <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="surname2" name="surname2" defaultValue={person.surname1} />
            </div>

            <div>
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="documentId"
                >
                    Document d&apos;identitat</label>
                <input
                    id="documentId"
                    name="documentId"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    defaultValue={person.documentId} />
            </div>
            <div>
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="group"
                >
                    Grup al curs actual</label>
                <SelectorComponent
                    id="group"
                    name="group"
                    selector={groups}
                    onSelect={() => {}} />
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
                <input type="submit" />
            </div>

        </form>
    )
}

export default Create;