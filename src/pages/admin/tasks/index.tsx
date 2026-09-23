import { Container } from "@/components/layout/SideBar"
import { JobType, exportPeopleGoogleWorkspace, exportWifiUsers, getJobs, startJob } from "@/lib/apis/payments"
import { Job, JobStatus } from "@/lib/apis/payments/models";
import { useApiRequest, useStartApiRequest } from "@/lib/hooks/useApiRequest";
import { displayDateTime, plainErrors } from "@/lib/utils";
import Link from "next/link";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";



const SyncPeopleToWorkspace = () => {

    const { data, executeRequest } = useStartApiRequest(getJobs);

    if (!data) return null;

    const { jobs } = data;

    const callback = () => {
        executeRequest();
    }

    return (
        <PageMain narrow>
            <PageHeader title="Sincronització" subtitle="Processos amb Google Workspace i la wifi del centre" />

            <section className="card p-6">
                <h2 className="section-title">Google Workspace</h2>
                <p className="mb-5 mt-1 text-sm text-slate-500">Executa els passos en ordre. Cada pas mostra l&apos;estat de l&apos;última execució.</p>
                <JobComponent
                    callback={callback}
                    buttonClasses="btn btn-secondary w-full justify-start"
                    buttonText="1. Moure Usuaris a old OU"
                    confirmMessage="Confirma que vols moure els usuaris d'OU?"
                    jobType={JobType.MOVE_PEOPLE_GOOGLE_WORKSPACE}
                    lastJob={jobs.find(x => x.type === JobType.MOVE_PEOPLE_GOOGLE_WORKSPACE)}
                />
                <ExportUsers />
                <JobComponent
                    callback={callback}
                    buttonClasses="btn btn-secondary w-full justify-start"
                    buttonText="3. Afegir usuaris a grups"
                    confirmMessage="Confirma que vols afegir els usuaris al grup?"
                    jobType={JobType.UPDATE_GROUP_MEMBERS_WORKSPACE}
                    lastJob={jobs.find(x => x.type === JobType.UPDATE_GROUP_MEMBERS_WORKSPACE)}
                />
                <JobComponent
                    callback={callback}
                    buttonClasses="btn btn-secondary w-full justify-start"
                    buttonText="4. Suspendre usuaris"
                    confirmMessage="Confirma que vols suspendre els usuaris?"
                    jobType={JobType.SUSPEND_GOOGLE_WORKSPACE}
                    lastJob={jobs.find(x => x.type === JobType.SUSPEND_GOOGLE_WORKSPACE)}
                />
            </section>

            <section className="card mt-6 p-6">
                <h2 className="section-title">Wifi pròpia del centre</h2>
                <p className="mb-5 mt-1 text-sm text-slate-500">Exporta els usuaris per donar-los d&apos;alta a la wifi.</p>
                <ExportUsersWifi />
            </section>
        </PageMain>
    )
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
    buttonClasses = 'btn btn-secondary w-full justify-start'
}: JobComponentProps) => {
    const { errors, isLoading, executeRequest } = useApiRequest(startJob);

    const submit = () => {
        confirmAction(confirmMessage, async () => {
            await executeRequest(jobType);
            callback();
        });
    }

    if (errors) return <p className="form-error mb-3">{plainErrors(errors)}</p>;

    const renderLastJob = () => {

        if (!lastJob) return null;

        const { status: jobaStatus, start, end, logId } = lastJob;

        return (
            <div className="flex shrink-0 items-center gap-1">
                {
                    jobaStatus == JobStatus.RUNNING &&
                    <div title="En procés" className="badge badge-amber">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                        </svg>
                    </div>
                }
                {
                    logId &&
                    <Link href={`/admin/tasks/logs/${logId}`} target="_blank" title="Veure el registre" className="btn-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </Link>
                }
                {
                    jobaStatus === JobStatus.FINISHED && end &&
                    <button
                        title={`Fes clic per veure més informació`}
                        className="btn-icon"
                        onClick={() => alert(`${displayDateTime(start, true)}\n${displayDateTime(end, true)}`)}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                        </svg>
                    </button>
                }
            </div>
        );
    }

    return (
        <div className="mb-3 flex items-center gap-2">
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

    if (errors) return <p className="form-error mb-3">{plainErrors(errors)}</p>;
    if (data) return <div className="mb-3"><span className="badge badge-green py-1.5 text-sm">Executat correctament</span></div>;

    return (
        <div>
            <button
                disabled={isLoading}
                className='btn btn-secondary w-full justify-start'
                onClick={submit}>Exportar Usuaris Wifi CSV</button>
        </div>
    )
}

const ExportUsers = () => {
    const { data, errors, isLoading, executeRequest } = useApiRequest(exportPeopleGoogleWorkspace);

    const submit = () => {
        confirmAction("Confirma que vols exportar i actualitzar el correu dels usuaris?", executeRequest);
    }

    if (errors) return <p className="form-error mb-3">{plainErrors(errors)}</p>;
    if (data) return <div className="mb-3"><span className="badge badge-green py-1.5 text-sm">Executat correctament</span></div>;

    return (
        <div className="mb-3">
            <button
                disabled={isLoading}
                className='btn btn-secondary w-full justify-start'
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