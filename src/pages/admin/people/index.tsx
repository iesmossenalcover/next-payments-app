import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getCoursesSelector, getPeopleView, PersonRow } from '@/lib/apis/payments'
import { Selector, SelectorComponent } from '@/components/Selector'
import { Spinner } from '@/components/Loading'
import { Table } from '@/components/table'
import { Container } from '@/components/layout/SideBar'
import Link from 'next/link'

const tableHeaders = {
    id: "Identitat",
    firstName: "Nom",
    lastName: "Llinatges",
    academicRecordNumber: "Número expedient",
    group: "Grup",
    actions: "Accions",
};

interface TableRow {
    id: string,
    firstName: string,
    lastName: string,
    academicRecordNumber: string,
    group: string,
    actions: "",
};

const customRenderer = {
    actions: (item: TableRow) => {
        return (
            <Link className='ont-medium text-blue-600 dark:text-blue-500 hover:underline' href={`/admin/people/${item.id}`}>Editar</Link>
        );
    },
}

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
            return { id: x.documentId, firstName: x.firstName, lastName: x.lastName, academicRecordNumber: academicRecordNumber, group: x.groupName, actions: "" };
        });
    }

    useEffect(() => {
        getCoursesSelector()
            .then(x => setSelector(x))
            .finally(() => setLoadingCourses(false))
    }, []);

    useEffect(() => {
        setLoadingPeople(true);
        getPeopleView(currentCourseId)
            .then(x => setPeople(x))
            .finally(() => setLoadingPeople(false));
    }, [currentCourseId]);

    if (loadingCourses) {
        return null
    }

    const listPeople = () => {
        if (loadingPeople) return null;

        return (
            <Table
                headers={tableHeaders}
                items={mapToRow()}
                renderers={customRenderer}
                tableClass='min-w-full'
                headerClass='border-b'
                headerCellClass='text-sm font-medium text-gray-900 px-6 py-4 text-left'
                cellClass='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'
                rowClass='border-b'
            />
        )
    }

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
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
            </Container>
        </>
    )
}


export default People