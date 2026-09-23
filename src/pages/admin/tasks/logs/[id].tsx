import { Container } from "@/components/layout/SideBar";
import { getProcessLog } from "@/lib/apis/payments";
import { useApiRequest, useStartApiRequest } from "@/lib/hooks/useApiRequest";
import { plainErrors } from "@/lib/utils";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
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

    if (errors) return <PageMain><p className="form-error">{plainErrors(errors)}</p></PageMain>

    if (!data) return null;

    return (
        <PageMain>
            <PageHeader title="Resum de l'execució" back={{ href: "/admin/tasks", text: "Sincronització" }} />
            <ul className="card overflow-x-auto bg-slate-900 p-5 font-mono text-sm leading-relaxed text-slate-100 ring-slate-800">
                {data.data.split("\n").map((x, idx) => <li key={idx} className="whitespace-pre">{x}</li>)}
            </ul>
        </PageMain>
    );
}

export default function LogPage() {
    return (
        <Container>
            <Log />
        </Container>
    )
};