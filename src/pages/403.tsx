import Link from "next/link"

const UnauthorizedErrorPage = () => {
    return (
        <main className="text-center mt-10 p-5">
            <h1 className="text-2xl font-bold">Oops, no tens permisos per visitar aquesta pàgina!</h1>
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mt-3 w-24 h-24 m-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>

            <Link
                className="text-white
                    inline-block
                    mt-10
                    bg-blue-700
                    hover:bg-blue-800
                    focus:ring-4
                    focus:ring-blue-300
                    font-medium
                    rounded-lg
                    text-lg
                    px-5
                    py-2.5
                    mr-2
                    mb-2
                    dark:bg-blue-600
                    dark:hover:bg-blue-700
                    focus:outline-none
                    dark:focus:ring-blue-800"
                href="/admin/signin">Inicia sessió amb un altre usuari.</Link>
        </main>
    )
}

export default UnauthorizedErrorPage