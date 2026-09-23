import { Container } from "@/components/layout/SideBar";
import { Table } from "@/components/table";
import { getEventsView } from "@/lib/apis/payments";
import Head from "next/head";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/Loading";
import Link from "next/link";
import { deleteEvent, exportSummaryRequest, sendDailyEventsEmail } from '@/lib/apis/payments/client'
import { hasRole, Roles } from "@/lib/apis/payments/models";
import useUser from "@/lib/hooks/useUser";
import { displayDate, displayDateTime, plainErrors } from "@/lib/utils";
import { useApiRequest, useStartApiRequest } from "@/lib/hooks/useApiRequest";
import Toggle from "@/components/Toggle";
import { useEffect, useState } from "react";

const tableHeaders = {
    id: "Id",
    code: "Codi",
    name: "Nom",
    date: "Data",
    price: "Preu",
    amipaPrice: "Preu AMIPA",
    from: "Publicació",
    to: "Expiració",
    active: "Actiu",
    actions: "Accions",
};

interface TableRow {
    id: number,
    code: string,
    name: string,
    date: string,
    price: string,
    amipaPrice: string,
    from: string,
    to: string,
    active: string,
    actions: "",
};

const Events = () => {
    const [showAll, setShowAll] = useState(false);
    const { data: events, isLoading, executeRequest } = useApiRequest(getEventsView);

    useEffect(() => {
        executeRequest(showAll);
    }, [showAll])

    const mapToRow = (): TableRow[] => {
        if (!events) return [];

        return events.map(x => {
            const date = new Date(x.date);
            const from = new Date(x.publishDate);
            const to = new Date(x.unpublishDate);
            const active = x.isActive ? "Si" : "No";
            return {
                id: x.id,
                code: x.code,
                name: x.name,
                date: displayDate(date),
                price: `${x.price} €`,
                amipaPrice: `${x.amipaPrice} €`,
                from: displayDateTime(from),
                to: x.unpublishDate ? displayDateTime(to) : '-',
                active: active,
                actions: ""
            };
        });
    }

    const customRenderer = {
        code: (item: TableRow) => <span className="badge badge-gray font-mono">{item.code}</span>,
        name: (item: TableRow) => <span className="font-medium text-slate-900">{item.name}</span>,
        active: (item: TableRow) => (
            <span className={`badge ${item.active === "Si" ? "badge-green" : "badge-gray"}`}>
                {item.active === "Si" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                {item.active}
            </span>
        ),
        actions: (item: TableRow) => {
            return (
                <div className="flex justify-end gap-1">
                    <Link title="Editar" className='btn-icon' href={`/admin/events/${item.id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </Link>
                    <Link title="Persones" className='btn-icon' href={`/admin/events/${item.code}/people`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>

                    </Link>
                    <Link title="Pagaments" className='btn-icon' href={`/admin/events/${item.code}/payments`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                    </Link>
                    <button
                        title="Eliminar"
                        className='btn-icon btn-icon-danger'
                        onClick={() => onDeleteEvent(item)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            );
        },
    }

    const onDeleteEvent = async (item: TableRow) => {
        const del = confirm(`Eliminar esdeveniment codi: ${item.code}, nom: ${item.name} ?`);
        if (del) {
            const response = await deleteEvent(item.id);
            if (response.errors) {
                alert("No s'ha pogut eliminar.")
            }
            else {
                executeRequest(showAll);
            }
        }
    }

    const listEvents = () => {
        return (
            <div className='card overflow-x-auto'>
                <Table
                    headers={tableHeaders}
                    items={mapToRow()}
                    renderers={customRenderer}
                    tableClass='data-table'
                    visibleFields={[
                        "code",
                        "name",
                        "date",
                        "price",
                        "amipaPrice",
                        "from",
                        "to",
                        "active",
                        "actions"
                    ]}
                />
            </div>
        )
    }

    return (

        <>
            <Head>
                <title>Esdeveniments - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageMain>
                <PageHeader
                    title="Esdeveniments"
                    subtitle="Activitats i cobraments del curs"
                    actions={<>
                        <ExportSummary />
                        <SendDailyEmail />
                        <Link className='btn btn-primary' href="/admin/events/create">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Nou esdeveniment
                        </Link>
                    </>} />

                <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        {events ? `${events.length} ${events.length === 1 ? "esdeveniment" : "esdeveniments"}` : ""}
                    </p>
                    <Toggle
                        id="showAll"
                        name="showAll"
                        text="Mostrar tots"
                        value={showAll}
                        onToggled={setShowAll}
                     />
                </div>

                {!events && isLoading ? <div className="flex justify-center py-16"><Spinner /></div> : listEvents()}
            </PageMain>
        </>
    );
}

const ExportSummary = () => {
    const { data, errors, isLoading, executeRequest } = useApiRequest(exportSummaryRequest);

    const submit = async () => {
        const ok = await executeRequest();

    }

    if (errors) return <div className="text-sm text-red-600">{plainErrors(errors)}</div>;
    if (data) return <div className="badge badge-green py-1.5 text-sm">Executat correctament</div>;

    return (
        <button
            disabled={isLoading}
            className='btn btn-secondary'
            onClick={submit}>
            {isLoading ? <Spinner className="h-4 w-4 text-slate-500" /> :
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>}
            Exportar estadístiques
        </button>
    )
}

const SendDailyEmail = () => {
    const { user, loading } = useUser();
    const { data, errors, isLoading, executeRequest } = useApiRequest(sendDailyEventsEmail);

    if (loading || !hasRole(user?.role, Roles.SuperUser)) return null;

    const submit = async () => {
        const send = confirm("Enviar el correu diari d'esdeveniments?");
        if (send) {
            await executeRequest();
        }
    }

    if (errors) return <div className="text-sm text-red-600">{plainErrors(errors)}</div>;
    if (data) return <div className="badge badge-green py-1.5 text-sm">Correu enviat correctament</div>;

    return (
        <button
            disabled={isLoading}
            className='btn btn-secondary'
            onClick={submit}>
            {isLoading ? <Spinner className="h-4 w-4 text-slate-500" /> :
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>}
            {isLoading ? "Enviant..." : "Enviar correu diari"}
        </button>
    )
}

export default function EventsPage() {
    return (
        <Container>
            <Events />
        </Container>
    )
};