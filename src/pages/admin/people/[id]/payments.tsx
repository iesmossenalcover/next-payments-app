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

    console.log(data.coursePayments)

    return <>
        <Head>
            <title>Pagaments persona - {process.env.SCHOOL_NAME}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
            <div className="max-w-2xl m-auto mt-10">
                {!data && <h3>Persona no trobada</h3>}
                {data && !data.coursePayments.length && <h3>Aquesta persona no té esdeveniments pagats</h3>}
                {data && data.coursePayments.length &&
                    <>
                        <div className="flex justify-end">
                            <button onClick={() => window.print()} className="flex text-blue-700 font-bold mb-5 print:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                </svg>
                                <span className="ml-3">Imprimir</span>
                            </button>
                        </div>
                        <div>
                            <div className="mb-10">
                                <div className="text-center font-bold text-3xl mb-5">
                                    {process.env.SCHOOL_NAME}
                                </div>
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>{data.personName}</span>
                                    <span>{data.documentId}</span>
                                </div>
                            </div>
                        </div>
                        {data.coursePayments.map(x => (
                            <div key={x.courseId} className="mb-8">
                                <h2 className="mt-3 text-2xl font-bold">Curs: {x.courseName}</h2>
                                <hr className="border-2 mt-1 mb-4" />
                                <ul>
                                    {x.payments.map(y => (
                                        <li key={y.eventPersonId} className="mb-4">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <div className="text-md">
                                                        {y.eventName}
                                                    </div>
                                                    <div>
                                                        {y.paidDate && displayDateTime(y.paidDate)}
                                                    </div>
                                                </div>
                                                <div>
                                                    {y.manualPayment ? <span className="mr-4">(Pagament manual)</span> : null}<span className="font-bold">{y.amount}&euro;</span>
                                                </div>
                                            </div>
                                            <hr className="mt-1" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </>
                }
            </div>
        </main >
    </>
}

export default function PersonPaymentsPage() {
    return (
        <Container>
            <PersonPayments />
        </Container>
    )
};