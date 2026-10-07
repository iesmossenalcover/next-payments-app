import { DangerAlert, SuccessAlert } from "@/components/Alerts";
import { createEvent } from "@/lib/apis/payments/client";
import { Event, EventType } from "@/lib/apis/payments/models";
import { useEffect, useState } from "react";
import EventFields from "@/components/events/EventFields";
import { Container } from "@/components/layout/SideBar";
import Head from "next/head";
import Link from "next/link";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
import { useApiRequest } from "@/lib/hooks/useApiRequest";

const defaultEvent: Event = {
    id: 0,
    code: "",
    name: "",
    description: "",
    date: new Date().toISOString(),
    price: 0,
    amipaPrice: 0,
    maxQuantity: 1,
    publishDate: new Date().toISOString(),
    unpublishDate: undefined,
    enrollment: false,
    amipa: false,
};


const PREFILL_HASH_KEY = "data";

const str = (v: unknown) => typeof v === "string" ? v : undefined;
const num = (v: unknown) => {
    const n = typeof v === "string" && v.trim() !== "" ? Number(v) : v;
    return typeof n === "number" && Number.isFinite(n) ? n : undefined;
};
const bool = (v: unknown) => typeof v === "boolean" ? v : undefined;
const isoDate = (v: unknown) => {
    if (typeof v !== "string" || v.trim() === "") return undefined;
    const d = new Date(v);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
};
const eventType = (v: unknown) => {
    const n = num(v);
    return n !== undefined && EventType[n] !== undefined ? n as EventType : undefined;
};

// Una cel·la de Google Sheets amb diverses línies genera salts de línia literals dins dels strings,
// cosa que el JSON no permet: s'escapen els caràcters de control que hi ha dins de cometes.
const escapeControlCharsInStrings = (json: string) => {
    let out = "";
    let inString = false;
    for (let i = 0; i < json.length; i++) {
        const c = json[i];
        if (inString) {
            if (c === "\\") { out += c + (json[++i] ?? ""); continue; }
            if (c === "\"") inString = false;
            else if (c === "\n") { out += "\\n"; continue; }
            else if (c === "\r") { out += "\\r"; continue; }
            else if (c === "\t") { out += "\\t"; continue; }
            else if (c < " ") { out += "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"); continue; }
        } else if (c === "\"") {
            inString = true;
        }
        out += c;
    }
    return out;
};

// Llegeix un esdeveniment codificat a la URL (#data=<json>), p. ex. des d'un enllaç de Google Sheets.
// Només omple el formulari: l'esdeveniment no es crea fins que l'administrador el revisa i el desa.
const parsePrefill = (hash: string): Event | undefined => {
    const raw = new URLSearchParams(hash.replace(/^#/, "")).get(PREFILL_HASH_KEY);
    if (raw === null) return undefined;

    const data = JSON.parse(escapeControlCharsInStrings(raw));
    if (typeof data !== "object" || data === null || Array.isArray(data)) throw new Error("not an object");

    const type = eventType(data.type);
    const isOther = type === undefined || type === EventType.Other;
    return {
        ...defaultEvent,
        name: str(data.name) ?? defaultEvent.name,
        description: str(data.description) ?? defaultEvent.description,
        location: str(data.location)?.trim() || undefined,
        type,
        date: isoDate(data.date) ?? defaultEvent.date,
        endDate: isoDate(data.endDate),
        price: num(data.price) ?? defaultEvent.price,
        amipaPrice: num(data.amipaPrice) ?? defaultEvent.amipaPrice,
        maxQuantity: num(data.maxQuantity) ?? defaultEvent.maxQuantity,
        maxCapacity: num(data.maxCapacity),
        publishDate: isoDate(data.publishDate) ?? defaultEvent.publishDate,
        unpublishDate: isoDate(data.unpublishDate),
        enrollment: isOther && (bool(data.enrollment) ?? false),
        amipa: isOther && (bool(data.amipa) ?? false),
    };
};

const Create = () => {
    const [event, setEvent] = useState(defaultEvent);
    const [created, setCreated] = useState(false);
    // Els camps de data guarden el seu propi estat: cal tornar a muntar el formulari quan s'omple des de la URL.
    const [formKey, setFormKey] = useState(0);
    const [prefillError, setPrefillError] = useState(false);
    const { data: code, errors, isLoading, executeRequest } = useApiRequest(createEvent);

    useEffect(() => {
        const applyPrefill = () => {
            try {
                const prefill = parsePrefill(window.location.hash);
                if (!prefill) return;
                setEvent(prefill);
                setPrefillError(false);
            } catch {
                setPrefillError(true);
            }
            setFormKey(k => k + 1);
            // Es treu de la URL perquè recarregar la pàgina no torni a sobreescriure el formulari.
            history.replaceState(history.state, "", window.location.pathname + window.location.search);
        };

        applyPrefill();
        window.addEventListener("hashchange", applyPrefill);
        return () => window.removeEventListener("hashchange", applyPrefill);
    }, []);

    const onSubmit = async (e: Event) => {
        const ok = await executeRequest(e);
        if (ok) {
            setCreated(true);
        }
    }

    const onFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(event);
    }

    const formDisabled = () => isLoading;

    return (
        <>
            <Head>
                <title>Afegir esdeveniment - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageMain narrow>
                <PageHeader title="Nou esdeveniment" back={{ href: "/admin/events", text: "Esdeveniments" }} />
                <div className="card p-6 sm:p-8">
                        {created ?
                            <SuccessAlert text={`Event afegit correctament el codi de l'event és: ${code}`}>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Link className="btn btn-success btn-sm" href={`/admin/events/${code}/people`}>
                                        Afegir persones a l&apos;esdeveniment
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                    <Link className="btn btn-secondary btn-sm" href="/admin/events">Tornar als esdeveniments</Link>
                                </div>
                            </SuccessAlert> :
                            <form action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">
                                {prefillError &&
                                    <div className="mb-6">
                                        <DangerAlert title="No s'han pogut carregar les dades de l'enllaç" text="El JSON de l'enllaç no és vàlid. Omple el formulari manualment." />
                                    </div>
                                }
                                <EventFields
                                    key={formKey}
                                    errors={errors}
                                    event={event}
                                    setEvent={setEvent} />
                                <div>
                                    <input
                                        disabled={formDisabled()}
                                        className="btn btn-primary mt-8 w-full"
                                        value="Crear esdeveniment"
                                        type="submit" />
                                </div>
                            </form>
                        }
                    </div>
            </PageMain>
        </>

    )
}

export default function CreateEventPage() {
    return (
        <Container>
            <Create />
        </Container>
    )
};