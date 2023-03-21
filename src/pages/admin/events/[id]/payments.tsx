import { Container } from "@/components/layout/SideBar";
import { EventPayments } from "@/lib/apis/payments";
import { getEventPayments } from "@/lib/apis/payments/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EventPayments = () => {
    const router = useRouter()
    const [data, setData] = useState<EventPayments | undefined>(undefined)

    const { id } = router.query

    useEffect(() => {
        getEventPayments(id as string)
            .then(x => {
                if (x.errors) {
                    console.log(x.errors);
                } else {
                    setData(x.data);
                    console.log(x.data);
                }
            })
            
        }, [id])

    if (!data) return null;

    const paidEvents = data.paidEvents.map(x => (
        <li key={x.id} className="mt-3">
            {x.documentId} - {x.fullName}
        </li>
    ))

    const unPaidEvents = data.unPaidEvents.map(x => (
        <li key={x.id} className="mt-3">
            {x.documentId} - {x.fullName}
        </li>
    ))

    return (

        <>
            <Head>
                <title>Pagaments esdeveniment</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="p-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-baseline">
                        <h4 className="font-bold text-3xl">{data.code}</h4>
                        <h4 className="font-bold text-3xl ml-3">-</h4>
                        <h4 className="font-bold text-3xl ml-3">{data.name}</h4>
                    </div>
                </div>
                <h4 className="mt-3 font-semibold">Total: {data.totalPrice} €</h4>
                <h4 className="mt-3 font-semibold">Amipa total: {data.amipaTotalPrice} €</h4>
                <h4 className="mt-3 font-semibold">No Amipa total: {data.noAmipaTotalPrice} €</h4>
                <hr className="h-px mt-3 mb-8 bg-gray-300 border-0" />
                <h4 className="mt-3 font-semibold">Alumnes total: {data.count}</h4>
                <h4 className="mt-3 font-semibold">Alumnes Amipa: {data.amipaStudents}</h4>
                <h4 className="mt-3 font-semibold">Alumnes No Amipa: {data.noAmipaStudents}</h4>
                <hr className="h-px mt-3 mb-8 bg-gray-300 border-0" />
                <h3 className="text-green-700 text-lg font-bold">Pagats: {data.paidCount}</h3>
                <ul>
                    {paidEvents}
                </ul>
                <hr className="h-px mt-3 mb-8 bg-gray-300 border-0" />
                <h3 className="text-red-500 text-lg font-bold">No Pagats: {data.count - data.paidCount}</h3>
                <ul>
                    {unPaidEvents}
                </ul>
            </main>
        </>
    );
}

export default function EventPaymentsPage() {



    return (
        <Container>
            <EventPayments />
        </Container>
    )
};