import { Container } from "@/components/layout/SideBar"
import { addPeopleToGroupsGoogleWorkspace, exportPeopleGoogleWorkspace, exportWifiUsers, movePeopleGoogleWorkspace, suspendPeopleGoogleWorkspace } from "@/lib/apis/payments"
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { plainErrors } from "@/lib/utils";



const SyncPeopleToWorkspace = () => {


    return (<>
        <div className="max-w-lg m-auto">
            <div className="m-5">
                <hr />
                <label
                    className="mt-5 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="name">Google
                </label>
                <MoveUsers />
                <ExportUsers />
                <AddUsersToGroups />
                <SuspendUsers />
                <hr />
                <label
                    className="mt-5 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="name">Wifi
                </label>
                <ExportUsersWifi />
            </div>
        </div>
    </>)
}
const ExportUsersWifi = () => {
    const { data, errors, isLoading, executeRequest } = useApiRequest(exportWifiUsers);

    const submit = () => {
        confirmAction("Confirma que vols exportar les dades Wifi dels usuaris?", executeRequest);
    }

    if (errors) return <div className=" mt-4 ml-4 text-red-500 italic">{plainErrors(errors)}</div>;
    if (data) return <div className=" mt-4 ml-4 text-green-700 italic">Executat Correctament</div>;   

    return (
        <div className="mb-6">
            <button
                disabled={isLoading}
                className='flex items-center justify-center w-full mt-6 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                onClick={submit}>Exportar Usuaris Wifi CSV</button>
        </div>
    )
}


const MoveUsers = () => {
    const { data, errors, isLoading, executeRequest } = useApiRequest(movePeopleGoogleWorkspace);

    const submit = () => {
        confirmAction("Confirma que vols moure els usuaris d'OU?", executeRequest);
    }

    if (errors) return <div className=" mt-4 ml-4 text-red-500 italic">{plainErrors(errors)}</div>;
    if (data) return <div className=" mt-4 ml-4 text-green-700 italic">Executat Correctament</div>;

    return (
        <div className="mb-6">
            <button
                disabled={isLoading}
                className='flex items-center justify-center w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                onClick={submit}>Moure Usuaris a old OU</button>
        </div>
    )
}


const SuspendUsers = () => {
    const { data, errors, isLoading, executeRequest } = useApiRequest(suspendPeopleGoogleWorkspace);

    const submit = () => {
        confirmAction("Confirma que vols suspendre els usuaris?", executeRequest);
    }

    if (errors) return <div className=" mt-4 ml-4 text-red-500 italic">{plainErrors(errors)}</div>;
    if (data) return <div className=" mt-4 ml-4 text-green-700 italic">Executat Correctament</div>;

    return (
        <div className="mb-6">
            <button
                disabled={isLoading}
                className='flex items-center justify-center w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                onClick={submit}>Suspendre Usuaris</button>
        </div>
    )
}

const ExportUsers = () => {
    const { data, errors, isLoading, executeRequest } = useApiRequest(exportPeopleGoogleWorkspace);

    const submit = () => {
        confirmAction("Confirma que vols exportar i actualitzar el correu dels usuaris?", executeRequest);
    }

    if (errors) return <div className=" mt-4 ml-4 text-red-500 italic">{plainErrors(errors)}</div>;
    if (data) return <div className=" mt-4 ml-4 text-green-700 italic">Executat Correctament</div>;

    return (
        <div className="mb-6">
            <button
                disabled={isLoading}
                className='flex items-center justify-center w-full mt-6 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                onClick={submit}>Exportar Usuaris CSV</button>
        </div>
    )
}

const AddUsersToGroups = () => {
    const { data, errors, isLoading, executeRequest } = useApiRequest(addPeopleToGroupsGoogleWorkspace);

    const submit = () => {
        confirmAction("Confirma que vols afegir els usuaris al grup?", executeRequest);

    }

    if (errors) return <div className=" mt-4 ml-4 text-red-500 italic">{plainErrors(errors)}</div>;
    if (data) return <div className=" mt-4 ml-4 text-green-700 italic">Executat Correctament</div>;

    return (
        <div className="mb-6">
            <button
                disabled={isLoading}
                className='flex items-center justify-center w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                onClick={submit}>Afegir usuaris a grups</button>
        </div>
    )
}

const confirmAction = (message: string, request: () => unknown) => {
    const result = confirm(message);
    if (result) {
        request();
    }
}


export default function SyncPeopleToWorkspacePage() {
    return (
        <Container>
            <SyncPeopleToWorkspace />
        </Container>
    )
};