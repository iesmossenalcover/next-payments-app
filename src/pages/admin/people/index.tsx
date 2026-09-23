import Head from "next/head";
import { useEffect, useState } from "react";
import { Table } from "@/components/table";
import { Container } from "@/components/layout/SideBar";
import { PageHeader, PageMain } from "@/components/layout/PageHeader";
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
      if (item.group === "-") return <span className="text-slate-300">—</span>;
      return (
        <span className="badge badge-brand">
          {item.group}
        </span>
      );
    },
    amipa: (item: TableRow) => {
      if (item.amipa === "-") return <span className="text-slate-300">—</span>;
      const isYes = item.amipa === "Si";
      return (
        <span
          className={`badge ${isYes ? "badge-green" : "badge-gray"}`}
        >
          {item.amipa}
        </span>
      );
    },
    actions: (item: TableRow) => {
      return (
        <div className="flex justify-end gap-1">
          <Link
            title="Pagaments de la persona"
            className="btn-icon"
            href={`/admin/people/${item.id}/payments`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
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
            className="btn-icon"
            href={`/admin/people/${item.id}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
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
            className="btn-icon btn-icon-danger"
            onClick={() => onDeletePerson(item)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
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
            className="sr-only"
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
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
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
              className="form-input py-3 pl-11"
              type="text"
              id="filter"
              value={filter}
              onChange={onFilterChange}
            />
          </div>
        </div>

        {showHint && (
          <EmptyState
            title="Cerca una persona"
            text="Escriu almenys 2 caràcters per començar a cercar."
          />
        )}

        {isLoading && filter.length >= 2 && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        {showEmpty && (
          <EmptyState
            title="Sense resultats"
            text="No s'ha trobat cap persona amb aquest criteri."
          />
        )}

        {!showHint && !isLoading && (people?.length ?? 0) > 0 && (
          <div className="card overflow-x-auto">
            <Table
              headers={tableHeaders}
              items={mapToRow()}
              renderers={customRenderer}
              tableClass="data-table"
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
      <PageMain>
        <PageHeader
          title="Persones"
          subtitle="Gestiona l'alumnat i el seu grup"
          actions={<>
            <ExportPeople />
            <Link
              className="btn btn-secondary"
              href="/admin/tasks/upload"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Carregar persones
            </Link>
            <Link
              className="btn btn-primary"
              href="/admin/people/create"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              Afegir persona
            </Link>
          </>} />
        {errors ? displayErrors(errors) : listPeople()}
      </PageMain>
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
      <div className="flex items-center text-sm text-red-600">
        {plainErrors(errors)}
      </div>
    );
  if (data)
    return (
      <div className="badge badge-green py-1.5 text-sm">
        Executat Correctament
      </div>
    );

  return (
    <button
      disabled={isLoading}
      className="btn btn-secondary"
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

const EmptyState = ({ title, text }: { title: string; text: string }) => (
  <div className="card flex flex-col items-center px-6 py-14 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    </div>
    <p className="mt-4 font-semibold text-slate-900">{title}</p>
    <p className="mt-1 text-sm text-slate-500">{text}</p>
  </div>
);
