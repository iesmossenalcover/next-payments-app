interface SuccessAlertProps {
    text: string,
    children?: React.ReactElement
}

export const SuccessAlert = ({ text, children }: SuccessAlertProps) => {
    return (
        <div className="animate-fade-in flex gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-900 shadow-sm ring-1 ring-emerald-200" role="alert">
            <svg className="h-6 w-6 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="min-w-0">
                <p className="font-semibold">{text}</p>
                {children}
            </div>
        </div>
    )
}

interface DangerAlertProps {
    title: string,
    text: string
}

export const DangerAlert = ({ title, text }: DangerAlertProps) => {
    return (
        <div className="animate-fade-in flex gap-3 rounded-xl bg-red-50 p-4 text-red-900 shadow-sm ring-1 ring-red-200" role="alert">
            <svg className="h-6 w-6 shrink-0 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div className="min-w-0">
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-red-800">{text}</p>
            </div>
        </div>
    )
}
