import Link from "next/link"

const InternalServerErrorPage = () => {
    return (
        <>
        <h1>Oops, s&apos;ha produït un error!</h1>
        <Link href="/">Ves a la pàgina principal</Link>
        </>
    )
}

export default InternalServerErrorPage