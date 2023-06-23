import { SuccessAlert } from "@/components/Alerts";
import { Person } from "@/lib/apis/payments/models";
import { useEffect, useState } from "react";
import PersonFields from "@/components/people/PersonFields";
import { useRouter } from "next/router";
import { getPersonById, updatePerson } from "@/lib/apis/payments";
import { Container } from "@/components/layout/SideBar";
import Head from "next/head";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { displayErrors, plainErrors } from "@/lib/utils";
import { syncPersonGoogleWorkspace, updatePasswordGoogleWorkspace } from "@/lib/apis/payments/client";

const Update = () => {
    const router = useRouter()
    const { id } = router.query

    const [showUpdated, setShowUpdated] = useState(false);
    const { data: person, isLoading: isPersonLoading, executeRequest: getPersonRequest } = useApiRequest(getPersonById);
    const { data: syncPersonResponse, errors: syncErrors, isLoading: isSyncLoading, executeRequest: syncPersonRequest } = useApiRequest(syncPersonGoogleWorkspace);
    const { errors: updateErrors, isLoading: isUpdateLoading, executeRequest: updatePersonRequest } = useApiRequest(updatePerson);
    const { data: updatePasswordResponse, errors: updatePasswordErrors, isLoading: isUpdatingPasswordLoading, executeRequest: updatePassowrdRequest } = useApiRequest(updatePasswordGoogleWorkspace);

    useEffect(() => {
        if (!id) return;
        getPersonRequest(parseInt(id as string))
    }, [id]);

    const onFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const p: Person = {
            id: parseInt(id as string),
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

        const ok = await updatePersonRequest(p);
        if (ok) {
            setShowUpdated(true);
            setTimeout(() => setShowUpdated(false), 1500);
        }
    }

    const generateEmail = async () => {
        if (!person) return;
        const ok = await syncPersonRequest(person.id);
        if (ok) getPersonRequest(person.id);
    }

    const updatePassowrd = () => {
        const ok = confirm("Vols actualitzar la contrasenya?");
        if (!ok || !person) return;

        updatePassowrdRequest(person.id);
    }

    const formDisabled = () => isPersonLoading || isSyncLoading || isUpdateLoading || isUpdatingPasswordLoading;

    if (!person) return null;

    return (
        <>
            <Head>
                <title>Editar persona - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className="max-w-lg m-auto">
                    <div className="m-5">
                        {syncErrors ? <div className=" text-red-500 italic">No s&apos;ha pogut sincronitzar: {plainErrors(syncErrors)}</div> : null}
                        {updatePasswordErrors ? <div className=" text-red-500 italic">No s&apos;ha pogut canviar la contrassenya: {plainErrors(updatePasswordErrors)}</div> : null}
                        {showUpdated ? <SuccessAlert text="Persona actualitzada correctament" /> : null}
                        <form className="mt-5" action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">
                            <PersonFields
                                errors={updateErrors}
                                person={person} />

                            <div className="mb-6">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="mail">Correu
                                </label>
                                <div className="flex justify-between items-center">
                                    <input disabled
                                        className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                                        id="mail" name="mail" defaultValue={person.email} />
                                    <button
                                        disabled={formDisabled()}
                                        title="Generar Email"
                                        type="button"
                                        className='font-medium text-black-700 hover:underline ml-5 pr-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                                        onClick={generateEmail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                                        </svg>
                                    </button>


                                    <button
                                        disabled={formDisabled()}
                                        title="Actualitzar contrassenya"
                                        type="button"
                                        className='font-medium text-black-700 hover:underline ml-5 pr-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                                        onClick={updatePassowrd}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>

                                    </button>
                                </div>

                                {syncPersonResponse && syncPersonResponse.password ? <div>
                                    <p>La contrasenya temporal és: {syncPersonResponse.password}</p>
                                </div> : null
                                }

                                {updatePasswordResponse ? <div>
                                    <p>La contrasenya temporal és: {updatePasswordResponse.password}</p>
                                </div> : null
                                }
                            </div>

                            <div>
                                <input
                                    disabled={formDisabled()}
                                    className="w-full mt-6 bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                                    value="Guardar canvis"
                                    type="submit" />
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default function UpdatePersonPage() {
    return (
        <Container>
            <Update />
        </Container>
    )
};