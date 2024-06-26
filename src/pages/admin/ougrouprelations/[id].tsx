import { SuccessAlert } from "@/components/Alerts";
import { Container } from "@/components/layout/SideBar";
import OuGroupRelationsFields from "@/components/ougrouprelations/OuGroupRelationFields";
import { OuGroupRelation } from "@/lib/apis/payments";
import { getOuGroupRelationById, updateOuGroupRelation } from "@/lib/apis/payments/client";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { displayErrors } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Update = () => {
    const { data, isLoading, executeRequest } = useApiRequest(getOuGroupRelationById);
    const { errors: updateErrors, isLoading: updating, executeRequest: updateRequest } = useApiRequest(updateOuGroupRelation);
    const [showUpdated, setShowUpdated] = useState(false);
    const [ouGroupRelation, setOuGroupRelation] = useState<OuGroupRelation | undefined>(undefined);
    const router = useRouter()
    const { id } = router.query


    useEffect(() => {
        if (!id) return;
        executeRequest(parseInt(id as string))
    }, [id]);

    useEffect(() => {
        setOuGroupRelation(data?.ouGroupRelation);
        if (data && data.ouGroupRelation) {
        }

    }, [data]);

    const formDisabled = () => isLoading || updating;

    const onFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!ouGroupRelation) return;

        const ok = await updateRequest(ouGroupRelation);
        if (ok) {
            setShowUpdated(true);
            setTimeout(() => setShowUpdated(false), 1500);
        }
    }

    if (!ouGroupRelation || !data || !data.groups) return null;

    return (
        <>
            <Head>
                <title>Editar persona - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className="max-w-lg m-auto mt-10">
                    {showUpdated && <SuccessAlert text="Relació actualitzada correctament" />}
                    <form className="mt-5" action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">
                        <OuGroupRelationsFields
                            groupSelector={{ selected: ouGroupRelation.groupId, options: data.groups.options }}
                            ouGroupRelation={ouGroupRelation}
                            setOuGroupRelation={setOuGroupRelation}
                            errors={updateErrors}
                        />

                        <div>
                            <input
                                disabled={formDisabled()}
                                className="w-full mt-2 bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                                value="Actualitzar"
                                type="submit" />
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default function UpdateUoGroupRelationPage() {
    return (
        <Container>
            <Update />
        </Container>
    )
};