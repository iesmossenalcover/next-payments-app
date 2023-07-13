import { SuccessAlert } from "@/components/Alerts";
import { createEvent } from "@/lib/apis/payments/client";
import { Event } from "@/lib/apis/payments/models";
import { useState } from "react";
import EventFields from "@/components/events/EventFields";
import { Container } from "@/components/layout/SideBar";
import Head from "next/head";
import { toInputDateTime } from "@/lib/utils";
import { useApiRequest } from "@/lib/hooks/useApiRequest";

const defaultEvent: Event = {
    id: 0,
    code: "",
    name: "",
    description: "",
    date: toInputDateTime(new Date()),
    price: 0,
    amipaPrice: 0,
    publishDate: toInputDateTime(new Date()),
    unpublishDate: undefined,
    enrollment: false,
    amipa: false
};


const Create = () => {
    const [event, setEvent] = useState(defaultEvent);
    const [created, setCreated] = useState(false);
    const { data: code, errors, isLoading, executeRequest } = useApiRequest(createEvent);

    const onSubmit = async (e: Event) => {
        const ok = await executeRequest(e);
        if (ok) {
            setCreated(true);
        }
    }

    const onFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        // const form = e.currentTarget;
        // const formData = new FormData(form);
        // const date = formData.get("date") as string;
        // const start = formData.get("start") as string;
        // const end = formData.get("end") as string;
        onSubmit(event);
    }

    const formDisabled = () => isLoading;

    return (
        <>
            <Head>
                <title>Afegir esdeveniment - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className="max-w-lg m-auto">
                    <div className="mx-2 my-5">
                        {created ?
                            <SuccessAlert text={`Event afegit correctament el codi de l'event és: ${code}`} /> :
                            <form action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">
                                <EventFields
                                    errors={errors}
                                    event={event}
                                    setEvent={setEvent} />
                                <div>
                                    <input
                                        disabled={formDisabled()}
                                        className="w-full mt-6 bg-green-700 hover:cursor-pointer hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                                        value="Crear esdeveniment"
                                        type="submit" />
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </main>
        </>

    )
}

export default function CreateEventPage() {
    return (
        <Container>
            <Create />
        </Container>
    )
};