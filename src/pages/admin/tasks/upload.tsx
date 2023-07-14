import { SuccessAlert } from "@/components/Alerts";
import { Container } from "@/components/layout/SideBar";
import { batchUpload, downloadTemplate } from "@/lib/apis/payments";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { plainErrors } from "@/lib/utils";

const BatchUpload = () => {
    const { data, errors, isLoading, executeRequest } = useApiRequest(batchUpload);

    const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        executeRequest(formData);
    }

    return (
        <main className="container m-auto mt-5 w-1/3">
            {data ?
                <div className="mt-4">
                    <SuccessAlert text="Càrrega realitzada correctament" />
                    <p>Grups creats: {data.groupsCreated}</p>
                    <p>Persones creades: {data.peopleCreated}</p>
                    <p>Persones actualitzades: {data.peopleUpdated}</p>
                </div> :
                <>
                    <DownloadTemplate />
                    <form id="upload" action="#" onSubmit={onSubmit}>
                        <div className="flex justify-center">
                            <div className="m-0 mb-3 w-full">
                                <label htmlFor="formFile" className="form-label inline-block mb-2 text-gray-700">Càrrega d&apos;usuaris</label>
                                <input
                                    name="file"
                                    className="
                                    form-control
                                    block
                                    w-full
                                    px-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding
                                    border border-solid border-gray-300
                                    rounded
                                    transition
                                    ease-in-out
                                    focus:text-gray-700
                                    focus:bg-white focus:border-blue-600 focus:outline-none"
                                    type="file" id="formFile" />
                            </div>
                        </div>

                        {errors ? <div className="mb-4">
                            {Array.from(errors.entries()).map((x, idx) => <p key={idx} className="text-red-500 italic">{x[0]}: {x[1]}</p>)}
                        </div> : null}

                        <div>
                            <button
                                form="upload"
                                disabled={isLoading}
                                type="submit"
                                className={`
                                    disabled:bg-slate-400 disabled:text-slate-800 disabled:shadow-none
                                    text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 flex w-full justify-center`}>
                                {
                                    isLoading ?
                                        <>
                                            <svg aria-hidden="true" role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"></path>
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
                                            </svg>
                                            <span>Processant...</span>
                                        </> :
                                        <span>Enviar</span>
                                }
                            </button>
                        </div>
                    </form>
                </>
            }
        </main>
    );

}

export default function BatchUploadPage() {
    return (
        <Container>
            <BatchUpload />
        </Container>
    )
};

const DownloadTemplate = () => {
    const { errors, isLoading, executeRequest } = useApiRequest(downloadTemplate);

    const submit = async () => {
        const ok = await executeRequest();
    }

    if (errors) return <div className=" mt-4 ml-4 text-red-500 italic">{plainErrors(errors)}</div>;

    return (
        <button
            disabled={isLoading}
            className='
                    mb-5
                    text-blue-700
                    underline
                    font-medium
                    rounded-lg'
            onClick={submit}>Descarregar plantilla
        </button>
    )
}