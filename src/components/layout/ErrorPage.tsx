import Link from "next/link"

interface ErrorPageProps {
    code: string,
    title: string,
    icon?: React.ReactNode,
    link: { href: string, text: string },
}

export const ErrorPage = ({ code, title, icon, link }: ErrorPageProps) => {
    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="animate-fade-in max-w-md text-center">
                {icon &&
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                        {icon}
                    </div>
                }
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Error {code}</p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
                <Link className="btn btn-primary btn-lg mt-10" href={link.href}>
                    {link.text}
                </Link>
            </div>
        </main>
    )
}
