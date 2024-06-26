import { Container } from "@/components/layout/SideBar";
import { getProcessLog } from "@/lib/apis/payments";
import { useApiRequest, useStartApiRequest } from "@/lib/hooks/useApiRequest";
import { plainErrors } from "@/lib/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Log = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data, errors, isLoading, executeRequest } = useApiRequest(getProcessLog);

    useEffect(() => {
        if (!id) return;
        const logId = parseInt(id as string);
        executeRequest(logId);
    }, [id])

    if (errors) return <div className="ml-10 mt-4">{plainErrors(errors)}</div>

    if (!data) return null;

    return (
        <div>
            <h2>RESUM DE L&apos;EXECUCIÓ</h2>
            <ul className="mx-10 mt-5">
                {data.data.split("\n").map((x, idx) => <li key={idx}>{x}</li>)}
            </ul>
        </div>
    );
}

export default function LogPage() {
    return (
        <Container>
            <Log />
        </Container>
    )
};