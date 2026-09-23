import { SuccessAlert } from "@/components/Alerts";
import { Container } from "@/components/layout/SideBar";
import { batchUpload, downloadTemplate } from "@/lib/apis/payments";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { plainErrors } from "@/lib/utils";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/Loading";

const BatchUpload = () => {
    const { data, errors, isLoading, executeRequest } = useApiRequest(batchUpload);

    const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        executeRequest(formData);
    }

    return (
        <PageMain narrow>
            <PageHeader title="Carregar persones" subtitle="Importa alumnes i grups des d'un fitxer" back={{ href: "/admin/people", text: "Persones" }} />
            {data ?
                <div className="space-y-4">
                    <SuccessAlert text="Càrrega realitzada correctament" />
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="card p-5">
                            <p className="text-sm text-slate-500">Grups creats</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{data.groupsCreated}</p>
                        </div>
                        <div className="card p-5">
                            <p className="text-sm text-slate-500">Persones creades</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{data.peopleCreated}</p>
                        </div>
                        <div className="card p-5">
                            <p className="text-sm text-slate-500">Persones actualitzades</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{data.peopleUpdated}</p>
                        </div>
                    </div>
                </div> :
                <div className="card p-6 sm:p-8">
                    <form id="upload" action="#" onSubmit={onSubmit}>
                        <div className="mb-2 flex items-center justify-between">
                            <label htmlFor="formFile" className="form-label mb-0">Càrrega d&apos;usuaris</label>
                            <DownloadTemplate />
                        </div>
                        <input
                            name="file"
                            className="block w-full cursor-pointer rounded-lg text-sm text-slate-600 ring-1 ring-inset ring-slate-300 file:mr-4 file:cursor-pointer file:border-0 file:bg-brand-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            type="file" id="formFile" />

                        {errors ? <div className="mt-4">
                            {Array.from(errors.entries()).map((x, idx) => <p key={idx} className="form-error">{x[0]}: {x[1]}</p>)}
                        </div> : null}

                        <button
                            form="upload"
                            disabled={isLoading}
                            type="submit"
                            className="btn btn-primary mt-8 w-full">
                            {
                                isLoading ?
                                    <>
                                        <Spinner className="h-4 w-4 text-white" />
                                        <span>Processant...</span>
                                    </> :
                                    <span>Enviar</span>
                            }
                        </button>
                    </form>
                </div>
            }
        </PageMain>
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

    if (errors) return <span className="text-sm text-red-600">{plainErrors(errors)}</span>;

    return (
        <button
            disabled={isLoading}
            type="button"
            className='link inline-flex items-center gap-1 text-sm'
            onClick={submit}>Descarregar plantilla
        </button>
    )
}