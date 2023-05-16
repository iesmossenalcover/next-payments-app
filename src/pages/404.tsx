import Link from "next/link"

const NotFoundPage = () => {
    return (
        <main className="text-center mt-10 p-5">
            <h1 className="text-2xl font-bold">Pàgina no trobada</h1>
            
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
                href="/admin/signin">Torna a la pàgina principal.</Link>
        </main>
    )
}

export default NotFoundPage