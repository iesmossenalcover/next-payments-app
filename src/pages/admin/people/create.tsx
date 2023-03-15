import { SuccessAlert } from "@/components/Alerts";
import { createPerson } from "@/lib/apis/payments/client";
import { Person } from "@/lib/apis/payments/models";
import { useState } from "react";
import PersonFields from "@/components/people/PersonFields";
import Head from "next/head";
import { Container } from "@/components/layout/SideBar";

const defaultPerson: Person = {
    id: 0,
    name: "",
    surname1: "",
    documentId: "",
    groupId: 0,
    amipa: false,
    enrolled: false,
};

const Create = () => {
    const [loading, setLoading] = useState(false)
    const [created, setCreated] = useState(false)
    const [errors, setErrors] = useState<Map<string, string[]>>()

    const onSubmit = async (p: Person) => {
        setLoading(true);
        const data = await createPerson(p);
        if (data.errors) {
            setErrors(data.errors);
            setLoading(false);
        }
        else {
            setCreated(true);
        }
    }

    const onFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors(undefined);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const p: Person = {
            id: 0,
            name: formData.get("name") as string,
            surname1: formData.get("surname1") as string,
            surname2: formData.get("surname2") as string,
            documentId: formData.get("documentId") as string,
            groupId: parseInt(formData.get("groupId") as string),
            academicRecordNumber: parseInt(formData.get("academicRecordNumber") as string) ?? undefined,
            amipa: formData.get("amipa") === "on" ? true : false,
            enrolled: formData.get("enrolled") === "on" ? true : false,
            subjectsInfo: formData.get("subjectsInfo") as string ?? undefined,
        };
        await onSubmit(p);
    }

    const formDisabled = () => loading;

    return (
        <>
            <Head>
                <title>Afegir persona</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className="max-w-lg m-auto">
                    <div className="m-5">
                        {created ?
                            <SuccessAlert text="Persona afegida correctament" /> :
                            <form action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">
                                <PersonFields
                                    allowSetStudent={true}
                                    errors={errors}
                                    person={defaultPerson} />
                                <div>
                                    <input
                                        disabled={formDisabled()}
                                        className="w-full mt-6 bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                                        value="Afegir persona"
                                        type="submit" />
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </main>
        </>
    )
}

export default function CreatePersonPage() {
    return (
        <Container>
            <Create />
        </Container>
    )
};