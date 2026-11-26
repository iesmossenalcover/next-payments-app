import { Container } from "@/components/layout/SideBar";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/Loading";
import { EventRequestStatusBadge, statusOptions } from "@/components/eventrequests/EventRequestStatus";
import { SelectorOption } from "@/components/Selector";
import { getCoursesSelector, getEventRequests } from "@/lib/apis/payments/client";
import { EventRequestStatus } from "@/lib/apis/payments/models";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { displayDate } from "@/lib/utils";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

// Safata de l'admin. Per defecte mostra el que li toca fer: revisió i creació.
const ADMIN_TURN = "admin";

const ReviewEventRequests = () => {
    const [statusFilter, setStatusFilter] = useState<string>(ADMIN_TURN);
    // "" = curs actual (el resol el servidor).
    const [courseFilter, setCourseFilter] = useState("");
    const [courses, setCourses] = useState<SelectorOption[]>([]);
    const { data: requests, isLoading, executeRequest } = useApiRequest(getEventRequests);

    useEffect(() => {
        getCoursesSelector().then(x => setCourses(x?.options ?? [])).catch(() => setCourses([]));
    }, []);

    useEffect(() => {
        executeRequest(
            statusFilter === "" || statusFilter === ADMIN_TURN ? undefined : Number(statusFilter) as EventRequestStatus,
            courseFilter === "" ? undefined : Number(courseFilter));
    }, [statusFilter, courseFilter, executeRequest]);

    const visible = (requests ?? []).filter(x => statusFilter !== ADMIN_TURN
        || x.status === EventRequestStatus.PendingReview
        || x.status === EventRequestStatus.PendingCreation);

    return (
        <>
            <Head>
                <title>Revisar sol·licituds - {process.env.SCHOOL_NAME}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageMain>
                <PageHeader title="Revisar sol·licituds" subtitle="Sol·licituds d'esdeveniments del professorat" />

                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <select
                        aria-label="Filtrar per curs"
                        className="form-input sm:max-w-56"
                        value={courseFilter}
                        onChange={e => setCourseFilter(e.currentTarget.value)}>
                        <option value="">Curs actual</option>
                        {courses.map(x => <option key={x.key} value={x.key}>{x.value}</option>)}
                    </select>
                    <select
                        aria-label="Filtrar per estat"
                        className="form-input sm:max-w-64"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.currentTarget.value)}>
                        <option value={ADMIN_TURN}>Pendents de l&apos;administració</option>
                        <option value="">Totes</option>
                        {statusOptions.map(x => <option key={x.value} value={x.value}>{x.label}</option>)}
                    </select>
                    <p className="text-sm text-slate-500 sm:ml-auto">{visible.length} {visible.length === 1 ? "sol·licitud" : "sol·licituds"}</p>
                </div>

                {!requests && isLoading ? <div className="flex justify-center py-16"><Spinner /></div> :
                    <div className="card overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Títol</th>
                                    <th>Professor</th>
                                    <th>Data</th>
                                    <th>Estat</th>
                                    <th>Actualitzada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map(x => (
                                    <tr key={x.id}>
                                        <td className="w-full">
                                            <Link className="link font-medium" href={`/admin/event-requests/review/${x.id}`}>{x.title}</Link>
                                        </td>
                                        <td>{x.requesterName}</td>
                                        <td>{displayDate(x.startDate)}</td>
                                        <td><EventRequestStatusBadge status={x.status} /></td>
                                        <td>{displayDate(x.updatedAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {visible.length === 0 && <p className="py-12 text-center text-sm text-slate-500">No hi ha sol·licituds.</p>}
                    </div>
                }
            </PageMain>
        </>
    )
}

export default function ReviewEventRequestsPage() {
    return (
        <Container>
            <ReviewEventRequests />
        </Container>
    )
}
