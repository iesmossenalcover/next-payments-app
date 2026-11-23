import { SuccessAlert } from "@/components/Alerts";
import EventRequestFields from "@/components/eventrequests/EventRequestFields";
import { emptyRequestData } from "@/components/eventrequests/EventRequestDetails";
import { Container } from "@/components/layout/SideBar";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
import { submitEventRequest } from "@/lib/apis/payments/client";
import { EventRequestData } from "@/lib/apis/payments/models";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { displayErrors } from "@/lib/utils";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const missingStartDate = new Map([["startDate", ["S'ha de seleccionar una data d'inici."]]]);

const CreateEventRequest = () => {
    const [data, setData] = useState<EventRequestData>(emptyRequestData());
    const [localErrors, setLocalErrors] = useState<Map<string, string[]>>();
    const { data: id, errors, isLoading, executeRequest } = useApiRequest(submitEventRequest);

    const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.startDate) {
            setLocalErrors(missingStartDate);
            return;
        }
        setLocalErrors(undefined);
        await executeRequest(data);
    }

    const allErrors = localErrors ?? errors;

    return (
        <>
            <Head>
                <title>Nova sol·licitud - {process.env.SCHOOL_NAME}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageMain narrow>
                <PageHeader title="Nova sol·licitud d'esdeveniment" back={{ href: "/admin/event-requests", text: "Les meves sol·licituds" }} />
                <div className="card p-6 sm:p-8">
                    {id ?
                        <SuccessAlert text="Sol·licitud enviada. L'administració la revisarà i t'avisarà per correu.">
                            <div className="mt-3 flex flex-wrap gap-2">
                                <Link className="btn btn-success btn-sm" href={`/admin/event-requests/${id}`}>Veure la sol·licitud</Link>
                                <Link className="btn btn-secondary btn-sm" href="/admin/event-requests">Tornar a les sol·licituds</Link>
                            </div>
                        </SuccessAlert> :
                        <form action="#" method="post" onSubmit={onSubmit} autoComplete="off">
                            <EventRequestFields data={data} setData={setData} errors={allErrors} />
                            {allErrors?.has("") && <div className="mt-6">{displayErrors(new Map([["", allErrors.get("") as string[]]]))}</div>}
                            <input
                                disabled={isLoading}
                                className="btn btn-primary mt-8 w-full"
                                value="Enviar sol·licitud"
                                type="submit" />
                        </form>
                    }
                </div>
            </PageMain>
        </>
    )
}

export default function CreateEventRequestPage() {
    return (
        <Container>
            <CreateEventRequest />
        </Container>
    )
}
