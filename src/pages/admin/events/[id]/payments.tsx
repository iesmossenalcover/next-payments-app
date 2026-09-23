import { Container } from "@/components/layout/SideBar";
import { EventPayment, EventPaymentsEventDataVm, EventPaymentsVm, getEventPayments, setPayment } from "@/lib/apis/payments";
import Head from "next/head";
import Link from "next/link";
import { Table } from "@/components/table";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { displayDate, displayTime } from "@/lib/utils";
import { SelectorComponent, SelectorOption } from "@/components/Selector";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";


const tableHeaders = {
    id: "",
    personesTotal: "Recompte Total",
    personesActual: "Recompte Actual",
    dinersActual: "Diners Actuals"
};

interface TableRow {
    id: string,
    personesTotal: string,
    personesActual: string,
    dinersActual: string
};

const EventPaymentsComp = () => {
    const router = useRouter()
    const [data, setData] = useState<EventPaymentsVm | undefined>(undefined);

    const { id } = router.query

    const getItems = () => {
        if (!data) return [];
        return [
            {
                id: "No Amipa",
                personesTotal: data.summary.noAmipaCount,
                personesActual: data.summary.paidCount,
                dinersActual: data.summary.noAmipaPaid + " €"
            },
            {
                id: "Amipa",
                personesTotal: data.summary.amipaCount,
                personesActual: data.summary.amipaPaidCount,
                dinersActual: data.summary.amipaPaid + " €"
            },
            {
                id: "Total",
                personesTotal: data.summary.totalCount,
                personesActual: data.summary.totalPaidCount,
                dinersActual: data.summary.totalPaid + " €"
            }
        ];
    }


    const mapToRow = (): TableRow[] => {
        return getItems().map(x => ({
            id: x.id,
            personesTotal: x.personesTotal.toString() || '',
            personesActual: x.personesActual.toString() || '',
            dinersActual: x.dinersActual.toString() || '',
        }));
    };

    const loadEventsPayments = () => {
        if (data) {
            setData({ ...data, unPaidEvents: [], paidEvents: [] });
        }
        getEventPayments(id as string)
            .then(x => {
                if (!x.errors || x.errors.size === 0) {
                    setData(x.data);
                }
            })
    }

    useEffect(() => {
        loadEventsPayments();
    }, [id])

    if (!data) return null;

    const event = data.event;
    const options = Array.from(Array(event.maxQuantity ?? 0), (_, x) => ({ key: (x + 1).toString(), value: x + 1 }));

    const displayEvents = (events: EventPayment[]) => {
        return events.map(x => (
            <li key={x.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-slate-50">
                <div className="min-w-0">
                    <p className="font-medium text-slate-900">
                        {x.fullName}
                        {x.paid && event.quantitySelector ? <span className="badge badge-gray ml-2">x{x.quantity}</span> : null}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
                        <span>{x.group}</span>
                        <span className="text-slate-300">·</span>
                        <span className="tabular-nums">{x.documentId}</span>
                        {x.datePaid && <>
                            <span className="text-slate-300">·</span>
                            <span className="tabular-nums">{displayDate(x.datePaid)} {displayTime(x.datePaid)}</span>
                        </>}
                    </p>
                </div>
                <SetPaid event={event} payment={x} options={options} setPaidCallback={loadEventsPayments} />
            </li>
        ))
    }

    const paidEvents = displayEvents(data.paidEvents)
    const unPaidEvents = displayEvents(data.unPaidEvents)


    const summaryURL = () => `${window.location.protocol}//${window.location.host}/admin/events/${event.code}/summary`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(summaryURL());
        alert("Copiat al porta-retalls");
    }

    const copyDocumentsIds = () => {

        let info = "<h1>Pagats</h1>";
        info += data.paidEvents.map(x => `<div>${x.documentId}</div>`).join("");
        info += "<h1>No Pagats</h1>";
        info += data.unPaidEvents.map(x => `<div>${x.documentId}</div>`).join("");
        let tab = window.open('about:blank', '_blank');
        if (tab) {
            tab.document.write(info); // where 'html' is a variable containing your HTML
            tab.document.close(); // to finish loading the page
        }
    }

    const yesNo = (value: boolean) => (
        <span className={`badge ${value ? "badge-green" : "badge-gray"}`}>{value ? "Si" : "No"}</span>
    );

    const unpaidCount = data.summary.totalCount - data.summary.totalPaidCount;
    const paidPercent = data.summary.totalCount > 0 ? Math.round(data.summary.totalPaidCount * 100 / data.summary.totalCount) : 0;

    return (

        <>
            <Head>
                <title>Pagaments esdeveniment - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageMain>
                <PageHeader
                    title={event.name}
                    subtitle={<span className="inline-flex items-center gap-2"><span className="badge badge-gray font-mono">{event.code}</span>{displayDate(event.date)}</span>}
                    back={{ href: "/admin/events", text: "Esdeveniments" }}
                    actions={
                        <button className="btn btn-secondary" onClick={copyDocumentsIds}>Mostra documents d&apos;identitat</button>
                    } />

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="card p-5 lg:col-span-2">
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
                            <div>
                                <dt className="text-slate-500">Preu</dt>
                                <dd className="mt-1 font-semibold text-slate-900">{event.price} €</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Preu AMIPA</dt>
                                <dd className="mt-1 font-semibold text-slate-900">{event.amipaPrice} €</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Data publicació</dt>
                                <dd className="mt-1 font-semibold text-slate-900">{displayDate(event.publishDate)}</dd>
                            </div>
                            {
                                event.unpublishDate ?
                                    <div>
                                        <dt className="text-slate-500">Data expiració</dt>
                                        <dd className="mt-1 font-semibold text-slate-900">{displayDate(event.unpublishDate)}</dd>
                                    </div> : null
                            }
                            <div>
                                <dt className="text-slate-500">Actiu</dt>
                                <dd className="mt-1">{yesNo(event.isActive)}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">És AMIPA</dt>
                                <dd className="mt-1">{yesNo(event.isAmpia)}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">És matrícula</dt>
                                <dd className="mt-1">{yesNo(event.isEnrollment)}</dd>
                            </div>
                        </dl>

                        <div className="mt-5 border-t border-slate-100 pt-4">
                            <p className="mb-1.5 text-sm text-slate-500">Enllaç al resum públic</p>
                            <div className="flex items-center gap-2 rounded-lg bg-slate-50 py-1 pl-3 pr-1 ring-1 ring-inset ring-slate-200">
                                <Link className="link min-w-0 flex-1 truncate text-sm" href={summaryURL()} target="_blank">{summaryURL()}</Link>
                                <button
                                    title="Copiar"
                                    className="btn-icon"
                                    onClick={copyToClipboard}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card flex flex-col justify-between p-5">
                        <div>
                            <p className="text-sm text-slate-500">Recaptat</p>
                            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{data.summary.totalPaid} €</p>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">{data.summary.totalPaidCount} de {data.summary.totalCount} pagats</span>
                                <span className="font-semibold text-slate-900">{paidPercent}%</span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${paidPercent}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mt-4 overflow-x-auto">
                    <Table
                        headers={tableHeaders}
                        items={mapToRow()}
                        tableClass='data-table'
                        renderers={{ id: (x: TableRow) => <span className="font-medium text-slate-900">{x.id}</span> }}
                    />
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                    <section className="card overflow-hidden">
                        <h3 className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 font-semibold text-slate-900">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Pagats
                            <span className="badge badge-green">{data.summary.totalPaidCount}</span>
                        </h3>
                        <ul className="divide-y divide-slate-100">
                            {paidEvents}
                        </ul>
                    </section>
                    <section className="card overflow-hidden">
                        <h3 className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 font-semibold text-slate-900">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            No Pagats
                            <span className="badge badge-red">{unpaidCount}</span>
                        </h3>
                        <ul className="divide-y divide-slate-100">
                            {unPaidEvents}
                        </ul>
                    </section>
                </div>
            </PageMain>
        </>
    );
}

interface SetPaidProps {
    event: EventPaymentsEventDataVm,
    payment: EventPayment,
    options: SelectorOption[],
    setPaidCallback: () => void,
}

const SetPaid = ({ event, payment, options, setPaidCallback }: SetPaidProps) => {
    const { isLoading, executeRequest } = useApiRequest(setPayment);
    const [quantity, setQuantity] = useState(Math.max(1, payment.quantity));

    const setPaid = async (id: number, v: boolean, di: string, n: string) => {
        let del = null;
        if (v) {
            del = confirm(`Marcar com a pagat l'alumne ${n} amb DNI: ${di} ?`);

        } else {
            del = confirm(`Desmarcar de pagats l'alumne ${n} amb DNI: ${di} ?`);
        }
        if (del) {
            const ok = await executeRequest(id, v, quantity);
            if (ok) {
                setPaidCallback();
            } else {
                alert("No s'ha pogut actualitzar")
            }
        }
    }

    if (payment.paid) {
        return (
            <button
                disabled={isLoading}
                onClick={() => setPaid(payment.id, false, payment.documentId, payment.fullName)}
                className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50 hover:text-red-700">
                Desmarcar pagat
            </button>
        )

    }
    else {

        return (
            <div className="flex items-center gap-2">
                {event.quantitySelector ?
                    <SelectorComponent
                        id={`set_${payment.id}`}
                        name={`set_${payment.id}`}
                        className="form-input w-auto py-1 pl-2.5 pr-8 text-xs"
                        onSelect={(x) => setQuantity(parseInt(x))}
                        selector={{ selected: `${quantity}`, options }}
                    />
                    : null}
                <button
                    disabled={isLoading}
                    onClick={() => setPaid(payment.id, true, payment.documentId, payment.fullName)}
                    className="btn btn-success btn-sm">
                    Marcar pagat
                </button>
            </div>
        )
    }
}

export default function EventPaymentsPage() {



    return (
        <Container>
            <EventPaymentsComp />
        </Container>
    )
};
