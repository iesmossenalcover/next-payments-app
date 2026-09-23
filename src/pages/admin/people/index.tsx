import Head from "next/head";
import { useEffect, useState } from "react";
import { Table } from "@/components/table";
import { Container } from "@/components/layout/SideBar";
import Link from "next/link";
import {
  deletePerson,
  exportPeople,
  filterPeopleQuery,
} from "@/lib/apis/payments/client";
import useDebounce from "@/lib/hooks/useDebounce";
import { Spinner } from "@/components/Loading";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { displayErrors, plainErrors } from "@/lib/utils";

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
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  academicRecordNumber: string;
  group: string;
  amipa: string;
  actions: string;
}

const People = () => {
  const [filter, setFilter] = useState("");
  const {
    data: people,
    errors,
    isLoading,
    executeRequest,
  } = useApiRequest(filterPeopleQuery);
  const debouncedSearchTerm = useDebounce<string>(filter, 300);

  const mapToRow = (): TableRow[] => {
    if (!people) return [];

    return people.map((x) => {
      const academicRecordNumber = x.academicRecordNumber
        ? x.academicRecordNumber.toString()
        : "-";
      const group = x.groupName ? x.groupName : "-";
      const amipa = x.amipa === undefined ? "-" : x.amipa ? "Si" : "No";
      return {
        id: x.id,
        documentId: x.documentId,
        firstName: x.firstName,
        lastName: x.lastName,
        academicRecordNumber: academicRecordNumber,
        group,
        amipa,
        actions: "",
      };
    });
  };

  const updatePeople = () => {
    // const normalizedFilter = filter.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const normalizedFilter = filter
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (normalizedFilter.length >= 2) {
      executeRequest(normalizedFilter);
    }
  };

  useEffect(() => {
    updatePeople();
  }, [debouncedSearchTerm]);

  const onFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFilter(e.currentTarget.value);
  };

  const onDeletePerson = async (item: TableRow) => {
    const del = confirm(
      `Eliminar persona ${item.firstName} ${item.lastName} - ${item.documentId}?`,
    );
    if (del) {
      const response = await deletePerson(item.id);
      if (response.errors) {
        alert("No s'ha pogut eliminar.");
      } else {
        updatePeople();
      }
    }
  };

  const customRenderer = {
    group: (item: TableRow) => {
      if (item.group === "-") return <span className="text-gray-400">-</span>;
      return (
        <span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1">
          {item.group}
        </span>
      );
    },
    amipa: (item: TableRow) => {
      if (item.amipa === "-") return <span className="text-gray-400">-</span>;
      const isYes = item.amipa === "Si";
      return (
        <span
          className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-1 ${
            isYes ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {item.amipa}
        </span>
      );
    },
    actions: (item: TableRow) => {
      return (
        <div className="flex justify-center">
          <Link
            title="Pagaments de la persona"
            className="font-medium text-blue-600 hover:underline ml-5"
            href={`/admin/people/${item.id}/payments`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </Link>

          <Link
            title="Editar"
            className="font-medium text-blue-600 hover:underline  ml-5"
            href={`/admin/people/${item.id}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </Link>

          <button
            title="Eliminar"
            className="font-medium text-red-600 hover:underline ml-5"
            onClick={() => onDeletePerson(item)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      );
    },
  };

  const listPeople = () => {
    const showHint = filter.length < 2;
    const showEmpty = !showHint && !isLoading && (people?.length ?? 0) === 0;

    return (
      <>
        <div className="mb-6 max-w-md">
          <label
            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
            htmlFor="filter"
          >
            Cerca persones
          </label>

          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              autoComplete="off"
              placeholder="Nom, llinatges o identitat..."
              className="pl-10 pr-4 appearance-none block w-full bg-white text-gray-700 border rounded-lg py-2.5 leading-tight shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
              type="text"
              id="filter"
              value={filter}
              onChange={onFilterChange}
            />
          </div>
        </div>

        {showHint && (
          <p className="text-gray-400 italic">
            Escriu almenys 2 caràcters per començar a cercar.
          </p>
        )}

        {isLoading && filter.length >= 2 && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        {showEmpty && (
          <p className="text-gray-400 italic">
            No s&apos;ha trobat cap persona amb aquest criteri.
          </p>
        )}

        {!showHint && !isLoading && (people?.length ?? 0) > 0 && (
          <div className="bg-white border rounded-lg shadow-sm overflow-y-auto overflow-x-auto">
            <Table
              headers={tableHeaders}
              items={mapToRow()}
              renderers={customRenderer}
              tableClass="w-full table-auto overflow-scroll h-full"
              headerClass="bg-gray-50 border-b"
              headerCellClass="text-sm font-medium text-gray-900 px-6 py-4 text-left text-center"
              cellClass="px-6 py-4 whitespace-nowrap text-center"
              rowClass="border-b last:border-b-0 hover:bg-green-50/60 transition-colors"
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
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Persones - {process.env.SCHOOL_NAME}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-4 md:mx-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Persones</h1>
            <p className="text-gray-500">Gestiona l&apos;alumnat i el seu grup</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ExportPeople />
            <Link
              className="inline-flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium py-2.5 px-4 rounded-lg text-sm"
              href="/admin/tasks/upload"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Carregar persones
            </Link>
            <Link
              className="inline-flex items-center gap-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium py-2.5 px-4 rounded-lg text-sm"
              href="/admin/people/create"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              Afegir persona
            </Link>
          </div>
        </div>
        {errors ? displayErrors(errors) : listPeople()}
      </main>
    </>
  );
};

export default function PeoplePage() {
  return (
    <Container>
      <People />
    </Container>
  );
}

const ExportPeople = () => {
  const { data, errors, isLoading, executeRequest } =
    useApiRequest(exportPeople);

  const submit = async () => {
    const ok = await executeRequest();
  };

  if (errors)
    return (
      <div className="flex items-center text-red-500 italic text-sm">
        {plainErrors(errors)}
      </div>
    );
  if (data)
    return (
      <div className="flex items-center text-green-700 italic text-sm">
        Executat Correctament
      </div>
    );

  return (
    <button
      disabled={isLoading}
      className="inline-flex items-center gap-2 text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:ring-yellow-300 font-medium py-2.5 px-4 rounded-lg text-sm disabled:bg-slate-400 disabled:hover:bg-slate-400"
      onClick={submit}
    >
      {isLoading ? (
        <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      )}
      Exportar persones
    </button>
  );
};
