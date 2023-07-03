import { Container } from "@/components/layout/SideBar";
import { Table } from "@/components/table";
import { getCourses, setActiveCourse } from "@/lib/apis/payments";
import Head from "next/head";
import Link from "next/link";
import { useApiRequest, useStartApiRequest } from "@/lib/hooks/useApiRequest";
import { displayDate, plainErrors } from "@/lib/utils";

const tableHeaders = {
    id: "Id",
    name: "Nom",
    startDate: "Inici",
    endDate: "Fi",
    active: "Actiu",
    activeText: "Actiu",
    actions: "Accions"
};

interface TableRow {
    id: number,
    name: string,
    startDate: string,
    endDate: string,
    active: boolean,
    activeText: string,
    actions: string,
};

const Courses = () => {

    const { data: courses, executeRequest: getCoursesRequest } = useStartApiRequest(getCourses);
    const { errors: setActiveErrors, executeRequest: setActiveRequest } = useApiRequest(setActiveCourse);

    const mapToRow = (): TableRow[] => {
        if (!courses) return [];

        return courses.map(x => {
            return {
                id: x.id,
                name: x.name,
                active: x.active,
                activeText: x.active ? "Sí" : "No",
                startDate: displayDate(x.startDate),
                endDate: displayDate(x.endDate),
                actions: ""
            };
        });
    }

    const onActiveCourse = async (id: number) => {
        const ok = await setActiveRequest(id);
        if (ok) await getCoursesRequest();
    }

    const customRenderer = {
        actions: (item: TableRow) => {

            const renderSetActive = () => {
                if (item.active) return null;


                return (
                    <button className='font-medium text-blue-600 hover:underline ml-5' title="Activar curs" onClick={() => onActiveCourse(item.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                        </svg>
                    </button>
                );
            }

            return (
                <div className="flex justify-center">
                    <Link title="Editar" className='font-medium text-blue-600 hover:underline ml-5' href={`/admin/courses/${item.id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </Link>

                    {renderSetActive()}

                </div>
            );
        },
    }



    const listGroups = () => {
        return (
            <div className='overflow-x-auto'>
                {setActiveErrors ? <div className="mt-2 text-red-500 italic">{plainErrors(setActiveErrors)}</div> : null}
                <Table
                    headers={tableHeaders}
                    items={mapToRow()}
                    renderers={customRenderer}
                    tableClass='w-full table-auto overflow-scroll'
                    headerClass='border-b'
                    headerCellClass='text-sm font-medium text-gray-900 px-6 py-4 text-left text-center'
                    cellClass='px-6 py-4 whitespace-nowrap text-center'
                    rowClass='border-b hover:bg-blue-100'
                    visibleFields={[
                        "name",
                        "startDate",
                        "endDate",
                        "activeText",
                        "actions"
                    ]}
                />
            </div>
        )
    }

    return (

        <>
            <Head>
                <title>Esdeveniments - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="mt-5 mx-10">

                <div className='flex justify-between mb-4'>
                    <div>
                        <Link className='
                            inline-block
                            text-white 
                            bg-green-700 
                            hover:bg-green-800
                            focus:ring-4 
                            focus:ring-blue-300
                            font-medium
                            py-3
                            px-3
                            rounded-lg
                            text-sm
                            mr-5'
                            href="/admin/groups/create">Nou curs</Link>
                    </div>
                </div>

                {listGroups()}
            </main>
        </>
    );
}

export default function GroupsPage() {
    return (
        <Container>
            <Courses />
        </Container>
    )
};