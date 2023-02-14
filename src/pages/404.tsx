import Link from "next/link"

const NotFoundPage = () => {
    return (
        <>
            <h1>Pàgina no trobada</h1>
            <Link href="/">Torna a la pàgina principal</Link>
        </>
    )
}

export default NotFoundPage