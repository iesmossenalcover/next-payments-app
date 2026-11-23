import { getEventCalendar } from "@/lib/apis/payments/client";
import { CalendarItem, CalendarItemKind } from "@/lib/apis/payments/models";
import { twoDigit } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

// Selector de data i hora fet a mà (sense llibreries). Mostra un calendari mensual amb els
// esdeveniments i les sol·licituds en curs de cada dia, per ajudar a triar dates sense solapaments.

interface CalendarDateTimeProps {
    id: string,
    value?: string,
    onChange: (iso: string | undefined) => void,
    required?: boolean,
    // Hora que es posa en triar un dia si encara no n'hi ha cap ("HH:MM").
    defaultTime?: string,
    // Període que s'està demanant: es ressalta al calendari.
    rangeStart?: string,
    rangeEnd?: string,
    placeholder?: string,
    // En camps de la columna dreta, el calendari s'obre alineat a la dreta perquè no surti de la pantalla.
    align?: "left" | "right",
}

const WEEKDAYS = ["dl", "dt", "dc", "dj", "dv", "ds", "dg"];
const monthFormat = new Intl.DateTimeFormat("ca", { month: "long", year: "numeric" });
const dayFormat = new Intl.DateTimeFormat("ca", { weekday: "long", day: "numeric", month: "long" });
const valueFormat = new Intl.DateTimeFormat("ca", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const timeFormat = new Intl.DateTimeFormat("ca", { hour: "2-digit", minute: "2-digit" });

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const dayKey = (d: Date) => `${d.getFullYear()}-${twoDigit(d.getMonth() + 1)}-${twoDigit(d.getDate())}`;
const toTime = (d: Date) => `${twoDigit(d.getHours())}:${twoDigit(d.getMinutes())}`;
const parse = (iso?: string) => {
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

// Cada mes es demana un sol cop a l'API i es comparteix entre tots els selectors de la pàgina.
const cache = new Map<string, Promise<CalendarItem[]>>();
const loadItems = (from: Date, to: Date) => {
    const key = `${dayKey(from)}_${dayKey(to)}`;
    if (!cache.has(key)) {
        cache.set(key, getEventCalendar(from, to).catch(() => {
            cache.delete(key);
            return [];
        }));
    }
    return cache.get(key)!;
};

const coversDay = (item: CalendarItem, day: Date) => {
    const start = new Date(item.start);
    const end = item.end ? new Date(item.end) : start;
    return start <= endOfDay(day) && end >= startOfDay(day);
};

const kindDot = (kind: CalendarItemKind) => kind === CalendarItemKind.Event ? "bg-emerald-500" : "bg-violet-500";

const CalendarDateTime = ({ id, value, onChange, required = false, defaultTime = "09:00", rangeStart, rangeEnd, placeholder = "Tria una data", align = "left" }: CalendarDateTimeProps) => {
    const selected = parse(value);
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState(() => selected ?? parse(rangeStart) ?? new Date());
    const [focusDay, setFocusDay] = useState<Date | undefined>(selected);
    const [loaded, setLoaded] = useState<{ key: string, items: CalendarItem[] }>();
    const containerRef = useRef<HTMLDivElement>(null);

    const days = useMemo(() => monthGrid(month), [month]);
    const gridKey = dayKey(days[0]);

    // Carrega els elements de les 6 setmanes visibles quan el calendari és obert.
    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        loadItems(days[0], endOfDay(days[days.length - 1])).then(items => {
            if (!cancelled) setLoaded({ key: gridKey, items });
        });
        return () => { cancelled = true; };
    }, [open, days, gridKey]);

    // Es tanca en clicar fora o amb Escape.
    useEffect(() => {
        if (!open) return;
        const onMouseDown = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

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

    const range = useMemo(() => {
        const start = parse(rangeStart);
        if (!start) return undefined;
        return { start: startOfDay(start), end: endOfDay(parse(rangeEnd) ?? start) };
    }, [rangeStart, rangeEnd]);

    const openCalendar = () => {
        setMonth(selected ?? parse(rangeStart) ?? new Date());
        setFocusDay(selected);
        setOpen(true);
    }

    const selectDay = (day: Date) => {
        const [h, m] = (selected ? toTime(selected) : defaultTime).split(":").map(Number);
        onChange(new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m).toISOString());
        setFocusDay(day);
        if (day.getMonth() !== month.getMonth()) setMonth(day);
    }

    const changeTime = (time: string) => {
        if (!selected || !time) return;
        const [h, m] = time.split(":").map(Number);
        onChange(new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), h, m).toISOString());
    }

    const moveMonth = (delta: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

    const today = new Date();
    const shownDay = focusDay ?? selected;
    const shownItems = shownDay ? itemsByDay.get(dayKey(shownDay)) ?? [] : [];

    return (
        <div ref={containerRef} className="relative">
            <div className="flex gap-2">
                <button
                    type="button"
                    id={id}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    className={`form-input text-left ${selected ? "" : "text-slate-400"}`}
                    onClick={() => open ? setOpen(false) : openCalendar()}>
                    {selected ? valueFormat.format(selected) : placeholder}
                </button>
                {selected && !required &&
                    <button type="button" title="Esborrar la data" className="btn-icon" onClick={() => onChange(undefined)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>}
            </div>

            {open &&
                <div role="dialog" aria-label="Calendari" className={`card absolute left-0 z-40 ${align === "right" ? "sm:left-auto sm:right-0" : ""} mt-2 w-[22rem] max-w-[calc(100vw-2rem)] p-3 shadow-lg`}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <button type="button" title="Mes anterior" className="btn-icon" onClick={() => moveMonth(-1)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold capitalize text-slate-900">{monthFormat.format(month)}</span>
                            {!items && <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />}
                        </div>
                        <div className="flex items-center gap-1">
                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setMonth(today); setFocusDay(today); }}>Avui</button>
                            <button type="button" title="Mes següent" className="btn-icon" onClick={() => moveMonth(1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 text-center text-xs font-medium uppercase text-slate-400">
                        {WEEKDAYS.map(x => <div key={x} className="py-1">{x}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5" onMouseLeave={() => setFocusDay(selected)}>
                        {days.map(day => {
                            const key = dayKey(day);
                            const dayItems = itemsByDay.get(key) ?? [];
                            const isSelected = selected && sameDay(day, selected);
                            const inRange = range && day >= range.start && day <= range.end;
                            const outside = day.getMonth() !== month.getMonth();
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    title={dayItems.map(x => x.title).join("\n") || undefined}
                                    onMouseEnter={() => setFocusDay(day)}
                                    onFocus={() => setFocusDay(day)}
                                    onClick={() => selectDay(day)}
                                    className={`flex h-11 flex-col items-center justify-start rounded-md pt-1 text-sm transition-colors
                                        ${isSelected ? "bg-brand-600 font-semibold text-white" : inRange ? "bg-brand-50 text-brand-900" : "hover:bg-slate-100"}
                                        ${outside && !isSelected ? "text-slate-300" : ""}
                                        ${sameDay(day, today) && !isSelected ? "ring-1 ring-inset ring-brand-400" : ""}`}>
                                    {day.getDate()}
                                    {dayItems.length > 0 &&
                                        <span className="mt-0.5 flex items-center gap-0.5">
                                            {dayItems.slice(0, 3).map((x, idx) => <span key={idx} className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : kindDot(x.kind)}`} />)}
                                            {dayItems.length > 3 && <span className={`text-[0.6rem] leading-none ${isSelected ? "text-white" : "text-slate-500"}`}>+{dayItems.length - 3}</span>}
                                        </span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Alçada fixa: el calendari no canvia de mida segons el dia que es mira. */}
                    <div className="mt-3 flex h-36 flex-col border-t border-slate-100 pt-3">
                        {shownDay ?
                            <>
                                <p className="mb-1 text-xs font-medium first-letter:uppercase text-slate-500">{dayFormat.format(shownDay)}</p>
                                {shownItems.length === 0 ?
                                    <p className="text-sm text-slate-400">Cap esdeveniment ni sol·licitud.</p> :
                                    <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto">
                                        {shownItems.map(x => (
                                            <li key={`${x.kind}-${x.id}`} className="flex items-start gap-2 text-sm">
                                                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${kindDot(x.kind)}`} />
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-slate-900">{x.title}</span>
                                                    <span className="block text-xs text-slate-500">
                                                        {x.kind === CalendarItemKind.Event ? "Esdeveniment" : "Sol·licitud"} · {timeFormat.format(new Date(x.start))}
                                                        {x.end && ` – ${sameDay(new Date(x.start), new Date(x.end)) ? timeFormat.format(new Date(x.end)) : valueFormat.format(new Date(x.end))}`}
                                                    </span>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>}
                            </> :
                            <p className="text-sm text-slate-400">Passa per sobre d&apos;un dia per veure què hi ha.</p>}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Esdeveniment</span>
                            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-500" />Sol·licitud</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="time"
                                aria-label="Hora"
                                className="form-input w-28 py-1"
                                disabled={!selected}
                                value={selected ? toTime(selected) : ""}
                                onChange={e => changeTime(e.target.value)} />
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Fet</button>
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export default CalendarDateTime;
