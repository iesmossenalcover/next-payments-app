import { EventRequestAction, EventRequestStatus } from "@/lib/apis/payments/models";

// Colors del diagrama: morat = torn de l'admin, coral = torn del professor, gris = tancada.
const statusInfo: Record<EventRequestStatus, { label: string, badge: string }> = {
    [EventRequestStatus.PendingReview]: { label: "Pendent de revisió", badge: "badge-purple" },
    [EventRequestStatus.PendingCorrection]: { label: "Pendent de correcció", badge: "badge-coral" },
    [EventRequestStatus.PendingCreation]: { label: "Pendent de creació", badge: "badge-purple" },
    [EventRequestStatus.Created]: { label: "Creada", badge: "badge-gray" },
    [EventRequestStatus.Deleted]: { label: "Eliminada", badge: "badge-red" },
};

export const statusLabel = (status: EventRequestStatus) => statusInfo[status]?.label ?? "";

export const statusOptions = [
    EventRequestStatus.PendingReview,
    EventRequestStatus.PendingCorrection,
    EventRequestStatus.PendingCreation,
    EventRequestStatus.Created,
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
