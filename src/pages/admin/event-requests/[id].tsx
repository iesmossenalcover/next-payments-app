import { DangerAlert, SuccessAlert } from "@/components/Alerts";
import EventRequestFields from "@/components/eventrequests/EventRequestFields";
import { EventRequestDetails, EventRequestHistory, lastCorrectionReason, toRequestData } from "@/components/eventrequests/EventRequestDetails";
import { Container } from "@/components/layout/SideBar";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/Loading";
import { editMyEventRequest, getMyEventRequest } from "@/lib/apis/payments/client";
import { EventRequest, EventRequestData, EventRequestStatus, Response } from "@/lib/apis/payments/models";
import { displayDateTime, plainErrors } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

// Detall d'una sol·licitud del professor. La pot editar quan l'admin n'ha demanat la correcció, o quan
// està aprovada i encara és dins del termini de canvis. En tots dos casos torna a revisió.
const MyEventRequest = () => {
    const router = useRouter();
    const id = Number(router.query.id);
    const [request, setRequest] = useState<EventRequest>();
    const [notFound, setNotFound] = useState(false);
    const [data, setData] = useState<EventRequestData>();
    const [errors, setErrors] = useState<Map<string, string[]>>();
    const [saving, setSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState<string>();
    // En una sol·licitud aprovada, el formulari només s'obre si el professor vol fer canvis.
    const [editingApproved, setEditingApproved] = useState(false);

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

    const onSave = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data || !request) return;
        const wasApproved = request.status === EventRequestStatus.PendingCreation;
        setSaving(true);
        const response = await editMyEventRequest(id, data);
        setSaving(false);
        if (response.errors) {
            setErrors(response.errors);
            return;
        }
        setErrors(undefined);
        setEditingApproved(false);
        setSavedMessage(wasApproved
            ? "Canvis desats. La sol·licitud torna a estar pendent de revisió."
            : "Sol·licitud corregida i enviada de nou a revisió.");
        await load();
    }

    if (notFound) return <PageMain narrow><DangerAlert title="No s'ha trobat la sol·licitud" text="No existeix o no és teva." /></PageMain>;
    if (!request || !data) return <div className="flex justify-center py-24"><Spinner /></div>;

    const canCorrect = request.status === EventRequestStatus.PendingCorrection;
    const reason = canCorrect ? lastCorrectionReason(request) : undefined;
    const canEditApproved = request.status === EventRequestStatus.PendingCreation && request.canRequesterEdit;
    const showForm = canCorrect || (canEditApproved && editingApproved);

    const form = (submitText: string) => (
        <form action="#" method="post" onSubmit={onSave} autoComplete="off">
            <EventRequestFields data={data} setData={setData} errors={errors} />
            {errors?.has("") && <p className="form-error mt-6">{plainErrors(new Map([["", errors.get("") as string[]]]))}</p>}
            <div className="mt-8 flex gap-3">
                <input disabled={saving} className="btn btn-primary flex-1" value={submitText} type="submit" />
                {!canCorrect &&
                    <button type="button" className="btn btn-secondary" onClick={() => { setData(toRequestData(request)); setErrors(undefined); setEditingApproved(false); }}>
                        Cancel·lar
                    </button>}
            </div>
        </form>
    );

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
                        {savedMessage && <SuccessAlert text={savedMessage} />}
                        {canEditApproved && request.changesDeadline &&
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-violet-50 p-4 text-sm text-violet-900 ring-1 ring-violet-200">
                                <div>
                                    <p className="font-semibold">Sol·licitud aprovada</p>
                                    <p className="mt-1">Pots fer-hi canvis fins al {displayDateTime(request.changesDeadline)}. Si en fas, tornarà a estar pendent de revisió.</p>
                                </div>
                                {!editingApproved &&
                                    <button type="button" className="btn btn-secondary" onClick={() => { setSavedMessage(undefined); setEditingApproved(true); }}>Fer canvis</button>}
                            </div>}
                        {showForm ?
                            <div className="card p-6 sm:p-8">
                                {canCorrect &&
                                    <div className="mb-6 rounded-xl bg-orange-50 p-4 text-sm text-orange-900 ring-1 ring-orange-200">
                                        <p className="font-semibold">L&apos;administració demana que corregeixis la sol·licitud</p>
                                        {reason && <p className="mt-1 whitespace-pre-line">{reason}</p>}
                                    </div>}
                                {form(canCorrect ? "Corregir i tornar a enviar" : "Desar canvis i tornar a revisió")}
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
