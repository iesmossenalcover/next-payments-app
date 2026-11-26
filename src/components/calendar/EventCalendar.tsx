import { statusDot, statusLabel } from "@/components/eventrequests/EventRequestStatus";
import { getEventCalendar } from "@/lib/apis/payments/client";
import { CalendarItem, CalendarItemKind } from "@/lib/apis/payments/models";
import { twoDigit } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

// Peces comunes del calendari d'esdeveniments i sol·licituds: les fan servir el selector de dates del
// formulari de sol·licitud (CalendarDateTime) i la pàgina del calendari.

export const WEEKDAYS = ["dl", "dt", "dc", "dj", "dv", "ds", "dg"];
export const monthFormat = new Intl.DateTimeFormat("ca", { month: "long", year: "numeric" });
export const dayFormat = new Intl.DateTimeFormat("ca", { weekday: "long", day: "numeric", month: "long" });
export const valueFormat = new Intl.DateTimeFormat("ca", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const timeFormat = new Intl.DateTimeFormat("ca", { hour: "2-digit", minute: "2-digit" });

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const dayKey = (d: Date) => `${d.getFullYear()}-${twoDigit(d.getMonth() + 1)}-${twoDigit(d.getDate())}`;
export const toTime = (d: Date) => `${twoDigit(d.getHours())}:${twoDigit(d.getMinutes())}`;
export const parseDate = (iso?: string) => {
    if (!iso) return undefined;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? undefined : d;
};

// 6 setmanes començant en dilluns: el mes sencer sempre hi cap.
const monthGrid = (month: Date) => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const start = addDays(first, -offset);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
};

// Cada mes es comparteix entre tots els calendaris de la pàgina, però només una estona: si no, en navegar
// sense recarregar no es veurien les sol·licituds i els esdeveniments nous.
const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { at: number, items: Promise<CalendarItem[]> }>();
const loadItems = (from: Date, to: Date) => {
    const key = `${dayKey(from)}_${dayKey(to)}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.items;
    const items = getEventCalendar(from, to).catch(() => {
        cache.delete(key);
        return [] as CalendarItem[];
    });
    cache.set(key, { at: Date.now(), items });
    return items;
};

const coversDay = (item: CalendarItem, day: Date) => {
    const start = new Date(item.start);
    const end = item.end ? new Date(item.end) : start;
    return start <= endOfDay(day) && end >= startOfDay(day);
};

const kindDot = (kind: CalendarItemKind) => kind === CalendarItemKind.Event ? "bg-emerald-500" : "bg-violet-500";
const BOTH_DOT = "bg-[linear-gradient(90deg,var(--color-emerald-500)_50%,var(--color-violet-500)_50%)]";

// Color d'un element: verd els esdeveniments; les sol·licituds, el del seu estat.
const itemDot = (x: CalendarItem) => x.kind === CalendarItemKind.Request && x.status !== undefined && x.status !== null ? statusDot(x.status) : kindDot(x.kind);

// Un sol cercle per dia: verd si només hi ha esdeveniments, lila si només sol·licituds, meitat i meitat si n'hi ha de tots dos.
const dayDot = (items: CalendarItem[]) => {
    const hasEvent = items.some(x => x.kind === CalendarItemKind.Event);
    const hasRequest = items.some(x => x.kind === CalendarItemKind.Request);
    if (hasEvent && hasRequest) return BOTH_DOT;
    return hasEvent ? kindDot(CalendarItemKind.Event) : kindDot(CalendarItemKind.Request);
};

/** Dies de la graella del mes i els elements de cada dia. Només carrega mentre `enabled`. */
export const useCalendarItems = (month: Date, enabled = true) => {
    const [loaded, setLoaded] = useState<{ key: string, items: CalendarItem[] }>();
    const days = useMemo(() => monthGrid(month), [month]);
    const gridKey = dayKey(days[0]);

    useEffect(() => {
        if (!enabled) return;
        let cancelled = false;
        loadItems(days[0], endOfDay(days[days.length - 1])).then(items => {
            if (!cancelled) setLoaded({ key: gridKey, items });
        });
        return () => { cancelled = true; };
    }, [enabled, days, gridKey]);

    const items = loaded?.key === gridKey ? loaded.items : undefined;
    const itemsByDay = useMemo(() => {
        const map = new Map<string, CalendarItem[]>();
        if (!items) return map;
        for (const day of days) {
            const list = items.filter(x => coversDay(x, day));
            if (list.length) map.set(dayKey(day), list);
        }
        return map;
    }, [items, days]);

    return { days, loading: !items, itemsByDay };
};

const ArrowIcon = ({ d }: { d: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

/** Capçalera: mes anterior / mes actual / avui / mes següent. */
export const MonthNav = ({ month, loading, onMove, onToday }: { month: Date, loading: boolean, onMove: (delta: number) => void, onToday: () => void }) => (
    <div className="mb-2 flex items-center justify-between gap-2">
        <button type="button" title="Mes anterior" className="btn-icon" onClick={() => onMove(-1)}>
            <ArrowIcon d="M15.75 19.5L8.25 12l7.5-7.5" />
        </button>
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold capitalize text-slate-900">{monthFormat.format(month)}</span>
            {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />}
        </div>
        <div className="flex items-center gap-1">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onToday}>Avui</button>
            <button type="button" title="Mes següent" className="btn-icon" onClick={() => onMove(1)}>
                <ArrowIcon d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </button>
        </div>
    </div>
);

interface MonthGridProps {
    month: Date,
    days: Date[],
    itemsByDay: Map<string, CalendarItem[]>,
    selected?: Date,
    // Període ressaltat (p. ex. el que s'està demanant).
    range?: { start: Date, end: Date },
    onSelect: (day: Date) => void,
    onFocusDay?: (day: Date) => void,
    onMouseLeave?: () => void,
    // Gran: a partir de sm, cada dia mostra els títols dels elements (pàgina del calendari).
    large?: boolean,
}

/** Graella de 6 setmanes. Al mòbil (o en mode compacte), cada dia mostra un sol cercle de color. */
export const MonthGrid = ({ month, days, itemsByDay, selected, range, onSelect, onFocusDay, onMouseLeave, large = false }: MonthGridProps) => {
    const today = new Date();
    return (
        <>
            <div className="grid grid-cols-7 text-center text-xs font-medium uppercase text-slate-400">
                {WEEKDAYS.map(x => <div key={x} className="py-1">{x}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5" onMouseLeave={onMouseLeave}>
                {days.map(day => {
                    const key = dayKey(day);
                    const dayItems = itemsByDay.get(key) ?? [];
                    const isSelected = selected && sameDay(day, selected);
                    const inRange = range && day >= range.start && day <= range.end;
                    const outside = day.getMonth() !== month.getMonth();
                    const isToday = sameDay(day, today);
                    const dot = dayItems.length > 0 &&
                        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${dayDot(dayItems)} ${isSelected ? "ring-2 ring-white" : ""} ${large ? "sm:hidden" : ""}`} />;
                    return (
                        <button
                            key={key}
                            type="button"
                            title={dayItems.map(x => x.title).join("\n") || undefined}
                            onMouseEnter={() => onFocusDay?.(day)}
                            onFocus={() => onFocusDay?.(day)}
                            onClick={() => onSelect(day)}
                            className={`flex h-12 flex-col items-center justify-start rounded-md pt-1 text-sm transition-colors
                                ${large ? "sm:h-28 sm:items-stretch sm:p-1.5 sm:text-left" : "sm:h-11"}
                                ${isSelected ? "bg-brand-600 font-semibold text-white" : inRange ? "bg-brand-50 text-brand-900" : "hover:bg-slate-100"}
                                ${large && !isSelected ? "sm:ring-1 sm:ring-inset sm:ring-slate-100" : ""}
                                ${outside && !isSelected ? "text-slate-300" : ""}
                                ${isToday && !isSelected ? "ring-1 ring-inset ring-brand-400 sm:ring-brand-400" : ""}`}>
                            <span className={large ? "sm:px-1 sm:text-xs sm:font-semibold" : ""}>{day.getDate()}</span>
                            {dot}
                            {large && dayItems.length > 0 &&
                                <span className="mt-1 hidden min-w-0 flex-col gap-0.5 sm:flex">
                                    {dayItems.slice(0, 3).map(x => (
                                        <span key={`${x.kind}-${x.id}`} className={`flex min-w-0 items-center gap-1 rounded px-1 text-[0.7rem] leading-4 ${isSelected ? "bg-white/15" : "bg-slate-50"} ${outside && !isSelected ? "opacity-60" : ""}`}>
                                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${itemDot(x)}`} />
                                            <span className={`truncate ${isSelected ? "text-white" : "text-slate-700"}`}>{x.title}</span>
                                        </span>
                                    ))}
                                    {dayItems.length > 3 && <span className={`px-1 text-[0.7rem] leading-4 ${isSelected ? "text-white" : "text-slate-500"}`}>+{dayItems.length - 3} més</span>}
                                </span>}
                        </button>
                    );
                })}
            </div>
        </>
    );
};

/** Llista del que hi ha un dia. */
export const DayItems = ({ day, items, emptyHint }: { day?: Date, items: CalendarItem[], emptyHint: string }) => {
    if (!day) return <p className="text-sm text-slate-400">{emptyHint}</p>;
    return (
        <>
            <p className="mb-1 text-xs font-medium first-letter:uppercase text-slate-500">{dayFormat.format(day)}</p>
            {items.length === 0 ?
                <p className="text-sm text-slate-400">Cap esdeveniment ni sol·licitud.</p> :
                <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto">
                    {items.map(x => (
                        <li key={`${x.kind}-${x.id}`} className="flex items-start gap-2 text-sm">
                            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${itemDot(x)}`} />
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-slate-900">{x.title}</span>
                                <span className="block text-xs text-slate-500">
                                    {x.kind === CalendarItemKind.Event ? "Esdeveniment" : `Sol·licitud${x.status !== undefined && x.status !== null ? ` (${statusLabel(x.status).toLowerCase()})` : ""}`} · {timeFormat.format(new Date(x.start))}
                                    {x.end && ` – ${sameDay(new Date(x.start), new Date(x.end)) ? timeFormat.format(new Date(x.end)) : valueFormat.format(new Date(x.end))}`}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>}
        </>
    );
};

export const CalendarLegend = () => (
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Esdeveniment</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" />Sol·licitud</span>
        <span className="flex items-center gap-1"><span className={`h-2.5 w-2.5 rounded-full ${BOTH_DOT}`} />Tots dos</span>
    </div>
);
