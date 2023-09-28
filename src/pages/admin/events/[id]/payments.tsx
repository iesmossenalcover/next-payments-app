import { Container } from "@/components/layout/SideBar";
import { EventPayment, EventPayments, getEventPayments, setPayment } from "@/lib/apis/payments";
import Head from "next/head";
import Link from "next/link";
import { Table } from "@/components/table";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { displayDate, displayDateTime, displayTime } from "@/lib/utils";
import { SelectorComponent, SelectorOption } from "@/components/Selector";


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

const EventPayments = () => {
    const router = useRouter()
    const [data, setData] = useState<EventPayments | undefined>(undefined);

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

    const options = Array.from(Array(data.maxQuantity ?? 0), (_, x) => ({ key: (x + 1).toString(), value: x + 1 }));

    const displayEvents = (events: EventPayment[]) => {
        return events.map(x => (
            <li key={x.id} className="hover:text-blue-900 hover:font-bold">
                <div className="flex justify-between">
                    <div>{x.group} - {x.documentId} - {x.fullName} {x.paid && data.quantitySelector ? `- x${x.quantity}` : ''} <b>{x.datePaid && <>- {displayDate(x.datePaid)} {displayTime(x.datePaid)}</>}</b></div>
                    <SetPaid event={data} payment={x} options={options} setPaidCallback={loadEventsPayments} />
                </div>
                <hr className="h-px mt-1 mb-4 bg-gray-200 border-0"></hr>
            </li>
        ))
    }

    const paidEvents = displayEvents(data.paidEvents)
    const unPaidEvents = displayEvents(data.unPaidEvents)


    const summaryURL = () => `${window.location.protocol}//${window.location.host}/admin/events/${data.code}/summary`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(summaryURL());
        alert("Copiat al porta-retalls");
    }

    return (

        <>
            <Head>
                <title>Pagaments esdeveniment - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="p-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-baseline">
                        <h4 className="font-bold text-3xl">{data.code}</h4>
                        <h4 className="font-bold text-3xl ml-3">-</h4>
                        <h4 className="font-bold text-3xl ml-3">{`${data.name} - ${displayDate(data.date)}`}</h4>
                    </div>
                    <div className="flex">
                        <Link href={summaryURL()} target="_blank">{summaryURL()}</Link>
                        <button
                            className="text-blue-600 font-bold pl-3"
                            onClick={copyToClipboard}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                            </svg>
                        </button>
                    </div>
                </div>

                <hr className="h-px mt-3 mb-3 bg-gray-500 border-0" />
                <Table
                    headers={tableHeaders}
                    items={mapToRow()}
                    tableClass='min-w-full'
                    headerClass='border-b'
                    headerCellClass='text-sm font-medium text-gray-900 px-6 py-4 text-left'
                    cellClass='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'
                    rowClass='border-b'
                />

                <h3 className=" mt-8 mb-4 text-green-700 text-lg font-bold">Pagats: {data.summary.totalPaidCount}</h3>
                <ul>
                    {paidEvents}
                </ul>
                <hr className="h-px mt-3 mb-8 bg-white-300 border-0" />
                <h3 className="text-red-500 mb-4 text-lg font-bold">No Pagats: {data.summary.totalCount - data.summary.totalPaidCount}</h3>
                <ul>
                    {unPaidEvents}
                </ul>
            </main>
        </>
    );
}

interface SetPaidProps {
    event: EventPayments,
    payment: EventPayment,
    options: SelectorOption[],
    setPaidCallback: () => void,
}

const SetPaid = ({ event, payment, options, setPaidCallback }: SetPaidProps) => {

    const [quantity, setQuantity] = useState(Math.max(1, payment.quantity));

    const setPaid = async (id: number, v: boolean, di: string, n: string) => {
        let del = null;
        if (v) {
            del = confirm(`Marcar com a pagat l'alumne ${n} amb DNI: ${di} ?`);

        } else {
            del = confirm(`Desmarcar de pagats l'alumne ${n} amb DNI: ${di} ?`);
        }
        if (del) {
            const result = await setPayment(id, v, quantity);
            if (!result.errors) {
                setPaidCallback();
            } else {
                alert("No s'ha pogut actualitzar")
            }
        }
    }

    if (payment.paid) {
        return (
            <button
                onClick={() => setPaid(payment.id, false, payment.documentId, payment.fullName)}
                className="text-red-600 font-bold">
                Desmarcar Pagat
            </button>
        )

    }
    else {

        return (
            <div>
                {event.quantitySelector ?
                    <SelectorComponent
                        id={`set_${payment.id}`}
                        name={`set_${payment.id}`}
                        className="
                            bg-gray-50 border
                            border-gray-300
                            text-gray-900
                            text-sm
                            rounded-lg
                            focus:ring-blue-500
                            focus:border-blue-500
                            py-1
                            px-2.5
                            mr-4"
                        onSelect={(x) => setQuantity(parseInt(x))}
                        selector={{ selected: `${quantity}`, options }}
                    />
                    : null}
                <button
                    onClick={() => setPaid(payment.id, true, payment.documentId, payment.fullName)}
                    className="text-green-600 font-bold">
                    Marcar Pagat
                </button>
            </div>
        )
    }
}

export default function EventPaymentsPage() {



    return (
        <Container>
            <EventPayments />
        </Container>
    )
};