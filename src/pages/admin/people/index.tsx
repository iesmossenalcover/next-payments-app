import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Table } from '@/components/table'
import { Container } from '@/components/layout/SideBar'
import Link from 'next/link'
import { deletePerson, exportPeople, filterPeopleQuery } from '@/lib/apis/payments/client'
import useDebounce from '@/lib/hooks/useDebounce'
import { Spinner } from '@/components/Loading'
import { useApiRequest } from '@/lib/hooks/useApiRequest'
import { displayErrors, plainErrors } from '@/lib/utils'

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
    actions: string,
};

const People = () => {
    const [filter, setFilter] = useState("");
    const { data: people, errors, isLoading, executeRequest } = useApiRequest(filterPeopleQuery);
    const debouncedSearchTerm = useDebounce<string>(filter, 300);

    const mapToRow = (): TableRow[] => {
        if (!people) return [];

        return people
            .map(x => {
                const academicRecordNumber = x.academicRecordNumber ? x.academicRecordNumber.toString() : "-";
                const group = x.groupName ? x.groupName : "-";
                const amipa = x.amipa === undefined ? "-" : x.amipa ? "Si" : "No";
                return { id: x.id, documentId: x.documentId, firstName: x.firstName, lastName: x.lastName, academicRecordNumber: academicRecordNumber, group, amipa, actions: "" };
            });
    }

    const updatePeople = () => {
        const normalizedFilter = filter.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

        if (normalizedFilter.length >= 2) {
            executeRequest(normalizedFilter);
        }
    }


    useEffect(() => {
        updatePeople();
    }, [debouncedSearchTerm]);

    const onFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
        setFilter(e.currentTarget.value);
    }

    const onDeletePerson = async (item: TableRow) => {
        const del = confirm(`Eliminar persona ${item.firstName} ${item.lastName} - ${item.documentId}?`);
        if (del) {
            const response = await deletePerson(item.id);
            if (response.errors) {
                alert("No s'ha pogut eliminar.")
            }
            else {
                updatePeople();
            }
        }
    }

    const customRenderer = {
        actions: (item: TableRow) => {
            return (
                <div className='flex justify-center'>
                    <Link
                        title="Pagaments de la persona"
                        className='font-medium text-blue-600 hover:underline ml-5' href={`/admin/people/${item.id}/payments`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </Link>

                    <Link
                        title="Editar"
                        className='font-medium text-blue-600 hover:underline  ml-5' href={`/admin/people/${item.id}`}>
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

    const listPeople = () => {
        return (
            <>
                <div className="mb-6 max-w-3xl">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="filter">Cerca persones</label>

                    <input
                        autoComplete="off"
                        className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                        type="text"
                        id="filter" value={filter} onChange={onFilterChange} />
                </div>
                {isLoading && filter.length >= 2 ? <Spinner /> :
                    <div className='overflow-y-auto overflow-x-auto'>
                        <Table
                            headers={tableHeaders}
                            items={mapToRow()}
                            renderers={customRenderer}
                            tableClass='w-full table-auto overflow-scroll h-full'
                            headerCellClass='text-sm font-medium text-gray-900 px-6 py-4 text-left text-center'
                            cellClass='px-6 py-4 whitespace-nowrap text-center'
                            rowClass='border-b hover:bg-blue-100'
                            visibleFields={[
                                "documentId",
                                "firstName",
                                "lastName",
                                "academicRecordNumber",
                                "group",
                                "amipa",
                                "actions",
                            ]}
                        />
                    </div>
                }
            </>
        )
    }

    return (
        <>
            <Head>
                <title>Persones - {process.env.SCHOOL_NAME}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='mt-5 mx-1 md:mx-4 lg:mx-6'>
                <div className='flex mb-4'>
                    <ExportPeople />
                    <Link className='
                        text-white 
                        bg-green-700 
                        hover:bg-green-800 
                        focus:ring-4 
                        focus:ring-green-300
                        font-medium
                        py-3
                        px-3
                        rounded-lg
                        text-sm
                        mr-5' href="/admin/people/create">Afegir persona</Link>
                    <Link className='
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
                {errors ? displayErrors(errors) : listPeople()}
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

const ExportPeople = () => {
    const { data, errors, isLoading, executeRequest } = useApiRequest(exportPeople);

    const submit = async () => {
        const ok = await executeRequest();

    }

    if (errors) return <div className=" mt-4 ml-4 text-red-500 italic">{plainErrors(errors)}</div>;
    if (data) return <div className=" mt-4 ml-4 text-green-700 italic">Executat Correctament</div>;

    return (
        <button
            disabled={isLoading}
            className='
                    mr-5
                    text-white 
                    bg-yellow-600 
                    hover:bg-yellow-700 
                    focus:ring-4 
                    focus:ring-yellow-300
                    font-medium
                    py-3
                    px-3
                    rounded-lg
                    text-sm'
            onClick={submit}>Exportar persones
        </button>
    )
}