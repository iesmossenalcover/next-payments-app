import { Container } from "@/components/layout/SideBar";
import { Spinner } from "@/components/Loading";
import { Table } from "@/components/table";
import { EventsRow, getEventsView } from "@/lib/apis/payments";
import Head from "next/head";
import { useEffect, useState } from "react";

const tableHeaders = {
    id: "Codi",
    name: "Nom",
    price: "Preu",
    amipaPrice: "Preu AMIPA",
    from: "Publicació",
    to: "Expiració",
    active: "Actiu",
    amipa: "Event Amipa",
    enrollment: "Event Matricula",
};

interface TableRow {
    id: string,
    name: string,
    price: string,
    amipaPrice: string,
    from: string,
    to: string,
    active: string,
    amipa: string,
    enrollment: string
};

const Events = () => {

    const [events, setEvents] = useState<EventsRow[]>([])
    const [loadingEvents, setLoadingEvents] = useState(false)

    useEffect(() => {
        setLoadingEvents(true);
        getEventsView()
            .then(x => setEvents(x))
            .finally(() => setLoadingEvents(false));
    }, []);

    const mapToRow = (): TableRow[] => {
        return events.map(x => {
            const from = new Date(x.publishDate);
            const to = new Date(x.unpublishDate);
            const active = x.isActive ? "Si" : "No";
            const amipa = x.amipa ? "Si" : "No";
            const enrollment = x.enrollment ? "Si" : "No";
            return {
                id: x.code,
                name: x.name,
                price: `${x.price}`,
                amipaPrice: `${x.amipaPrice}`,
                from: from.toLocaleDateString(),
                to: to.toLocaleDateString(),
                active: active,
                amipa: amipa,
                enrollment: enrollment
            };
        });
    }

    const listEvents = () => {
        if (loadingEvents) return null;
        return (
            <Table
                headers={tableHeaders}
                items={mapToRow()}
                tableClass='min-w-full'
                headerClass='border-b'
                headerCellClass='text-sm font-medium text-gray-900 px-6 py-4 text-left'
                cellClass='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'
                rowClass='border-b'
            />
        )
    }

    if (loadingEvents) {
        return null
    }

    return (

        <>
            <Head>
                <title>Events</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex-1 min-w-0 overflow-auto">
                <div className='flex justify-start items-center mb-4'>
                    {loadingEvents ? <Spinner /> : null}
                    {loadingEvents ? <p>Carregant Informació</p> : null}
                </div>
                {listEvents()}
            </main>
        </>
    );
}

export default function EventsPage() {
    return (
        <Container>
            <Events />
        </Container>
    )
};