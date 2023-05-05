import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getCoursesSelector, getPeopleView, PersonRow } from '@/lib/apis/payments'
import { Selector, SelectorComponent } from '@/components/Selector'
import { Spinner } from '@/components/Loading'
import { Table } from '@/components/table'
import { Container } from '@/components/layout/SideBar'
import Link from 'next/link'
import { deletePerson } from '@/lib/apis/payments/client'

const tableHeaders = {
    id: "Id",
    documentId: "Identitat",
    firstName: "Nom",
    lastName: "Llinatges",
    academicRecordNumber: "Número expedient",
    group: "Grup",
    amipa: "Amipa",
    actions: "Accions",
};

interface TableRow {
    id: number,
    documentId: string,
    firstName: string,
    lastName: string,
    academicRecordNumber: string,
    group: string,
    amipa: string,
    actions: "",
};

const People = () => {

    const [loadingCourses, setLoadingCourses] = useState(true)
    const [loadingPeople, setLoadingPeople] = useState(false)
    const [selector, setSelector] = useState<Selector | undefined>(undefined)
    const [people, setPeople] = useState<PersonRow[]>([])
    const [currentCourseId, setCurrentCourseId] = useState<number | undefined>()

    const onCourseSelected = (value: string) => {
        setLoadingPeople(true);
        setCurrentCourseId(parseInt(value))
    }

    const mapToRow = (): TableRow[] => {
        return people.map(x => {
            const academicRecordNumber = x.academicRecordNumber ? x.academicRecordNumber.toString() : "-";
            return { id: x.id, documentId: x.documentId, firstName: x.firstName, lastName: x.lastName, academicRecordNumber: academicRecordNumber, group: x.groupName, amipa: x.amipa ? "Si" : "No", actions: "" };
        });
    }

    const loadPeople = () => {
        setLoadingPeople(true);
        getPeopleView(currentCourseId)
            .then(x => setPeople(x))
            .finally(() => setLoadingPeople(false));
    }

    useEffect(() => {
        getCoursesSelector()
            .then(x => setSelector(x))
            .finally(() => setLoadingCourses(false))
    }, []);

    useEffect(() => {
        loadPeople();
    }, [currentCourseId]);

    const onDeletePerson = async (item: TableRow) => {
        const del = confirm(`Eliminar persona ${item.firstName} ${item.lastName} - ${item.documentId}?`);
        if (del) {
            const response = await deletePerson(item.id);
            if (response.errors) {
                alert("No s'ha pogut eliminar.")
            }
            else {
                loadPeople();
            }
        }
    }

    const customRenderer = {
        actions: (item: TableRow) => {
            return (
                <div className='flex'>
                    <Link
                        title="Editar"
                        className='font-medium text-blue-600 hover:underline' href={`/admin/people/${item.id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </Link>

                    <button
                        title="Eliminar"
                        className='font-medium text-red-600 hover:underline ml-5'
                        onClick={() => onDeletePerson(item)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            );
        },
    }

    if (loadingCourses) {
        return null
    }

    const listPeople = () => {
        if (loadingPeople) return null;

        return (
            <div className='overflow-y-auto overflow-x-auto'>
                <Table
                    headers={tableHeaders}
                    items={mapToRow()}
                    renderers={customRenderer}
                    tableClass='w-full table-auto overflow-scroll h-full'
                    headerClass='border-b'
                    headerCellClass='text-sm font-medium text-gray-900 px-6 py-4 text-left'
                    cellClass='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'
                    rowClass='border-b'
                />
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Administració - IES MOSSÈN ALCOVER</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='mt-5 mx-10'>
                <div className='flex justify-between mb-4'>
                    <div className='flex justify-start items-center'>
                        <SelectorComponent
                            id='course'
                            name='course'
                            onSelect={onCourseSelected}
                            selector={selector as Selector} />

                        {loadingPeople ? <Spinner /> : null}
                    </div>
                    <div>
                        <Link className='
                                inline-block
                                text-white 
                                bg-blue-700 
                                hover:bg-blue-800 
                                focus:ring-4 
                                focus:ring-blue-300
                                font-medium
                                py-3
                                px-3
                                rounded-lg
                                text-sm
                                mr-5' href="/admin/people/create">Afegir persona</Link>
                        <Link className='
                                inline-block
                                text-white 
                                bg-blue-700 
                                hover:bg-blue-800 
                                focus:ring-4 
                                focus:ring-blue-300
                                font-medium
                                py-3
                                px-3
                                rounded-lg
                                text-sm' href="/admin/tasks/upload">Carregar persones</Link>
                    </div>
                </div>

                {listPeople()}
            </main>
        </>
    )
}

export default function PeoplePage() {
    return (
        <Container>
            <People />
        </Container>
    )
};