import { EventRequest, EventRequestRecipient, EventRequestRecipientType, EventRequestStatus } from "@/lib/apis/payments/models";
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
    // Alumnes triats un a un, agrupats pel seu grup.
    const byGroup = new Map<number, EventRequestRecipient[]>();
    people.filter(x => x.groupId !== undefined && x.groupId !== null).forEach(x => byGroup.set(x.groupId!, [...(byGroup.get(x.groupId!) ?? []), x]));
    const partialGroups = Array.from(byGroup.entries());
    const ungrouped = people.filter(x => x.groupId === undefined || x.groupId === null);

    return (
        <dl className="divide-y divide-slate-100">
            <Row label="Estat"><EventRequestStatusBadge status={request.status} /></Row>
            {request.eventCode &&
                <Row label="Esdeveniment">
                    <Link className="link font-mono" href={`/admin/events/${request.eventCode}/summary`}>{request.eventCode}</Link>
                </Row>}
            {request.status === EventRequestStatus.PendingCreation && request.changesDeadline &&
                <Row label="Canvis del professor fins al">{displayDateTime(request.changesDeadline)}</Row>}
            {request.status === EventRequestStatus.PendingCreation &&
                <Row label="Google Calendar">{request.syncToCalendar ? "Es sincronitzarà en crear l'esdeveniment" : "No es sincronitzarà"}</Row>}
            <Row label="Sol·licitada per">{request.requesterName} <span className="text-slate-500">({request.requesterEmail})</span></Row>
            <Row label="Títol"><span className="font-medium">{request.title}</span></Row>
            <Row label="Descripció"><span className="whitespace-pre-line">{request.description || "-"}</span></Row>
            <Row label="Data d'inici">{displayDateTime(request.startDate)}</Row>
            <Row label="Data de finalització">{request.endDate ? displayDateTime(request.endDate) : "-"}</Row>
            <Row label="Preu">{displayPrice(request.price, "€")}</Row>
            <Row label="Data límit de pagament">{request.paymentDeadline ? displayDateTime(request.paymentDeadline) : "-"}</Row>
            <Row label="Destinataris">
                {groups.length === 0 && partialGroups.length === 0 && ungrouped.length === 0 ? "-" :
                    <div className="space-y-2">
                        {groups.length > 0 &&
                            <div className="flex flex-wrap gap-1">
                                {groups.map(x => <span key={x.referenceId} className="badge badge-purple">{x.name ?? `#${x.referenceId}`} · tot el grup</span>)}
                            </div>}
                        {partialGroups.map(([groupId, list]) => (
                            <details key={groupId} className="rounded-lg ring-1 ring-slate-200">
                                <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-3 py-2">
                                    <span className="font-medium">{list[0].groupName ?? `#${groupId}`}</span>
                                    <span className="text-slate-500">· {list.length} {list.length === 1 ? "alumne" : "alumnes"}</span>
                                </summary>
                                <ul className="space-y-1 px-3 pb-3">
                                    {list.map(x => <li key={x.referenceId}>{x.name ?? `#${x.referenceId}`}</li>)}
                                </ul>
                            </details>
                        ))}
                        {ungrouped.length > 0 &&
                            <div>
                                <p className="mb-1 text-slate-500">Alumnes sense grup aquest curs</p>
                                <div className="flex flex-wrap gap-1">
                                    {ungrouped.map(x => <span key={x.referenceId} className="badge badge-gray">{x.name ?? `#${x.referenceId}`}</span>)}
                                </div>
                            </div>}
                    </div>}
            </Row>
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
    recipients: r.recipients.map(x => ({ type: x.type, referenceId: x.referenceId, name: x.name, groupId: x.groupId, groupName: x.groupName })),
});
