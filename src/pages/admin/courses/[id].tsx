import { SuccessAlert } from "@/components/Alerts";
import { Course, Group } from "@/lib/apis/payments/models";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container } from "@/components/layout/SideBar";
import Head from "next/head";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { getCourseById, updateCourse } from "@/lib/apis/payments/client";
import GroupFields from "@/components/groups/GroupFields";
import CourseFields from "@/components/courses/CourseFields";
import { plainErrors, toInputDateTime } from "@/lib/utils";

const Update = () => {
    const router = useRouter()
    const { id } = router.query

    const [showUpdated, setShowUpdated] = useState(false);
    const { data: course, errors: courseErrors, isLoading: isGroupLoading, executeRequest: getCourseRequest } = useApiRequest(getCourseById);
    const { errors: updateErrors, isLoading: isUpdateLoading, executeRequest: updateCourseRequest } = useApiRequest(updateCourse);

    useEffect(() => {
        if (!id) return;
        getCourseRequest(parseInt(id as string))
    }, [id]);

    const onFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const start = formData.get("startDate") as string;
        const end = formData.get("endDate") as string;
        const c: Course = {
            id: parseInt(id as string),
            name: formData.get("name") as string,
            startDate: start ? new Date(start).toJSON() : new Date().toJSON(),
            endDate: end ? new Date(end).toJSON() : new Date().toJSON(),
            active: false,
        };

        const ok = await updateCourseRequest(c);

        if (ok) {
            setShowUpdated(true);
            setTimeout(() => setShowUpdated(false), 1500);
        }
    }

    const formDisabled = () => isUpdateLoading || isGroupLoading;

    return (
        <>
            <Head>
                <title>Editar curs - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                {!course ? courseErrors ? <div className="mt-5 ml-5">{plainErrors(courseErrors)}</div> : null :
                    <div className="max-w-lg m-auto">
                        <div className="m-5">
                            {showUpdated ? <SuccessAlert text="Curs actualitzt correctament" /> : null}
                            <form className="mt-5" action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">
                                <CourseFields
                                    errors={updateErrors}
                                    course={course} />

                                <div>
                                    <input
                                        disabled={formDisabled()}
                                        className="w-full mt-6 bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                                        value="Guardar canvis"
                                        type="submit" />
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </main>
        </>
    )
}

export default function UpdateCoursePage() {
    return (
        <Container>
            <Update />
        </Container>
    )
};