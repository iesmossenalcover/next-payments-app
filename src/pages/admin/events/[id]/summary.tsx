import { EventSummaries } from "@/lib/apis/payments";
import { getEventSummary } from "@/lib/apis/payments/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EventSummaries = () => {
    const router = useRouter()
    const [data, setData] = useState<EventSummaries | undefined>(undefined)

    const { id } = router.query

    useEffect(() => {
        getEventSummary(id as string)
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
            {x.group} - {x.fullName}
        </li>
    ))

    const unPaidEvents = data.unPaidEvents.map(x => (
        <li key={x.id} className="mt-3">
            {x.group} - {x.fullName}
        </li>
    ))

    return (

        <>
            <Head>
                <title>Pagaments esdeveniment - IES MOSSÈN ALCOVER</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container mx-auto p-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-baseline">
                        <h4 className="font-bold text-3xl">{data.code}</h4>
                        <h4 className="font-bold text-3xl ml-3">-</h4>
                        <h4 className="font-bold text-3xl ml-3">{data.name}</h4>
                    </div>
                </div>
                <hr className="h-px mt-3 mb-8 bg-gray-300 border-0" />

                <h3 className="text-green-500 mt-4 text-lg font-bold">Pagats: {data.paidEvents.length}</h3>
                <ul>
                    {paidEvents}
                </ul>
                <h3 className="text-red-500 mt-4 text-lg font-bold">No Pagats: {data.unPaidEvents.length}</h3>
                <ul>
                    {unPaidEvents}
                </ul>
            </main>
        </>
    );
}

export default function EventSummaryPage() {



    return (
            <EventSummaries />
    )
};