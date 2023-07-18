import { SuccessAlert } from "@/components/Alerts";
import { Course } from "@/lib/apis/payments/models";
import Head from "next/head";
import { Container } from "@/components/layout/SideBar";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import CourseFields from "@/components/courses/CourseFields";
import { createCourse } from "@/lib/apis/payments";

const defaultCourse: Course = {
    id: 0,
    name: "",
    startDate: "",
    endDate: "",
    active: false,
};

const Create = () => {
    const { data, errors, isLoading, executeRequest } = useApiRequest(createCourse);

    const submit = async (c: Course) => {
        const ok = await executeRequest(c);
    }

    const onFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const start = formData.get("startDate") as string;
        const end = formData.get("endDate") as string;
        const c: Course = {
            id: 0,
            name: formData.get("name") as string,
            startDate: start ? new Date(start).toJSON() : new Date().toJSON(),
            endDate: end ? new Date(end).toJSON() : new Date().toJSON(),
            active: false,
        };
        submit(c);
    }

    const formDisabled = () => isLoading;

    return (
        <>
            <Head>
                <title>Afegir curs - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className="max-w-lg m-auto">
                    <div className="m-5">
                        {
                            data ? <SuccessAlert text="Curs afegit correctament" /> :
                                <form action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">
                                    <CourseFields
                                        errors={errors}
                                        course={defaultCourse} />
                                    <div>
                                        <input
                                            disabled={formDisabled()}
                                            className="w-full mt-6 bg-green-700 hover:cursor-pointer hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                                            value="Afegir curs"
                                            type="submit" />
                                    </div>
                                </form>
                        }
                    </div>
                </div>
            </main>
        </>
    )
}

export default function CreateCoursePage() {
    return (
        <Container>
            <Create />
        </Container>
    )
};