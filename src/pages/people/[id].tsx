import { SuccessAlert } from "@/components/Alerts";
import { createPerson, getPeopleView, getPersonById } from "@/lib/apis/payments/client";
import { Person } from "@/lib/apis/payments/models";
import { useEffect, useState } from "react";
import PersonFields from "@/components/people/PersonFields";
import { useRouter } from "next/router";

const Update = () => {
    const router = useRouter()
    const { id } = router.query
    const [loading, setLoading] = useState(false)
    const [created, setCreated] = useState(false)
    const [errors, setErrors] = useState<Map<string, string[]>>()
    const [person, setPerson] = useState<Person | undefined>(undefined)

    useEffect(() => {
        if (!id) return;
        
        getPersonById(parseInt(id as string))
            .then(x => setPerson(x.data));
    }, [id])

    const onSubmit = async (p: Person) => {
        setLoading(true);
        const data = await createPerson(p);
        if (data.errors) {
            setErrors(data.errors);
            setLoading(false);
        }
        else {
            const id = data.data as number;
            setCreated(true);
        }
    }

    const onFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const isStudent = formData.get("isStudent");
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

    const formDisabled = () => loading;

    if (!person) return null;

    return (
        <div className="max-w-lg m-auto">
            <div className="m-5">
                {created ?
                    <SuccessAlert text="Persona afegida correctament" /> :
                    <form action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">
                        <PersonFields
                            allowSetStudent={false}
                            errors={errors}
                            person={person} />
                        <div>
                            <input
                                disabled={formDisabled()}
                                className="w-full mt-6 bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                                value="Guardar canvis"
                                type="submit" />
                        </div>
                    </form>
                }
            </div>
        </div>
    )
}

export default Update;