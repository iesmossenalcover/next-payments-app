import { DangerAlert, SuccessAlert } from "@/components/Alerts";
import EventFields from "@/components/events/EventFields";
import EventRequestFields from "@/components/eventrequests/EventRequestFields";
import { EventRequestDetails, EventRequestHistory, toRequestData } from "@/components/eventrequests/EventRequestDetails";
import { Container } from "@/components/layout/SideBar";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/Loading";
import {
    approveEventRequest, createEventFromRequest, deleteEventRequest, editEventRequest,
    getEventRequest, rejectEventRequest, requestEventRequestCorrection
} from "@/lib/apis/payments/client";
import { Event, EventRequest, EventRequestData, EventRequestStatus, Response } from "@/lib/apis/payments/models";
import { DateTime } from "@/components/form";
import { plainErrors, toInputDateTime } from "@/lib/utils";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

// Què està fent l'admin a la pàgina: res (veure), editar, escriure un motiu o crear l'esdeveniment.
type Mode = "view" | "approve" | "edit" | "correction" | "reject" | "create";

// Termini de canvis proposat en aprovar: d'aquí a 3 dies, a les 23:59.
const DEFAULT_CHANGES_DAYS = 3;
const defaultChangesDeadline = () => {
    const d = new Date();
    d.setDate(d.getDate() + DEFAULT_CHANGES_DAYS);
    d.setHours(23, 59, 0, 0);
    return d.toISOString();
};

// Esdeveniment precarregat amb les dades de la sol·licitud. La resta de camps els completa l'admin.
const eventFromRequest = (r: EventRequest): Event => ({
    id: 0,
    code: "",
    name: r.title,
    description: r.description,
    date: r.startDate,
    endDate: r.endDate ?? undefined,
    price: r.price,
    amipaPrice: r.price,
    maxQuantity: 1,
    publishDate: new Date().toISOString(),
    unpublishDate: r.paymentDeadline ?? undefined,
    enrollment: false,
    amipa: false,
    notifyExtracurricular: true,
});

const ReviewEventRequest = () => {
    const router = useRouter();
    const id = Number(router.query.id);
    const [request, setRequest] = useState<EventRequest>();
    const [notFound, setNotFound] = useState(false);
    const [mode, setMode] = useState<Mode>("view");
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState<Map<string, string[]>>();
    const [message, setMessage] = useState<string>();
    const [createdCode, setCreatedCode] = useState<string>();

    const [data, setData] = useState<EventRequestData>();
    const [reason, setReason] = useState("");
    const [changesDeadline, setChangesDeadline] = useState(defaultChangesDeadline);
    const [event, setEvent] = useState<Event>();

    // resetForms = false per no perdre el que l'admin ha escrit quan una acció torna errors.
    const apply = useCallback((response: Response<EventRequest>, resetForms: boolean = true) => {
        if (!response.data) {
            setNotFound(true);
            return;
        }
        setRequest(response.data);
        if (resetForms) {
            setData(toRequestData(response.data));
            setEvent(eventFromRequest(response.data));
        }
    }, []);

    const load = async (resetForms: boolean = true) => apply(await getEventRequest(id), resetForms);

    useEffect(() => {
        if (!router.isReady) return;
        getEventRequest(id).then(x => apply(x));
    }, [router.isReady, id, apply]);

    const changeMode = (m: Mode) => {
        setMode(m);
        setErrors(undefined);
        setMessage(undefined);
        setReason("");
        setChangesDeadline(defaultChangesDeadline());
    }

    // Executa una acció: si va bé, recarrega la sol·licitud i torna al mode de veure.
    // Si onSuccess retorna true, no es recarrega (p. ex. perquè ja se surt de la pàgina).
    const run = async <T,>(action: () => Promise<Response<T>>, successMessage: string, onSuccess?: (data: T) => boolean | void) => {
        setBusy(true);
        const response = await action();
        setBusy(false);
        if (response.errors) {
            setErrors(response.errors);
            // Si ha canviat l'estat mentrestant, es mostra l'estat actual sense perdre el formulari.
            await load(false);
            return;
        }
        if (onSuccess && response.data !== undefined && onSuccess(response.data)) return;
        changeMode("view");
        setMessage(successMessage);
        await load();
    }

    if (notFound) return <PageMain narrow><DangerAlert title="No s'ha trobat la sol·licitud" text="No existeix o s'ha eliminat." /></PageMain>;
    if (!request || !data || !event) return <div className="flex justify-center py-24"><Spinner /></div>;

    const s = request.status;
    const canApprove = s === EventRequestStatus.PendingReview;
    const canEdit = s === EventRequestStatus.PendingReview || s === EventRequestStatus.PendingCreation;
    const canRequestCorrection = s === EventRequestStatus.PendingReview || s === EventRequestStatus.PendingCreation;
    const canCreate = s === EventRequestStatus.PendingCreation;
    const canRejectOrDelete = s === EventRequestStatus.PendingReview || s === EventRequestStatus.PendingCorrection || s === EventRequestStatus.PendingCreation;

    const onSubmitApprove = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        run(() => approveEventRequest(id, changesDeadline), "Sol·licitud aprovada. S'ha avisat el professor del termini per fer canvis.");
    }

    const onDelete = () => {
        if (!confirm("Eliminar la sol·licitud? Desapareixerà per a tothom i s'avisarà el professor.")) return;
        run(() => deleteEventRequest(id), "", () => { router.push("/admin/event-requests/review"); return true; });
    }

    const onSubmitReason = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (mode === "correction") {
            run(() => requestEventRequestCorrection(id, reason), "S'ha demanat la correcció al professor.");
        } else if (mode === "reject") {
            run(() => rejectEventRequest(id, reason), "", () => { router.push("/admin/event-requests/review"); return true; });
        }
    }

    const onSubmitEdit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        run(() => editEventRequest(id, data), s === EventRequestStatus.PendingCreation
            ? "Canvis desats. La sol·licitud torna a estar pendent de revisió."
            : "Canvis desats.");
    }

    const onSubmitCreate = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        run(() => createEventFromRequest(id, event), "Esdeveniment creat.", code => { setCreatedCode(code); });
    }

    const actionButton = (text: string, onClick: () => void, className = "btn-secondary") =>
        <button type="button" disabled={busy} className={`btn ${className}`} onClick={onClick}>{text}</button>;

    const errorBox = errors && <DangerAlert title="No s'ha pogut fer l'acció" text={plainErrors(errors).toString()} />;

    const renderMain = () => {
        switch (mode) {
            case "edit":
                return (
                    <form className="card p-6 sm:p-8" action="#" method="post" onSubmit={onSubmitEdit} autoComplete="off">
                        {s === EventRequestStatus.PendingCreation &&
                            <p className="mb-6 rounded-xl bg-violet-50 p-4 text-sm text-violet-900 ring-1 ring-violet-200">
                                En desar, la sol·licitud tornarà a estar pendent de revisió.
                            </p>}
                        <EventRequestFields data={data} setData={setData} errors={errors} />
                        <div className="mt-8 flex gap-3">
                            <input disabled={busy} className="btn btn-primary flex-1" value="Desar canvis" type="submit" />
                            {actionButton("Cancel·lar", () => { setData(toRequestData(request)); changeMode("view"); })}
                        </div>
                    </form>
                );
            case "approve":
                return (
                    <form className="card p-6 sm:p-8" action="#" method="post" onSubmit={onSubmitApprove}>
                        <h3 className="section-title mb-1">Aprovar la sol·licitud</h3>
                        <p className="form-hint mb-4">
                            El professor rebrà un correu i podrà fer canvis fins a la data indicada (si en fa, tornarà a revisió).
                            Pots crear l&apos;esdeveniment en qualsevol moment, també abans d&apos;aquesta data.
                        </p>
                        <label className="form-label" htmlFor="changesDeadline">Canvis del professor fins al</label>
                        <DateTime
                            className="form-input sm:max-w-64"
                            id="changesDeadline" name="changesDeadline"
                            type="datetime-local"
                            required={true}
                            initialValue={toInputDateTime(new Date(changesDeadline))}
                            onDateChanged={d => setChangesDeadline(d && !isNaN(d.getTime()) ? d.toISOString() : "")} />
                        {errors?.has("changesDeadline") && <p className="form-error">{(errors.get("changesDeadline") as string[]).join(", ")}</p>}
                        <div className="mt-6 flex gap-3">
                            <input disabled={busy || changesDeadline === ""} className="btn btn-primary flex-1" value="Aprovar" type="submit" />
                            {actionButton("Cancel·lar", () => changeMode("view"))}
                        </div>
                    </form>
                );
            case "correction":
            case "reject":
                return (
                    <form className="card p-6 sm:p-8" action="#" method="post" onSubmit={onSubmitReason}>
                        <h3 className="section-title mb-1">{mode === "correction" ? "Demanar correcció" : "Rebutjar la sol·licitud"}</h3>
                        <p className="form-hint mb-4">
                            {mode === "correction"
                                ? "El professor rebrà un correu amb el motiu i podrà corregir la sol·licitud."
                                : "La sol·licitud s'eliminarà per a tothom i el professor rebrà un correu amb el motiu."}
                        </p>
                        <label className="form-label" htmlFor="reason">Motiu</label>
                        <textarea
                            id="reason" name="reason"
                            className="form-input min-h-32"
                            required
                            value={reason}
                            onChange={e => setReason(e.target.value)} />
                        <div className="mt-6 flex gap-3">
                            <input
                                disabled={busy || reason.trim() === ""}
                                className={`btn flex-1 ${mode === "reject" ? "btn-danger" : "btn-primary"}`}
                                value={mode === "correction" ? "Demanar correcció" : "Rebutjar"}
                                type="submit" />
                            {actionButton("Cancel·lar", () => changeMode("view"))}
                        </div>
                    </form>
                );
            case "create":
                return (
                    <form className="card p-6 sm:p-8" action="#" method="post" onSubmit={onSubmitCreate} autoComplete="off">
                        <p className="mb-6 text-sm text-slate-500">
                            Revisa i completa les dades de l&apos;esdeveniment. En crear-lo s&apos;hi afegiran els alumnes dels grups proposats.
                        </p>
                        <EventFields event={event} setEvent={setEvent} errors={errors} />
                        <div className="mt-8 flex gap-3">
                            <input disabled={busy} className="btn btn-success flex-1" value="Crear esdeveniment" type="submit" />
                            {actionButton("Cancel·lar", () => { setEvent(eventFromRequest(request)); changeMode("view"); })}
                        </div>
                    </form>
                );
            default:
                return <div className="card p-6"><EventRequestDetails request={request} /></div>;
        }
    }

    return (
        <>
            <Head>
                <title>{request.title} - {process.env.SCHOOL_NAME}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageMain>
                <PageHeader
                    title={request.title}
                    subtitle={`Sol·licitada per ${request.requesterName}`}
                    back={{ href: "/admin/event-requests/review", text: "Revisar sol·licituds" }}
                    actions={mode === "view" && <>
                        {canApprove && actionButton("Aprovar", () => changeMode("approve"), "btn-primary")}
                        {canCreate && actionButton("Crear esdeveniment", () => changeMode("create"), "btn-success")}
                        {canEdit && actionButton("Editar", () => changeMode("edit"))}
                        {canRequestCorrection && actionButton("Demanar correcció", () => changeMode("correction"))}
                        {canRejectOrDelete && actionButton("Rebutjar", () => changeMode("reject"), "btn-danger")}
                        {canRejectOrDelete && actionButton("Eliminar", onDelete, "btn-ghost")}
                    </>} />

                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <div className="space-y-6">
                        {message && <SuccessAlert text={message}>
                            {createdCode ?
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Link className="btn btn-success btn-sm" href={`/admin/events/${createdCode}/people`}>Veure les persones de l&apos;esdeveniment</Link>
                                </div> : undefined}
                        </SuccessAlert>}
                        {mode === "view" && errorBox}
                        {s === EventRequestStatus.PendingCorrection && mode === "view" &&
                            <p className="rounded-xl bg-orange-50 p-4 text-sm text-orange-900 ring-1 ring-orange-200">
                                És el torn del professor: no es pot editar fins que la corregeixi.
                            </p>}
                        {renderMain()}
                        {mode !== "view" && errors?.has("") && <p className="form-error">{(errors.get("") as string[]).join(", ")}</p>}
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

export default function ReviewEventRequestPage() {
    return (
        <Container>
            <ReviewEventRequest />
        </Container>
    )
}
