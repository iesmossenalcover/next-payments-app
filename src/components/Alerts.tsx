interface SuccessAlertProps {
    text: string
}

export const SuccessAlert = ({ text }: SuccessAlertProps) => {
    return (
        <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div className="flex justify-center">
                <div className="px-2">
                    <svg className="w-6 h-6 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p className="font-bold">{text}</p>
                </div>
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
        <div role="alert">
            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                {title}
            </div>
            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                <p>{text}</p>
            </div>
        </div>
    )
}