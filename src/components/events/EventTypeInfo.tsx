import { EventType } from "@/lib/apis/payments/models";

export const eventTypeOptions: { value: EventType, label: string, help: string }[] = [
    {
        value: EventType.Walking,
        label: "Sortida a peu",
        help: "Es marcaran com a no autoritzats els alumnes sense l'autorització de sortides a peu del curs.",
    },
    {
        value: EventType.Transport,
        label: "Sortida amb transport",
        help: "Es marcaran com a no autoritzats els alumnes sense l'autorització de sortides amb transport del curs. Si hi ha qualsevol transport, tria aquesta opció.",
    },
    {
        value: EventType.Trip,
        label: "Viatge",
        help: "Els viatges tenen una autorització específica que es gestiona fora d'aquesta aplicació. No es marcarà cap alumne.",
    },
    {
        value: EventType.Other,
        label: "Altres",
        help: "No requereix autorització. No es marcarà cap alumne.",
    },
];

const shortLabels: Record<EventType, string> = {
    [EventType.Walking]: "A peu",
    [EventType.Transport]: "Transport",
    [EventType.Trip]: "Viatge",
    [EventType.Other]: "Altres",
};

export const EventTypeBadge = ({ type }: { type?: EventType }) => {
    if (type === undefined || type === null) return null;
    return <span className="badge badge-gray">{shortLabels[type]}</span>;
}

export const missingAuthorizationText = (type: EventType) =>
    type === EventType.Walking ? "Falta autorització a peu" : "Falta autorització de transport";

export const MissingAuthorizationBadge = ({ type }: { type: EventType }) => (
    <span className="badge badge-amber shrink-0">{missingAuthorizationText(type)}</span>
);
