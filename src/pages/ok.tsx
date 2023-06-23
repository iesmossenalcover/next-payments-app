import Head from "next/head";
import { Noto_Sans } from '@next/font/google';
import { SuccessAlert } from "@/components/Alerts";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetOrderInfo, getOrderInfo, GetOrderInfoEvent } from "@/lib/apis/payments";

const font = Noto_Sans({ weight: '400', subsets: ['devanagari'] })

const Ok = () => {
    const router = useRouter()
    const signatureVersion = router.query["Ds_SignatureVersion"] as string;
    const merchantParameters = router.query["Ds_MerchantParameters"] as string;
    const signature = router.query["Ds_Signature"] as string;
    const [loading, setLoading] = useState(true);
    const [orderInfo, setOrderInfo] = useState<GetOrderInfo | undefined>(undefined)

    useEffect(() => {
        if (signature && merchantParameters && signatureVersion) {
            getOrderInfo(merchantParameters, signature, signatureVersion)
                .then(x => {
                    if (x.errors) {

                    }
                    else {
                        setOrderInfo(x.data)
                    }
                })
                .finally(() => setLoading(false))
        }
    }, [signatureVersion, merchantParameters, signature])


    if (loading || orderInfo == null) return null;

    const enrollmentInfo = () => orderInfo.displayEnrollment && orderInfo.enrollmentSubjectsInfo ?
        (
            <div className="mt-10">
                <h3 className="font-bold mb-2">Assignatures a les que s&apos;ha matriculat:</h3>
                <hr />
                <ul>
                    {orderInfo.enrollmentSubjectsInfo.split("\n").map((x, idx) => (
                        <li key={idx} className="mt-3">{x}</li>
                    ))}
                </ul>
            </div>
        ) : null;

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
            <div className="text-md over flex flex-nowrap items-center justify-between">
                <span>{x.name}</span>
                <span className="min-w-[6em] text-right font-bold">{x.price} {x.currency}</span>
            </div>
        )
    }

    const orderEvents = () => {
        return (
            <>
                {orderInfo?.events.map(x =>
                    <li key={x.code} className="mt-3 rounded-lg border border-gray-400 px-3 py-2">
                        {event(x)}
                    </li>
                )}
            </>
        )
    }

    const orderSummary = () => {
        return (
            <div className="mt-10">
                <div className="flex justify-between">
                    <h3 className="text-xl font-bold">Resum del pagament</h3>
                    <button onClick={() => window.print()} className="flex text-blue-700 font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                        </svg>
                        <span className="ml-3">Guardar</span>
                    </button>
                </div>
                <ul className="text-md rounded-lg">
                    {orderEvents()}
                </ul>

                <hr className="border-1 my-6 border-gray-400" />
                <div className="flex justify-end">
                    <div className="flex justify-end text-xl">
                        <h3 className="mr-8">Total</h3>
                        <h3 className="font-bold">{total()}</h3>
                    </div>
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
        <main className={`${font.className} container mx-auto px-5 mt-10  max-w-xl`}>
            <SuccessAlert text="Pagament realitzat correctament" />
            <hr />
            <ul>
                {orderSummary()}
                {enrollmentInfo()}
            </ul>
        </main>
    </>)
}

export default Ok;