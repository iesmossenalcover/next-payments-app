import { Container } from "@/components/layout/SideBar"
import { exportPeopleGoogleWorkspace, SuspendPeopleGoogleWorkspace } from "@/lib/apis/payments"
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { displayErrors, plainErrors } from "@/lib/utils";
import React, { useState, useEffect } from 'react';



const SyncPeopleToWorkspace = () => {

    const finalTime = null;
    const [initialTime] = useState(new Date().toLocaleTimeString());
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    // const { data, errors, isLoading, executeRequest: syncUsersRequest } = useApiRequest(syncPeopleGoogleWorkspace);
    const { data, errors, isLoading, executeRequest: exportUsersRequest } = useApiRequest(exportPeopleGoogleWorkspace);


    // const updatePassword = () => {
    //     const ok = confirm("Executar aquesta acció tardarà temps?");
    //     if (!ok) return;

    //     syncUsersRequest();
    // }

    if (errors) return <div className=" mt-4 ml-4 text-red-500 italic">{plainErrors(errors)}</div>;

    return (<>
        <div className="max-w-lg m-auto">
            <div className="m-5">
                {/* <div className="mb-6">
                    <button className='"w-full mt-6 bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                        onClick={updatePassword}>Sync users with google</button>
                </div> */}

                <SuspendUsers />
                <div className="mb-6">
                    <button 
                    disabled={isLoading}
                    className='"w-full mt-6 bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                        onClick={exportUsersRequest}>Exportar CSV</button>
                </div>

            </div>
        </div>
    </>)
}

const SuspendUsers = () => {
    const { data, errors, isLoading, executeRequest: executeRequest } = useApiRequest(SuspendPeopleGoogleWorkspace);

    const submit = async (path: string) => {
        executeRequest(path);
    }

    const onFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const path = formData.get("path") as string;
        submit(path);
    }

    if (errors) {
        return displayErrors(errors);
    }

    return (
        <form action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">
            {data && data.ok ? <span className="text-green-700">Executat correctament</span> : null}
            <div className="mb-6">
                <label
                    className="mt-6 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="path">Path</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="path" name="path" />
                <input
                    disabled={isLoading}
                    className="w-full mt-6 bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                    value="Executar Suspensió OU"
                    type="submit" />
            </div>
        </form>
    )
}

export default function SyncPeopleToWorkspacePage() {
    return (
        <Container>
            <SyncPeopleToWorkspace />
        </Container>
    )
};