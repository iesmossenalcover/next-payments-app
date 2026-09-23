import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getOrderInfo, GetOrderInfoEvent } from "@/lib/apis/payments";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { PublicLayout } from "@/components/layout/PublicLayout";

const Ok = () => {
    const router = useRouter()
    const signatureVersion = router.query["Ds_SignatureVersion"] as string;
    const merchantParameters = router.query["Ds_MerchantParameters"] as string;
    const signature = router.query["Ds_Signature"] as string;
    const { data: orderInfo, isLoading, executeRequest } = useApiRequest(getOrderInfo);

    useEffect(() => {
        if (signature && merchantParameters && signatureVersion) {
            executeRequest(merchantParameters, signature, signatureVersion);
        }
    }, [signatureVersion, merchantParameters, signature])


    if (isLoading || orderInfo == null) return null;

    const enrollmentInfo = () => {

        if (!orderInfo.displayEnrollment) return null;

        return <div className="border-t border-slate-200 p-6 sm:px-8">
            {orderInfo.groupDescription ?
                <p className='mb-4'>
                    <span className="text-sm text-slate-500">Curs</span>
                    <span className="block font-semibold text-slate-900">{orderInfo.groupDescription}</span>
                </p> : null}
            {orderInfo.enrollmentSubjectsInfo ?
                <>
                    <h3 className='text-sm font-semibold uppercase tracking-wider text-slate-500'>Assignatures a les que s&apos;ha matriculat</h3>
                    <ul className='mt-3 divide-y divide-slate-100 rounded-lg ring-1 ring-slate-200'>
                        {orderInfo.enrollmentSubjectsInfo.trim().split("\n").map((x, idx) => (
                            <li key={idx} className="px-4 py-2.5 text-slate-700">{x}</li>
                        ))}
                    </ul>
                </> : null
            }
        </div>
    };

    const total = () => {
        if (orderInfo.events.length === 0) return null;

        return (
            <>
                {orderInfo.events.reduce((prev, x) => prev + x.price, 0)} {orderInfo.events[0].currency}
            </>
        )
    }
    const event = (x: GetOrderInfoEvent) => {
        return (
            <div className="flex flex-nowrap items-center justify-between gap-4">
                <span className="text-slate-700">
                    {x.name} {x.quantity > 1 && <span className="badge badge-gray ml-1">x{x.quantity}</span>}
                </span>
                <span className="min-w-[6em] text-right font-semibold text-slate-900 tabular-nums">{x.price} {x.currency}</span>
            </div>
        )
    }

    const orderEvents = () => {
        return (
            <>
                {orderInfo?.events.map(x =>
                    <li key={x.code} className="py-3">
                        {event(x)}
                    </li>
                )}
            </>
        )
    }

    const orderSummary = () => {
        return (
            <div className="p-6 sm:px-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Resum del pagament</h3>
                    <button onClick={() => window.print()} className="btn btn-secondary btn-sm print:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                        </svg>
                        Guardar
                    </button>
                </div>
                <div className="mt-4 flex justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
                    <span className="font-medium text-slate-900">{orderInfo.personName}</span>
                    <span className="text-slate-500">{orderInfo.personDocumentId}</span>
                </div>
                <ul className="mt-2 divide-y divide-slate-100">
                    {orderEvents()}
                </ul>

                <div className="mt-2 flex items-baseline justify-between border-t border-slate-200 pt-4">
                    <span className="text-slate-600">Total</span>
                    <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{total()}</span>
                </div>
            </div>
        )
    }

    return (<>
        <Head>
            <title>Pagaments - {process.env.SCHOOL_NAME}</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <PublicLayout>
            <div className="card animate-fade-in overflow-hidden">
                <div className="border-b border-slate-200 px-6 py-8 text-center sm:px-8" role="alert">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-8 w-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Pagament realitzat correctament</h1>
                    <p className="mt-1 text-slate-500">{process.env.SCHOOL_NAME}</p>
                </div>
                {orderSummary()}
                {enrollmentInfo()}
            </div>
        </PublicLayout>
    </>)
}

export default Ok;
