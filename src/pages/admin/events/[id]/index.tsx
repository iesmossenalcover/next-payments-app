import { SuccessAlert } from "@/components/Alerts";
import { getEventById, updateEvent } from "@/lib/apis/payments/client";
import { Event } from "@/lib/apis/payments/models";
import { useEffect, useState } from "react";
import EventFields from "@/components/events/EventFields";
import { Container } from "@/components/layout/SideBar";
import Head from "next/head";
import { useRouter } from "next/router";

const Update = () => {
    const router = useRouter()
    const { id } = router.query
    const [loading, setLoading] = useState(false)
    const [updated, setUpdated] = useState(false)
    const [errors, setErrors] = useState<Map<string, string[]>>()
    const [event, setEvent] = useState<Event | undefined>(undefined)

    useEffect(() => {

        if (!id) return;
        getEventById(parseInt(id as string))
            .then(x => {
                if (!x.data) {
                    return;
                }
                setEvent(x.data)
            });
    }, [id])


    const onSubmit = async (e: Event) => {
        setLoading(true);
        setUpdated(false);

        const data = await updateEvent(e);
        if (data.errors) {
            setErrors(data.errors);
        }
        else {
            setUpdated(true);
            setTimeout(() => setUpdated(false), 1500);
        }
        setLoading(false);
    }

    const onFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors(undefined);
        if (!event) return;

        await onSubmit(event);
    }

    const formDisabled = () => loading;
    if (!event) return null;

    return (
        <>
            <Head>
                <title>Editar esdeveniment - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className="max-w-lg m-auto">
                    <div className="mt-5 mx-1 md:mx-4 lg:mx-6">
                        {updated ? <SuccessAlert text="Event editat correctament." /> : null}

                        <form className="mt-5" action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">
                            <EventFields
                                errors={errors}
                                event={event}
                                setEvent={setEvent} />
                            <div>
                                <input
                                    disabled={formDisabled()}
                                    className="w-full mt-6 bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                                    value="Guardar Canvis"
                                    type="submit" />
                            </div>
                        </form>

                    </div>
                </div>
            </main>
        </>

    )
}

export default function UpdateEventPage() {
    return (
        <Container>
            <Update />
        </Container>
    )
};

