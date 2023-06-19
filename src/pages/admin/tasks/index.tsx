import { Container } from "@/components/layout/SideBar"
import { syncPeopleGoogleWorkspace } from "@/lib/apis/payments"
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { plainErrors } from "@/lib/utils";

const SyncPeopleToWorkspace = () => {

    const { data, errors, isLoading, executeRequest } = useApiRequest(syncPeopleGoogleWorkspace);

    if (errors) return <div className="text-red-500 italic">{plainErrors(errors)}</div>;

    if (isLoading) return <>Carregant</>;

    return <>
        <button onClick={executeRequest}>Sync</button>
        {data ? <p>{data.email}</p> : null}
    </>
}

export default function SyncPeopleToWorkspacePage() {
    return (
        <Container>
            <SyncPeopleToWorkspace />
        </Container>
    )
};