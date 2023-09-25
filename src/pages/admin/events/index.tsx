import { Container } from "@/components/layout/SideBar";
import { Table } from "@/components/table";
import { getEventsView } from "@/lib/apis/payments";
import Head from "next/head";
import Link from "next/link";
import { deleteOuGroupRelation, exportSummaryRequest } from '@/lib/apis/payments/client'
import { displayDate, displayDateTime, plainErrors } from "@/lib/utils";
import { useApiRequest, useStartApiRequest } from "@/lib/hooks/useApiRequest";

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

    const { data: events, executeRequest } = useStartApiRequest(getEventsView);

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
        actions: (item: TableRow) => {
            return (
                <div className="flex">
                    <Link title="Editar" className='font-medium text-blue-600 hover:underline ml-5' href={`/admin/events/${item.id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </Link>
                    <Link title="Persones" className='font-medium text-blue-600 hover:underline ml-5' href={`/admin/events/${item.code}/people`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>

                    </Link>
                    <Link title="Pagaments" className='font-medium text-blue-600 hover:underline ml-5' href={`/admin/events/${item.code}/payments`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                    </Link>
                    <button
                        title="Eliminar"
                        className='font-medium text-red-600 hover:underline ml-5'
                        onClick={() => onDeleteEvent(item)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
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
            const response = await deleteOuGroupRelation(item.id);
            if (response.errors) {
                alert("No s'ha pogut eliminar.")
            }
            else {
                executeRequest();
            }
        }
    }

    const listEvents = () => {
        return (
            <div className='overflow-x-auto'>
                <Table
                    headers={tableHeaders}
                    items={mapToRow()}
                    renderers={customRenderer}
                    tableClass='w-full table-auto overflow-scroll w-full'
                    headerClass='border-b'
                    headerCellClass='text-sm font-medium text-gray-900 px-6 py-4 text-left text-center'
                    cellClass='px-6 py-4 whitespace-nowrap text-center'
                    rowClass='border-b hover:bg-blue-100'
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
            <main className="mt-5 mx-1 md:mx-4 lg:mx-6">


                <div className='flex justify-start mb-4'>
                    <div>
                        <Link className=' inline-block text-white  bg-green-700  hover:bg-green-800 focus:ring-4  focus:ring-blue-300 font-medium py-3 px-3 rounded-lg text-sm mr-5' href="/admin/events/create">Nou esdeveniment</Link>
                    </div>
                    <ExportSummary />

                </div>

                {listEvents()}
            </main>
        </>
    );
}

const ExportSummary = () => {
    const { data, errors, isLoading, executeRequest } = useApiRequest(exportSummaryRequest);

    const submit = async () => {
        const ok = await executeRequest();

    }

    if (errors) return <div className=" mt-4 ml-4 text-red-500 italic">{plainErrors(errors)}</div>;
    if (data) return <div className=" mt-4 ml-4 text-green-700 italic">Executat Correctament</div>;

    return (
        <div>

            <button
                disabled={isLoading}
                className=' inline-block text-white  bg-yellow-600  hover:bg-yellow-700 focus:ring-4  focus:ring-yellow-300 font-medium py-3 px-3 rounded-lg text-sm mr-5'
                onClick={submit}>Exportar Estadistiques
            </button>
        </div>
    )
}

export default function EventsPage() {
    return (
        <Container>
            <Events />
        </Container>
    )
};