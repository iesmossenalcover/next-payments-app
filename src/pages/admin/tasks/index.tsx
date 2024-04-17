import { Container } from "@/components/layout/SideBar"
import { JobType, exportPeopleGoogleWorkspace, exportWifiUsers, getJobs, startJob } from "@/lib/apis/payments"
import { Job, JobStatus } from "@/lib/apis/payments/models";
import { useApiRequest, useStartApiRequest } from "@/lib/hooks/useApiRequest";
import { displayDateTime, plainErrors } from "@/lib/utils";
import Link from "next/link";



const SyncPeopleToWorkspace = () => {

    const { data, executeRequest } = useStartApiRequest(getJobs);

    if (!data) return null;

    const { jobs } = data;

    const callback = () => {
        executeRequest();
    }

    return (<>
        <div className="max-w-lg m-auto">
            <div className="m-5">
                <hr />
                <label
                    className="mt-5 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="name">Google
                </label>
                <JobComponent
                    callback={callback}
                    buttonClasses="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                    buttonText="1. Moure Usuaris a old OU"
                    confirmMessage="Confirma que vols moure els usuaris d'OU?"
                    jobType={JobType.MOVE_PEOPLE_GOOGLE_WORKSPACE}
                    lastJob={jobs.find(x => x.type === JobType.MOVE_PEOPLE_GOOGLE_WORKSPACE)}
                />
                <ExportUsers />
                <JobComponent
                    callback={callback}
                    buttonClasses="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                    buttonText="3. Afegir usuaris a grups"
                    confirmMessage="Confirma que vols afegir els usuaris al grup?"
                    jobType={JobType.UPDATE_GROUP_MEMBERS_WORKSPACE}
                    lastJob={jobs.find(x => x.type === JobType.UPDATE_GROUP_MEMBERS_WORKSPACE)}
                />
                <JobComponent
                    callback={callback}
                    buttonClasses="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                    buttonText="4. Suspendre usuaris"
                    confirmMessage="Confirma que vols suspendre els usuaris?"
                    jobType={JobType.SUSPEND_GOOGLE_WORKSPACE}
                    lastJob={jobs.find(x => x.type === JobType.SUSPEND_GOOGLE_WORKSPACE)}
                />
                <hr />
                <label
                    className="mt-5 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="name">Wifi pròpia del centre
                </label>
                <ExportUsersWifi />
            </div>
        </div>
    </>)
}

interface JobComponentProps {
    confirmMessage: string,
    buttonText: string,
    buttonClasses: string,
    jobType: JobType,
    lastJob?: Job
    callback: () => void,
}

const JobComponent = ({
    buttonText,
    confirmMessage,
    jobType,
    lastJob,
    callback,
    buttonClasses = 'flex items-center justify-center w-full mt-6 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
}: JobComponentProps) => {
    const { errors, isLoading, executeRequest } = useApiRequest(startJob);

    const submit = () => {
        confirmAction(confirmMessage, async () => {
            await executeRequest(jobType);
            callback();
        });
    }

    if (errors) return <div className=" mt-4 ml-4 text-red-500 italic">{plainErrors(errors)}</div>;

    const renderLastJob = () => {

        if (!lastJob) return null;

        const { status: jobaStatus, start, end, logId } = lastJob;

        return (
            <div className="flex">
                {
                    jobaStatus == JobStatus.RUNNING &&
                    <div title="En procés">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                        </svg>
                    </div>
                }
                {
                    logId &&
                    <Link href={`/admin/tasks/logs/${logId}`} target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </Link>
                }
                {
                    jobaStatus === JobStatus.FINISHED && end &&
                    <button
                        title={`Fes clic per veure més informació`}
                        onClick={() => alert(`${displayDateTime(start, true)}\n${displayDateTime(end, true)}`)}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                        </svg>
                    </button>
                }
            </div>
        );
    }

    return (
        <div className="flex items-center mb-6">
            <div className="w-full">
                <button
                    disabled={isLoading || (lastJob && lastJob.status !== JobStatus.FINISHED)}
                    className={buttonClasses}
                    onClick={submit}>{buttonText}</button>
            </div>
            {renderLastJob()}
        </div>
    )
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
                className='flex items-center justify-center w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed'
                onClick={submit}>Exportar Usuaris Wifi CSV</button>
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
                onClick={submit}>2. Exportar Usuaris CSV</button>
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