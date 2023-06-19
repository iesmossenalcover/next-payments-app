import { Container } from "@/components/layout/SideBar"
import { useSyncPeopleToGoogleWorkspace } from "@/lib/apis/payments"

const SyncPeopleToWorkspace = () => {

    const { data, error, isLoading, syncData } = useSyncPeopleToGoogleWorkspace();

    if (error) return <>{error}</>;

    if (isLoading) return <>Carregant</>;

    return <>
        <button onClick={syncData}>Sync</button>
        {data ? <p>{data.data?.email}</p> : null}
    </>
}

export default function SyncPeopleToWorkspacePage() {
    return (
        <Container>
            <SyncPeopleToWorkspace />
        </Container>
    )
};