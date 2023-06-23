import { SelectorComponent } from "@/components/Selector";
import { EventSummary, EventSummaryVm, getEventSummary } from "@/lib/apis/payments";
import { displayDate } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EventSummaries = () => {
    const router = useRouter()
    const [data, setData] = useState<EventSummaryVm | undefined>(undefined)
    const [selectedGroup, setSelectedGroup] = useState<number | undefined>(undefined)

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

    const events = () => {
        let events = data.events;

        if (selectedGroup) {
            events = events.filter(x => x.groupId === selectedGroup);
        }

        return events;
    }

    const displayEvents = events();
    const displayPaidEvents = displayEvents.filter(x => x.paid);
    const displayUnpaidEvents = displayEvents.filter(x => !x.paid);

    return (

        <>
            <Head>
                <title>Pagaments esdeveniment - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container mx-auto p-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-baseline">
                        <h4 className="font-bold text-3xl">{data.code}</h4>
                        <h4 className="font-bold text-3xl ml-3">-</h4>
                        <h4 className="font-bold text-3xl ml-3">{`${data.name} - ${displayDate(data.date)}`}</h4>
                    </div>
                </div>
                {/* <button onClick={print}>Imprimir</button> */}
                <hr className="h-px mt-3 mb-8 bg-gray-300 border-0" />
                <div className="flex print:hidden">
                    <SelectorComponent
                        id='course'
                        name='course'
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        onSelect={val => setSelectedGroup(parseInt(val))}
                        selector={{ selected: `${selectedGroup}`, options: [ { key: "0", value: "Tots" }, ...data.groups ] }} />

                    <button
                        onClick={() => window.print()}
                        className='
                            text-blue-700
                            hover:text-white
                            border
                            border-blue-700
                            hover:bg-blue-800
                            focus:outline-none
                            font-medium
                            rounded-lg
                            ml-5
                            text-sm px-2 py-1 text-center'>
                            Imprimir
                        </button>
                </div>

                <h3 className="mt-4 text-lg font-bold text-green-700">Pagat: {displayPaidEvents.length}</h3>
                <ul>
                    {
                        displayPaidEvents.map(x => 
                            <li key={x.id} className="mt-3 font-semibold">
                                {x.groupName} - {x.fullName}
                            </li>
                        )
                    }
                </ul>

                <h3 className="mt-4 text-lg font-bold text-red-700">No Pagat: {displayUnpaidEvents.length}</h3>
                <ul>
                    {
                        displayUnpaidEvents.map(x => 
                            <li key={x.id} className="mt-3 font-semibol">
                                {x.groupName} - {x.fullName}
                            </li>
                        )
                    }
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