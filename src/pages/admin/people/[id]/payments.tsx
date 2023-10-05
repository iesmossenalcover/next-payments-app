import { Container } from "@/components/layout/SideBar";
import { getPersonPayments } from "@/lib/apis/payments";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { displayDateTime } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const PersonPayments = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data, isLoading, executeRequest } = useApiRequest(getPersonPayments);

    useEffect(() => {
        if (!id) return;
        executeRequest(parseInt(id as string))
    }, [id]);

    if (!data) return null;

    if (!data.coursePayments) return (
        <>No hi ha pagaments.</>
    )

    return <>
        <Head>
            <title>Pagaments persona - {process.env.SCHOOL_NAME}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
            <div className="max-w-lg m-auto">
                {!data && <h3>Persona no trobada</h3>}
                {data && !data.coursePayments && <h3>Aquesta persona no té esdeveniments pagats</h3>}
                {data && data.coursePayments &&
                    <>
                        {data.coursePayments.map(x => (
                            <div key={x.courseId}>
                                <h2>{x.courseName}</h2>
                                <ul>
                                    {x.payments.map(y => (
                                        <li key={y.eventPersonId}>
                                            {y.eventName} - {y.amount}&euro; - {y.paidDate && displayDateTime(y.paidDate)}{y.manualPayment ? " - Pagat manualment" : null}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </>
                }
            </div>
        </main>
    </>
}

export default function PersonPaymentsPage() {
    return (
        <Container>
            <PersonPayments />
        </Container>
    )
};