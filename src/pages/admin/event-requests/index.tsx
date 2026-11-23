import { Container } from "@/components/layout/SideBar";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/Loading";
import { EventRequestStatusBadge } from "@/components/eventrequests/EventRequestStatus";
import { getMyEventRequests } from "@/lib/apis/payments/client";
import { EventRequestStatus } from "@/lib/apis/payments/models";
import { useStartApiRequest } from "@/lib/hooks/useApiRequest";
import { displayDate } from "@/lib/utils";
import Head from "next/head";
import Link from "next/link";

// Sol·licituds del professor connectat.
const MyEventRequests = () => {
    const { data: requests, isLoading } = useStartApiRequest(getMyEventRequests);

    return (
        <>
            <Head>
                <title>Les meves sol·licituds - {process.env.SCHOOL_NAME}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageMain>
                <PageHeader
                    title="Les meves sol·licituds"
                    subtitle="Sol·licituds d'esdeveniments que has enviat"
                    actions={
                        <Link className="btn btn-primary" href="/admin/event-requests/create">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Nova sol·licitud
                        </Link>
                    } />

                {!requests && isLoading ? <div className="flex justify-center py-16"><Spinner /></div> :
                    <div className="card overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Títol</th>
                                    <th>Data</th>
                                    <th>Estat</th>
                                    <th>Actualitzada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(requests ?? []).map(x => (
                                    <tr key={x.id}>
                                        <td className="w-full">
                                            <Link className="link font-medium" href={`/admin/event-requests/${x.id}`}>{x.title}</Link>
                                            {x.status === EventRequestStatus.PendingCorrection &&
                                                <span className="block text-xs text-orange-700">Has de corregir-la</span>}
                                        </td>
                                        <td>{displayDate(x.startDate)}</td>
                                        <td><EventRequestStatusBadge status={x.status} /></td>
                                        <td>{displayDate(x.updatedAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {requests && requests.length === 0 &&
                            <p className="py-12 text-center text-sm text-slate-500">Encara no has enviat cap sol·licitud.</p>}
                    </div>
                }
            </PageMain>
        </>
    )
}

export default function MyEventRequestsPage() {
    return (
        <Container>
            <MyEventRequests />
        </Container>
    )
}
