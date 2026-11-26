import { EventRequestAction, EventRequestStatus } from "@/lib/apis/payments/models";

// Un color per estat: l'etiqueta (badge) i el punt equivalent (calendari).
const statusInfo: Record<EventRequestStatus, { label: string, badge: string, dot: string }> = {
    [EventRequestStatus.PendingReview]: { label: "Pendent de revisió", badge: "badge-purple", dot: "bg-violet-500" },
    [EventRequestStatus.PendingCorrection]: { label: "Pendent de correcció", badge: "badge-coral", dot: "bg-orange-500" },
    [EventRequestStatus.PendingCreation]: { label: "Pendent de creació", badge: "badge-sky", dot: "bg-sky-500" },
    [EventRequestStatus.Created]: { label: "Creada", badge: "badge-green", dot: "bg-emerald-500" },
    [EventRequestStatus.Rejected]: { label: "Rebutjada", badge: "badge-red", dot: "bg-red-500" },
    [EventRequestStatus.Deleted]: { label: "Eliminada", badge: "badge-gray", dot: "bg-slate-400" },
};

export const statusLabel = (status: EventRequestStatus) => statusInfo[status]?.label ?? "";
export const statusDot = (status: EventRequestStatus) => statusInfo[status]?.dot ?? "bg-violet-500";

export const statusOptions = [
    EventRequestStatus.PendingReview,
    EventRequestStatus.PendingCorrection,
    EventRequestStatus.PendingCreation,
    EventRequestStatus.Created,
    EventRequestStatus.Rejected,
].map(x => ({ value: x, label: statusLabel(x) }));

export const EventRequestStatusBadge = ({ status }: { status: EventRequestStatus }) => {
    const info = statusInfo[status];
    if (!info) return null;
    return <span className={`badge ${info.badge}`}>{info.label}</span>;
}

const actionLabels: Record<EventRequestAction, string> = {
    [EventRequestAction.Submit]: "Enviada",
    [EventRequestAction.Approve]: "Aprovada",
    [EventRequestAction.RequestCorrection]: "Correcció demanada",
    [EventRequestAction.Edit]: "Editada per l'administració",
    [EventRequestAction.Resubmit]: "Corregida i reenviada",
    [EventRequestAction.CreateEvent]: "Esdeveniment creat",
    [EventRequestAction.EventDeleted]: "Esdeveniment eliminat",
    [EventRequestAction.Reject]: "Rebutjada",
    [EventRequestAction.Delete]: "Eliminada",
};

export const actionLabel = (action: EventRequestAction) => actionLabels[action] ?? "";
