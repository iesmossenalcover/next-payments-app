import { Container } from "@/components/layout/SideBar";
import { useRouter } from "next/router";

const Log = () => {
    const router = useRouter();
    const { id } = router.query

    return (
        <>hola</>
    );
}

export default function LogPage() {
    return (
        <Container>
            <Log />
        </Container>
    )
};