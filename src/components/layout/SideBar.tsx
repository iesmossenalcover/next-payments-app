import useUser from "@/lib/hooks/useUser"
import Link from "next/link"

export const SideBar = () => {
    return (
        <nav className="w-56 flex-none bg-blue-900 text-white p-4 text-lg">
            <ul>
                <li className="my-3">
                    <Link href="/">Pagar</Link>
                </li>
                <li className="my-3">
                    <Link href="/admin/people">Llistar persones</Link>
                </li>
                <li className="my-3">
                    <Link href="/admin/events">Llsitar events</Link>
                </li>
            </ul>
        </nav>
    )
}

interface ContainerPropos {
    children: JSX.Element
}

export const  Container = ({ children }: ContainerPropos) => {
    const { user, loading } = useUser();
    if (loading || !user) return null;

    return (
        <div className="min-h-screen flex">
            <SideBar />
            <div className="flex-1 min-w-0 max-h-screen overflow-y-auto">
                {children}
            </div>
        </div>
    )
}