import { CalendarLegend, DayItems, MonthGrid, MonthNav, dayKey, useCalendarItems } from "@/components/calendar/EventCalendar";
import { Container } from "@/components/layout/SideBar";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

// Calendari d'esdeveniments i sol·licituds: el mateix que es veu en triar dates a una sol·licitud,
// a pàgina sencera. A pantalla gran cada dia mostra els títols; al mòbil, un cercle i la llista a sota.
const EventCalendarPage = () => {
    const [month, setMonth] = useState(() => new Date());
    const [selected, setSelected] = useState<Date>(() => new Date());
    const { days, loading, itemsByDay } = useCalendarItems(month);

    const select = (day: Date) => {
        setSelected(day);
        if (day.getMonth() !== month.getMonth()) setMonth(day);
    }
    const moveMonth = (delta: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
    const goToday = () => { const today = new Date(); setMonth(today); setSelected(today); };

    return (
        <>
            <Head>
                <title>Calendari - {process.env.SCHOOL_NAME}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageMain>
                <PageHeader
                    title="Calendari"
                    subtitle="Esdeveniments i sol·licituds en curs"
                    actions={<Link className="btn btn-primary" href="/admin/event-requests/create">Nova sol·licitud</Link>} />

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
                    <div className="card p-3 sm:p-4">
                        <MonthNav month={month} loading={loading} onMove={moveMonth} onToday={goToday} />
                        <MonthGrid month={month} days={days} itemsByDay={itemsByDay} selected={selected} onSelect={select} large={true} />
                        <div className="mt-3 border-t border-slate-100 pt-3">
                            <CalendarLegend />
                        </div>
                    </div>
                    <div className="card flex h-fit flex-col p-4 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)]">
                        <DayItems day={selected} items={itemsByDay.get(dayKey(selected)) ?? []} emptyHint="Tria un dia per veure què hi ha." />
                    </div>
                </div>
            </PageMain>
        </>
    )
}

export default function CalendarPage() {
    return (
        <Container>
            <EventCalendarPage />
        </Container>
    )
}
