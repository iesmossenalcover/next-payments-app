import { EventRequest, EventRequestRecipientType } from "@/lib/apis/payments/models";
import { displayDateTime, displayPrice } from "@/lib/utils";
import Link from "next/link";
import { actionLabel, EventRequestStatusBadge, statusLabel } from "./EventRequestStatus";

const Row = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="grid gap-1 py-2 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <dt className="text-sm text-slate-500">{label}</dt>
        <dd className="text-sm text-slate-900">{children}</dd>
    </div>
);

// Dades de la sol·licitud en mode lectura.
export const EventRequestDetails = ({ request }: { request: EventRequest }) => {
    const groups = request.recipients.filter(x => x.type === EventRequestRecipientType.Group);
    const people = request.recipients.filter(x => x.type === EventRequestRecipientType.Person);

    return (
        <dl className="divide-y divide-slate-100">
            <Row label="Estat"><EventRequestStatusBadge status={request.status} /></Row>
            {request.eventCode &&
                <Row label="Esdeveniment">
                    <Link className="link font-mono" href={`/admin/events/${request.eventCode}/summary`}>{request.eventCode}</Link>
                </Row>}
            <Row label="Sol·licitada per">{request.requesterName} <span className="text-slate-500">({request.requesterEmail})</span></Row>
            <Row label="Títol"><span className="font-medium">{request.title}</span></Row>
            <Row label="Descripció"><span className="whitespace-pre-line">{request.description || "-"}</span></Row>
            <Row label="Data d'inici">{displayDateTime(request.startDate)}</Row>
            <Row label="Data de finalització">{request.endDate ? displayDateTime(request.endDate) : "-"}</Row>
            <Row label="Preu">{displayPrice(request.price, "€")}</Row>
            <Row label="Data límit de pagament">{request.paymentDeadline ? displayDateTime(request.paymentDeadline) : "-"}</Row>
            <Row label="Grups">
                {groups.length === 0 ? "-" :
                    <div className="flex flex-wrap gap-1">
                        {groups.map(x => <span key={x.referenceId} className="badge badge-gray">{x.name ?? `#${x.referenceId}`}</span>)}
                    </div>}
            </Row>
            {people.length > 0 &&
                <Row label="Alumnes">
                    <div className="flex flex-wrap gap-1">
                        {people.map(x => <span key={x.referenceId} className="badge badge-gray">{x.name ?? `#${x.referenceId}`}</span>)}
                    </div>
                </Row>}
        </dl>
    )
}

// Historial de canvis d'estat, del més antic al més nou.
export const EventRequestHistory = ({ request }: { request: EventRequest }) => (
    <ol className="space-y-4">
        {request.transitions.map((t, idx) => (
            <li key={idx} className="flex gap-3">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${t.automatic ? "bg-slate-300" : "bg-brand-500"}`} />
                <div className="min-w-0 text-sm">
                    <p className="font-medium text-slate-900">
                        {actionLabel(t.action)}
                        {t.from !== undefined && t.from !== null && t.from !== t.to &&
                            <span className="font-normal text-slate-500"> · {statusLabel(t.from)} → {statusLabel(t.to)}</span>}
                    </p>
                    <p className="text-slate-500">
                        {displayDateTime(t.date)}
                        {t.actorName && ` · ${t.actorName}`}
                        {t.automatic && " · automàtic"}
                    </p>
                    {t.reason && <p className="mt-1 whitespace-pre-line rounded-lg bg-slate-50 p-2 text-slate-700">{t.reason}</p>}
                </div>
            </li>
        ))}
    </ol>
)

// Motiu de l'última petició de correcció (el que el professor ha de corregir).
export const lastCorrectionReason = (request: EventRequest) =>
    [...request.transitions].reverse().find(x => x.reason && x.to === request.status)?.reason;

export const emptyRequestData = () => ({
    title: "",
    description: "",
    startDate: "",
    endDate: undefined,
    price: 0,
    paymentDeadline: undefined,
    recipients: [],
});

export const toRequestData = (r: EventRequest) => ({
    title: r.title,
    description: r.description,
    startDate: r.startDate,
    endDate: r.endDate ?? undefined,
    price: r.price,
    paymentDeadline: r.paymentDeadline ?? undefined,
    recipients: r.recipients.map(x => ({ type: x.type, referenceId: x.referenceId })),
});
