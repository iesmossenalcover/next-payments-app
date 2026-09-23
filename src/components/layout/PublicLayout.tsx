interface PublicLayoutProps {
    title?: React.ReactNode,
    subtitle?: React.ReactNode,
    children: React.ReactNode,
}

// Estructura comuna de les pàgines públiques (portal de pagaments i retorn del TPV).
export const PublicLayout = ({ title, subtitle, children }: PublicLayoutProps) => {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-600 to-violet-600 pb-32 print:hidden">
                <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />

                <header className="relative mx-auto flex max-w-3xl items-center gap-3 px-4 pt-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-inset ring-white/25 backdrop-blur">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-white">{process.env.SCHOOL_NAME}</span>
                </header>

                {title &&
                    <div className="relative mx-auto mt-10 max-w-3xl px-4">
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
                        {subtitle && <p className="mt-2 text-lg text-brand-100">{subtitle}</p>}
                    </div>
                }
            </div>

            <main className="relative mx-auto -mt-24 w-full max-w-3xl flex-1 px-4 pb-16 print:mt-0">
                {children}
            </main>

            <footer className="py-6 text-center text-xs text-slate-400 print:hidden">
                {process.env.SCHOOL_NAME} · Pagament segur
            </footer>
        </div>
    )
}
