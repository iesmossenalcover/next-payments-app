import { DangerAlert, SuccessAlert } from "@/components/Alerts";
import EventRequestFields from "@/components/eventrequests/EventRequestFields";
import { EventRequestDetails, EventRequestHistory, lastCorrectionReason, toRequestData } from "@/components/eventrequests/EventRequestDetails";
import { Container } from "@/components/layout/SideBar";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/Loading";
import { getMyEventRequest, resubmitEventRequest } from "@/lib/apis/payments/client";
import { EventRequest, EventRequestData, EventRequestStatus, Response } from "@/lib/apis/payments/models";
import { plainErrors } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

// Detall d'una sol·licitud del professor. Només la pot editar quan l'admin n'ha demanat la correcció.
const MyEventRequest = () => {
    const router = useRouter();
    const id = Number(router.query.id);
    const [request, setRequest] = useState<EventRequest>();
    const [notFound, setNotFound] = useState(false);
    const [data, setData] = useState<EventRequestData>();
    const [errors, setErrors] = useState<Map<string, string[]>>();
    const [saving, setSaving] = useState(false);
    const [resubmitted, setResubmitted] = useState(false);

    const apply = useCallback((response: Response<EventRequest>) => {
        if (!response.data) {
            setNotFound(true);
            return;
        }
        setRequest(response.data);
        setData(toRequestData(response.data));
    }, []);

    const load = async () => apply(await getMyEventRequest(id));

    useEffect(() => {
        if (!router.isReady) return;
        getMyEventRequest(id).then(apply);
    }, [router.isReady, id, apply]);

    const onResubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data) return;
        setSaving(true);
        const response = await resubmitEventRequest(id, data);
        setSaving(false);
        if (response.errors) {
            setErrors(response.errors);
            return;
        }
        setErrors(undefined);
        setResubmitted(true);
        await load();
    }

    if (notFound) return <PageMain narrow><DangerAlert title="No s'ha trobat la sol·licitud" text="No existeix o no és teva." /></PageMain>;
    if (!request || !data) return <div className="flex justify-center py-24"><Spinner /></div>;

    const canCorrect = request.status === EventRequestStatus.PendingCorrection;
    const reason = canCorrect ? lastCorrectionReason(request) : undefined;

    return (
        <>
            <Head>
                <title>{request.title} - {process.env.SCHOOL_NAME}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageMain>
                <PageHeader title={request.title} back={{ href: "/admin/event-requests", text: "Les meves sol·licituds" }} />
                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <div className="space-y-6">
                        {resubmitted && <SuccessAlert text="Sol·licitud corregida i enviada de nou a revisió." />}
                        {canCorrect ?
                            <div className="card p-6 sm:p-8">
                                <div className="mb-6 rounded-xl bg-orange-50 p-4 text-sm text-orange-900 ring-1 ring-orange-200">
                                    <p className="font-semibold">L&apos;administració demana que corregeixis la sol·licitud</p>
                                    {reason && <p className="mt-1 whitespace-pre-line">{reason}</p>}
                                </div>
                                <form action="#" method="post" onSubmit={onResubmit} autoComplete="off">
                                    <EventRequestFields data={data} setData={setData} errors={errors} />
                                    {errors?.has("") && <p className="form-error mt-6">{plainErrors(new Map([["", errors.get("") as string[]]]))}</p>}
                                    <input
                                        disabled={saving}
                                        className="btn btn-primary mt-8 w-full"
                                        value="Corregir i tornar a enviar"
                                        type="submit" />
                                </form>
                            </div> :
                            <div className="card p-6">
                                <EventRequestDetails request={request} />
                            </div>
                        }
                    </div>
                    <div className="card h-fit p-6">
                        <h3 className="section-title mb-4">Historial</h3>
                        <EventRequestHistory request={request} />
                    </div>
                </div>
            </PageMain>
        </>
    )
}

export default function MyEventRequestPage() {
    return (
        <Container>
            <MyEventRequest />
        </Container>
    )
}
