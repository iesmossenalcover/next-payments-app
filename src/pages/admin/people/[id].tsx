import { SuccessAlert } from "@/components/Alerts";
import { Person } from "@/lib/apis/payments/models";
import { useEffect, useState } from "react";
import PersonFields from "@/components/people/PersonFields";
import { useRouter } from "next/router";
import { getPersonById, updatePerson } from "@/lib/apis/payments";
import { Container } from "@/components/layout/SideBar";
import Head from "next/head";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { displayKeyErrors, plainErrors } from "@/lib/utils";
import { syncPersonGoogleWorkspace, updatePasswordGoogleWorkspace, updateUOGoogleWorkspace } from "@/lib/apis/payments/client";

const Update = () => {
    const router = useRouter()
    const { id } = router.query

    const [showUpdated, setShowUpdated] = useState(false);
    const { data: person, setData: setPerson, isLoading: isPersonLoading, executeRequest: getPersonRequest } = useApiRequest(getPersonById);
    const { data: syncPersonResponse, errors: syncErrors, isLoading: isSyncLoading, executeRequest: syncPersonRequest } = useApiRequest(syncPersonGoogleWorkspace);
    const { errors: updateErrors, isLoading: isUpdateLoading, executeRequest: updatePersonRequest } = useApiRequest(updatePerson);
    const { data: updatePasswordResponse, errors: updatePasswordErrors, isLoading: isUpdatingPasswordLoading, executeRequest: updatePassowrdRequest } = useApiRequest(updatePasswordGoogleWorkspace);
    const { errors: updateUOErrors, isLoading: isUpdatingUO, executeRequest: updateUORequest } = useApiRequest(updateUOGoogleWorkspace);

    useEffect(() => {
        if (!id) return;
        getPersonRequest(parseInt(id as string))
    }, [id]);

    const onFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!person) return;

        const ok = await updatePersonRequest(person);
        if (ok) {
            setShowUpdated(true);
            setTimeout(() => setShowUpdated(false), 1500);
            getPersonRequest(parseInt(id as string));
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

    const updateUOAndGroup = async () => {
        const ok = confirm("Vols actualitzar la UO i el grup?");
        if (!ok || !person) return;

        const res = await updateUORequest(person.id);
        
        if (res) {
            alert("Actualitzat correctament.");
        } else {
            alert("No s'ha pogut actualitzar.");
        }
    }

    const formDisabled = () => isPersonLoading || isSyncLoading || isUpdateLoading || isUpdatingPasswordLoading || isUpdatingUO;

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
                    <div className="my-5 mx-1 md:mx-4 lg:mx-6">
                        {syncErrors ? <div className=" text-red-500 italic">No s&apos;ha pogut sincronitzar: {plainErrors(syncErrors)}</div> : null}
                        {updatePasswordErrors ? <div className=" text-red-500 italic">No s&apos;ha pogut canviar la contrassenya: {plainErrors(updatePasswordErrors)}</div> : null}
                        {showUpdated ? <SuccessAlert text="Persona actualitzada correctament" /> : null}
                        <form className="mt-5" action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">
                            <PersonFields
                                errors={updateErrors}
                                person={person}
                                setPerson={setPerson} />

                            <div className="mb-6">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="mail">Correu
                                </label>
                                <div className="flex justify-between items-center">
                                    <input
                                        className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                                        id="mail" name="mail"
                                        type="email"
                                        value={person.email ?? ""}
                                        onChange={(e) => setPerson({ ...person, email: e.target.value ? e.target.value : undefined })} />

                                    <button
                                        disabled={formDisabled()}
                                        title="Generar Email"
                                        type="button"
                                        className='font-medium text-black-700 hover:underline ml-5 pr-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                                        onClick={generateEmail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                                        </svg>

                                    </button>


                                    <button
                                        disabled={formDisabled()}
                                        title="Actualitzar contrassenya"
                                        type="button"
                                        className='font-medium text-black-700 hover:underline ml-5 pr-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                                        onClick={updatePassowrd}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </button>

                                    <button
                                        disabled={formDisabled()}
                                        title="Actualitzar UO i grup"
                                        type="button"
                                        className='font-medium text-black-700 hover:underline ml-5 pr-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                                        onClick={updateUOAndGroup}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
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

                                {displayKeyErrors("email", updateErrors)}
                            </div>

                            <div>
                                <input
                                    disabled={formDisabled()}
                                    className="w-full mt-2 bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
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