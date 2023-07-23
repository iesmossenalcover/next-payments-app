import Head from 'next/head'
import { Noto_Sans } from '@next/font/google';
import { useEffect, useRef, useState } from 'react';
import { createOrder, getPersonActiveEvents, PersonActiveEvent, PersonActiveEventsVm } from '@/lib/apis/payments';
import { CreateOrderResponse, SelectEvent } from '@/lib/apis/payments/models';
import { displayDate } from '@/lib/utils';
import { SelectorComponent } from '@/components/Selector';

const font = Noto_Sans({ weight: '400', subsets: ['devanagari'] })

const Home = () => {

    const [step, setStep] = useState(1)
    const [viewModel, setViewModel] = useState<PersonActiveEventsVm | undefined>(undefined);

    const onEventsLoaded = (data: PersonActiveEventsVm) => {
        setStep(2);
        setViewModel(data);
    }

    return (
        <>
            <Head>
                <title>{`Pagaments - ${process.env.SCHOOL_NAME}`}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={`${font.className} container mx-auto px-1 mt-10  max-w-2xl`}>
                {step === 1 ? <FirstStep onLoaded={onEventsLoaded} /> : null}
                {step === 2 && viewModel ? <SecondStep data={viewModel} /> : null}
            </main>
        </>
    )
}

export default Home


interface FirstStepProps {
    onLoaded: (data: PersonActiveEventsVm) => void,
}

const FirstStep = ({ onLoaded }: FirstStepProps) => {

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Map<string, string[]>>()

    const onFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const documentId = formData.get("documentId") as string;
        const response = await getPersonActiveEvents(documentId);
        if (response.errors) {
            setErrors(response.errors)
            setLoading(false);
        } else if (response.data) {
            onLoaded(response.data);
        }
    }

    const displayErrors = (key: string) => {
        if (!errors || !errors.has(key)) return null;

        const list = errors.get(key) as string[];
        return (
            <>
                {list.map((x, idx) => <p key={idx} className="mt-3 text-red-500 italic">{x}</p>)}
            </>
        )
    }

    return (
        <form className='max-w-md mx-auto' action="#" onSubmit={onFormSubmit}>
            <div>
                <label
                    className="
                        block
                        uppercase
                        tracking-wide
                        text-gray-700
                        text-md
                        font-bold
                        mb-2"
                    htmlFor="documentId">Document d&apos;identitat alumne</label>
                <input
                    required={true}
                    className="
                        px-4
                        w-full
                        text-lg
                        text-gray-700
                        border-2
                        border-gray-600
                        rounded
                        py-3
                        leading-tight
                        focus:outline-none
                        focus:bg-white"
                    id="documentId" name="documentId" defaultValue={""} onChange={() => setErrors(undefined)} />
                {displayErrors("")}
            </div>

            <div>
                <input
                    disabled={loading}
                    className="w-full mt-6
                    bg-blue-500
                    hover:cursor-pointer
                    hover:bg-blue-700
                    text-white
                    text-lg
                    py-2
                    px-4
                    rounded
                    focus:outline-none
                    focus:shadow-outline
                    disabled:bg-slate-50
                    disabled:text-slate-500
                    disabled:border-slate-200
                    disabled:shadow-none
                    disabled:hover:cursor-not-allowed"
                    value="Continua"
                    type="submit" />
            </div>
        </form>
    )
}

interface SecondStepProps {
    data: PersonActiveEventsVm
}

const SecondStep = ({ data }: SecondStepProps) => {
    const { events, person } = data;
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<SelectEvent[]>(events.map(x => ({ code: x.code, quantity: 0, selected: false, price: x.price })));
    const [errors, setErrors] = useState<Map<string, string[]>>();
    const [paymentForm, setPaymentForm] = useState<CreateOrderResponse | undefined>(undefined);
    const [displayEnrollment, setDisplayEnrollment] = useState(false)
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (paymentForm && formRef.current) {
            formRef.current.submit();
        }
    }, [paymentForm]);

    const toogleEvent = (idx: number, check: boolean, quantity: number) => {
        selected[idx].selected = check;
        selected[idx].quantity = quantity;
        setSelected([...selected]);
    }

    const getSelectedEvents = () => selected.filter((_, idx) => selected[idx].selected);

    const handlePayClick = async () => {
        setLoading(true);
        const selectedEvents = getSelectedEvents();
        const response = await createOrder(person.documentId, selectedEvents.map(x => x.code));
        if (response.errors) {
            setErrors(response.errors)
        } else {
            setPaymentForm(response.data);
        }
    }

    const renderAndSubmitPaymentForm = () => {
        if (!paymentForm) return null;

        return (
            <form id='forma' method='post' action={paymentForm.url} ref={formRef}>
                <input type="hidden" name="Ds_SignatureVersion" defaultValue={paymentForm.signatureVersion} />
                <input type="hidden" name="Ds_MerchantParameters" defaultValue={paymentForm.merchantParameters} />
                <input type="hidden" name="Ds_Signature" defaultValue={paymentForm.signature} />
            </form>
        )
    }

    const displayErrors = (key: string) => {
        if (!errors || !errors.has(key)) return null;

        const list = errors.get(key) as string[];
        return (
            <>
                {list.map((x, idx) => <p key={idx} className="mt-3 text-red-500 italic">{x}</p>)}
            </>
        )
    }

    const displayPayButton = () => {
        return (
            <>
                <div className='mt-5'>{displayErrors("eventCodes")}</div>
                <div className='mt-5'>
                    <button disabled={loading}
                        onClick={handlePayClick}
                        type="button"
                        className="w-full
                            text-white
                            bg-blue-700
                            hover:bg-blue-800
                            focus:ring-4
                            focus:outline-none
                            focus:ring-blue-300
                            rounded
                            text-lg
                            px-5
                            py-2.5
                            text-center
                            font-medium">
                        {loading ? <>
                            <svg aria-hidden="true" role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"></path>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
                            </svg>
                            Carregant...
                        </> : <>Pagar</>}
                    </button>
                </div>
            </>
        )
    }

    const displayTotal = () => {
        const selectedEvents = getSelectedEvents();

        if (selectedEvents.length === 0) {
            return null
        }

        let total = selectedEvents.reduce((part, x) => part + x.price * Math.max(x.quantity, 1), 0);

        return (
            <>
                <hr className="h-px my-8 bg-gray-200 border-2" />
                <div className='mt-5 flex justify-between text-xl'>
                    <h3>Total</h3>
                    <h3 className='font-bold'>{total} {events[0].currencySymbol}</h3>
                </div>
                {displayPayButton()}
            </>
        )
    }

    const displayEvents = () => {
        if (!events || events.length == 0) {
            return <h2
                className='text-md font-bold'
            >No hi ha esdeveniments actius pendents de pagar.</h2>
        }

        return (
            <>
                <span
                    className="
                        block
                        uppercase
                        tracking-wide
                        text-gray-700
                        text-md
                        font-bold
                        mb-10">Selecciona els esdeveniments a pagar</span>
                <ul>
                    {events.map((x, idx) =>
                        <li key={x.code} className="w-full mb-5 py-4 px-2 md:text-lg border-solid border-[1px] border-slate-300">
                            <Event
                                event={x}
                                idx={idx}
                                selectedEvents={selected}
                                toogleEvent={toogleEvent} />
                        </li>
                    )}
                </ul>
            </>
        )
    }

    const enrollmentButton = !person.enrolled || !person.enrollmentSubjectsInfo ? null :
        (
            <>
                <button
                    className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-2 py-1 text-center'
                    onClick={() => setDisplayEnrollment(!displayEnrollment)}
                >{displayEnrollment ? "Amaga matrícula" : "Mostra matrícula"}</button>
            </>
        );

    const renderEnrollment = () => {
        if (!person.enrolled) return null;

        return (
            <>
                {person.groupDescription ? <h3 className='pb-4 font-semibold'>Curs: {person.groupDescription}</h3> : null}
                {
                    person.enrollmentSubjectsInfo ? <>
                        <h3 className='underline'>Assignatures a les que s&apos;ha matriculat:</h3>
                        <ul className='pl-5 list-disc'>
                            {person.enrollmentSubjectsInfo.trim().split("\n").map((x, idx) => (
                                <li key={idx} className="mt-3">{x}</li>
                            ))}
                        </ul>
                    </> : null
                }
            </>
        )
    }

    return (
        <>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='
                    text-lg
                    tracking-wide
                    font-bold
                    text-gray-500
                    text-md'>{person.fullName}</h3>
                {enrollmentButton}
            </div>
            <hr className="h-px mb-5 border-2 bg-gray-700" />
            {displayEnrollment ?
                <>{renderEnrollment()}</> :
                <>
                    {displayEvents()}
                    {displayTotal()}
                    {renderAndSubmitPaymentForm()}
                </>
            }

        </>
    )
}

interface EventProps {
    idx: number,
    event: PersonActiveEvent,
    selectedEvents: SelectEvent[],
    toogleEvent: (idx: number, check: boolean, quantity: number) => void,
}

const Event = ({ idx, event, selectedEvents, toogleEvent }: EventProps) => {
    const onSelectEvent = (checked: boolean) => {
        toogleEvent(idx, checked, selectedEvents[idx].quantity);
    }

    const renderEventQuantity = () => {
        const options = Array.from(Array(event.maxQuantity), (_, x) => ({ key: x.toString(), value: x }));

        const onSelectQuantity = (q: string) => {
            const quantity = parseInt(q);
            toogleEvent(idx, quantity > 0, quantity);
        }

        const onSelectEventWithQuantity = (checked: boolean) => {
            if (checked) {
                toogleEvent(idx, true, Math.max(selectedEvents[idx].quantity, 1));
            }
            else {
                toogleEvent(idx, false, 0);
            }
        }

        return (
            <div className=''>
                <div className="w-full flex justify-between items-center ">
                    <div className="flex items-center ">
                        <input id={`event_${event.code}`}
                            aria-describedby="helper-checkbox-text"
                            type="checkbox"
                            disabled={!event.selectable}
                            className="w-5 h-5
                                text-blue-600
                                bg-gray-100
                                border-gray-300
                                rounded
                                focus:ring-2"
                            checked={selectedEvents[idx].selected}
                            onChange={(e) => onSelectEventWithQuantity(e.target.checked)}
                        />
                        <div>
                            <label htmlFor={`event_${event.code}`} className="ml-2 select-none text-gray-900">
                                {event.name}
                                <span className='hidden md:inline-block'>&nbsp;- {displayDate(event.date)}</span>
                            </label>
                            <div className='ml-2 text-sm text-slate-700 italic'>Preu unitat: {event.price} {event.currencySymbol}</div>
                        </div>
                    </div>
                    <SelectorComponent
                        id={`"quantity_"${event.code}`}
                        name={`"quantity_"${event.code}`}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 py-1 px-2.5"
                        selector={{ selected: selectedEvents[idx].quantity.toString(), options }}
                        onSelect={onSelectQuantity} />
                        <div className='hidden md:inline-block'>{event.price * selectedEvents[idx].quantity} {event.currencySymbol}</div>
                </div>
            </div>
        )
    }

    const renderEvent = () => {
        return (
            <div className='flex items-center '>
                <input id={`event_${event.code}`}
                    aria-describedby="helper-checkbox-text"
                    type="checkbox"
                    disabled={!event.selectable}
                    className=" w-5 h-5
                                text-blue-600
                                bg-gray-100
                                border-gray-300
                                rounded
                                focus:ring-2"
                    checked={selectedEvents[idx].selected}
                    onChange={(e) => onSelectEvent(e.target.checked)}
                />
                <div className="ml-2 w-full flex justify-between">
                    <div>
                        <label htmlFor={`event_${event.code}`}
                            className="select-none font-medium text-gray-900">{`${event.name} - ${displayDate(event.date)}`}</label>
                    </div>
                    <div>{event.price} {event.currencySymbol}</div>
                </div>
            </div>
        )
    }

    return <>
        {event.displayQuantitySelector ? renderEventQuantity() : renderEvent()}
    </>;
}