import { CalendarLegend, DayItems, MonthGrid, MonthNav, dayKey, endOfDay, parseDate as parse, startOfDay, toTime, useCalendarItems, valueFormat } from "@/components/calendar/EventCalendar";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

// Selector de data i hora fet a mà (sense llibreries). Obre un modal amb un calendari mensual i els
// esdeveniments i les sol·licituds en curs de cada dia, per ajudar a triar dates sense solapaments.
// Al mòbil el modal ocupa tota la pantalla; a pantalla gran, la llista del dia va al costat.

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
    // Títol del modal (normalment, l'etiqueta del camp).
    title?: string,
}

const CalendarDateTime = ({ id, value, onChange, required = false, defaultTime = "09:00", rangeStart, rangeEnd, placeholder = "Tria una data", title = "Tria una data" }: CalendarDateTimeProps) => {
    const selected = parse(value);
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState(() => selected ?? parse(rangeStart) ?? new Date());
    const [focusDay, setFocusDay] = useState<Date | undefined>(selected);
    const { days, loading, itemsByDay } = useCalendarItems(month, open);

    // Amb el modal obert: es tanca amb Escape i la pàgina del darrere no fa scroll.
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

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

    const dayList = <DayItems day={shownDay} items={shownItems} emptyHint="Toca o passa per sobre d'un dia per veure què hi ha." />;

    const modal = (
        <div
            className="fixed inset-0 z-50 flex justify-center bg-slate-900/40 sm:items-center sm:p-4"
            onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${id}-title`}
                className="flex h-dvh w-full flex-col overflow-y-auto bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl sm:h-auto sm:max-h-[95dvh] sm:w-auto sm:rounded-xl sm:pb-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <h2 id={`${id}-title`} className="text-base font-semibold text-slate-900">{title}</h2>
                    <button type="button" title="Tancar" className="btn-icon" onClick={() => setOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-4 sm:flex-none sm:flex-row">
                    <div className="w-full sm:w-[22rem]">
                        <MonthNav month={month} loading={loading} onMove={moveMonth} onToday={() => { setMonth(today); setFocusDay(today); }} />
                        <MonthGrid
                            month={month}
                            days={days}
                            itemsByDay={itemsByDay}
                            selected={selected}
                            range={range}
                            onSelect={selectDay}
                            onFocusDay={setFocusDay}
                            onMouseLeave={() => setFocusDay(selected)} />
                    </div>

                    {/* Alçada fixa: al mòbil, la resta de la pantalla; al costat, la de la graella (el contingut és absolut
                        i no l'eixampla). Així el modal no canvia de mida segons el dia que es mira. */}
                    <div className="relative flex min-h-[9rem] flex-1 flex-col border-t border-slate-100 pt-3 sm:block sm:w-64 sm:flex-none sm:border-l sm:border-t-0 sm:pt-0">
                        <div className="flex min-h-0 flex-1 flex-col sm:absolute sm:inset-0 sm:pl-4">
                            {dayList}
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <CalendarLegend />
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
            </div>
        </div>
    );

    return (
        <>
            <div className="flex gap-2">
                <button
                    type="button"
                    id={id}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    className={`form-input text-left ${selected ? "" : "text-slate-400"}`}
                    onClick={openCalendar}>
                    {selected ? valueFormat.format(selected) : placeholder}
                </button>
                {selected && !required &&
                    <button type="button" title="Esborrar la data" className="btn-icon" onClick={() => onChange(undefined)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>}
            </div>
            {/* Al body perquè cap contenidor (overflow, transform…) el retalli. */}
            {open && createPortal(modal, document.body)}
        </>
    );
}

export default CalendarDateTime;
