export const Spinner = ({ className = "w-8 h-8 text-brand-600" }: { className?: string }) => {
    return (
        <svg aria-hidden="true" className={`inline animate-spin ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-90" d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    )
}

export const PageLoading = () => {
    return (
        <div className="flex justify-center py-24">
            <Spinner />
        </div>
    )
}
