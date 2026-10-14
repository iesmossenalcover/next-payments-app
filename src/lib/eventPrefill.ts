import { Event, EventType } from "@/lib/apis/payments/models";

// Clau del hash de la URL amb el JSON de l'esdeveniment: /admin/events/...#data=<json>
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
const isEmpty = (v: unknown) => v === null || (typeof v === "string" && v.trim() === "");

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

// Llegeix un esdeveniment codificat a la URL (#data=<json>), p. ex. des d'un enllaç de Google Sheets,
// i el combina amb `base`: només es sobreescriuen els camps presents al JSON. Als camps opcionals
// (endDate, unpublishDate, location, maxCapacity, type) un valor null o "" els buida.
// Retorna undefined si la URL no porta dades i llança una excepció si el JSON no és vàlid.
// Només omple el formulari: no es desa res fins que l'administrador ho revisa i ho confirma.
export const parseEventPrefill = (hash: string, base: Event): Event | undefined => {
    const raw = new URLSearchParams(hash.replace(/^#/, "")).get(PREFILL_HASH_KEY);
    if (raw === null) return undefined;

    const data = JSON.parse(escapeControlCharsInStrings(raw));
    if (typeof data !== "object" || data === null || Array.isArray(data)) throw new Error("not an object");

    const required = <T,>(key: string, parse: (v: unknown) => T | undefined, current: T): T =>
        key in data ? parse(data[key]) ?? current : current;
    const optional = <T,>(key: string, parse: (v: unknown) => T | undefined, current: T | undefined): T | undefined => {
        if (!(key in data)) return current;
        if (isEmpty(data[key])) return undefined;
        return parse(data[key]) ?? current;
    };

    const type = optional("type", eventType, base.type);
    const isOther = type === undefined || type === EventType.Other;
    return {
        ...base,
        name: required("name", str, base.name),
        description: required("description", str, base.description),
        location: optional("location", v => str(v)?.trim() || undefined, base.location),
        type,
        date: required("date", isoDate, base.date),
        endDate: optional("endDate", isoDate, base.endDate),
        price: required("price", num, base.price),
        amipaPrice: required("amipaPrice", num, base.amipaPrice),
        maxQuantity: required("maxQuantity", num, base.maxQuantity),
        maxCapacity: optional("maxCapacity", num, base.maxCapacity),
        publishDate: required("publishDate", isoDate, base.publishDate),
        unpublishDate: optional("unpublishDate", isoDate, base.unpublishDate),
        // Els events de matrícula i d'AFA només tenen sentit amb el tipus "Altres".
        enrollment: isOther && required("enrollment", bool, base.enrollment),
        amipa: isOther && required("amipa", bool, base.amipa),
    };
};

// Treu les dades de la URL perquè recarregar la pàgina no torni a sobreescriure el formulari.
export const clearPrefillHash = () =>
    history.replaceState(history.state, "", window.location.pathname + window.location.search);
