import { Container } from "@/components/layout/SideBar";
import { getPersonPayments } from "@/lib/apis/payments";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { displayDateTime } from "@/lib/utils";
import Head from "next/head";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
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
        <PageMain narrow><p className="card px-6 py-12 text-center text-slate-500">No hi ha pagaments.</p></PageMain>
    )

    return <>
        <Head>
            <title>Pagaments persona - {process.env.SCHOOL_NAME}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageMain narrow>
            <PageHeader
                title="Pagaments"
                subtitle={data.personName}
                back={{ href: `/admin/people/${id}`, text: "Persona" }}
                actions={data.coursePayments.length > 0 &&
                    <button onClick={() => window.print()} className="btn btn-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                        </svg>
                        Imprimir
                    </button>
                } />
            <div>
                {!data && <h3>Persona no trobada</h3>}
                {data && !data.coursePayments.length &&
                    <p className="card px-6 py-12 text-center text-slate-500">Aquesta persona no té esdeveniments pagats</p>}
                {data && data.coursePayments.length > 0 &&
                    <div className="card p-6 sm:p-8 print:p-0">
                        <div className="mb-8 border-b border-slate-200 pb-6">
                            <div className="mb-4 text-center text-2xl font-bold tracking-tight text-slate-900">
                                {process.env.SCHOOL_NAME}
                            </div>
                            <div className="flex justify-between font-semibold text-slate-900">
                                <span>{data.personName}</span>
                                <span className="tabular-nums">{data.documentId}</span>
                            </div>
                        </div>
                        {data.coursePayments.map(x => (
                            <div key={x.courseId} className="mb-8 last:mb-0">
                                <h2 className="mb-3 text-lg font-semibold text-slate-900">Curs: {x.courseName}</h2>
                                <ul className="divide-y divide-slate-100 rounded-lg ring-1 ring-slate-200">
                                    {x.payments.map(y => (
                                        <li key={y.eventPersonId} className="flex items-center justify-between gap-4 px-4 py-3">
                                            <div>
                                                <div className="font-medium text-slate-900">
                                                    {y.eventName}
                                                </div>
                                                <div className="text-sm text-slate-500 tabular-nums">
                                                    {y.paidDate && displayDateTime(y.paidDate)}
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3">
                                                {y.manualPayment ? <span className="badge badge-gray">Pagament manual</span> : null}<span className="font-semibold text-slate-900 tabular-nums">{y.amount}&euro;</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </PageMain>
    </>
}

export default function PersonPaymentsPage() {
    return (
        <Container>
            <PersonPayments />
        </Container>
    )
};