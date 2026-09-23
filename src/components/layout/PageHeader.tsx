import Link from "next/link";

interface PageHeaderProps {
    title: React.ReactNode,
    subtitle?: React.ReactNode,
    actions?: React.ReactNode,
    back?: { href: string, text: string },
}

export const PageHeader = ({ title, subtitle, actions, back }: PageHeaderProps) => {
    return (
        <div className="mb-8">
            {back &&
                <Link href={back.href} className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 print:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    {back.text}
                </Link>
            }
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
                    {subtitle && <div className="mt-1 text-slate-500">{subtitle}</div>}
                </div>
                {actions && <div className="flex flex-wrap items-center gap-3 print:hidden">{actions}</div>}
            </div>
        </div>
    )
}

export const PageMain = ({ children, narrow = false }: { children: React.ReactNode, narrow?: boolean }) => {
    return (
        <main className={`mx-auto w-full px-4 py-8 sm:px-6 lg:px-10 ${narrow ? "max-w-2xl" : "max-w-[96rem]"}`}>
            {children}
        </main>
    )
}
