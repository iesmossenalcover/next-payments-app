import { memo, useMemo } from "react";
import { SortState } from "./useTableView";

type PrimitiveType = string | number;

interface BaseTableItem {
    id: string | number;
}

type TableHeaders<T extends BaseTableItem> = Record<keyof T, string>;
type Renderers<T extends BaseTableItem> = Partial<Record<keyof T, (it: T) => React.ReactNode>>;

interface TableHeaderProps<T extends BaseTableItem> {
    headers: TableHeaders<T>;
    visibleFields: (keyof T)[];
    headerClass: string;
    headerCellClass: string;
    sortableFields?: (keyof T)[];
    sort?: SortState<T>;
    onSort?: (key: keyof T) => void;
}

function TableHeader<T extends BaseTableItem>({ headers, headerClass, headerCellClass, visibleFields, sortableFields, sort, onSort }: TableHeaderProps<T>) {
    return (
        <thead className={headerClass}>
            <tr>

                {visibleFields.map(key => {
                    const label = headers[key as keyof T];

                    if (!onSort || !sortableFields?.includes(key)) {
                        return <th key={key as string} className={headerCellClass}>{label}</th>;
                    }

                    const dir = sort?.key === key ? sort.dir : undefined;

                    return (
                        <th
                            key={key as string}
                            className={`${headerCellClass} ${dir ? "is-sorted" : ""}`}
                            aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none"}>
                            <button type="button" className="sort-button" onClick={() => onSort(key)}>
                                {label}
                                <SortIcon dir={dir} />
                            </button>
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}

const SortIcon = ({ dir }: { dir?: "asc" | "desc" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
        className={`h-3.5 w-3.5 ${dir ? "text-brand-600" : "text-slate-300"}`}>
        {dir === "asc" && <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />}
        {dir === "desc" && <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />}
        {!dir && <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />}
    </svg>
);

interface TableRowProps<T extends BaseTableItem> {
    item: T;
    renderers?: Renderers<T>;
    visibleFields: (keyof T)[];
    rowClass: string;
    cellClass: string;
    sortedField?: keyof T;
};

function TableRowComponent<T extends BaseTableItem>({ item, renderers, rowClass, cellClass, visibleFields, sortedField }: TableRowProps<T>) {

    return (
        <tr className={rowClass}>
            {visibleFields.map((key, idx) => {
                const customRenderer = renderers?.[key];
                const value = item[key];
                const className = key === sortedField ? `${cellClass} is-sorted` : cellClass;

                if (customRenderer) {
                    return <td key={idx} className={className} >{customRenderer(item)}</td>;
                }

                const val = isPrimitive(value) ? value : "";

                return (
                    <td key={idx} className={className}>{val}</td>
                );
            })}
        </tr>
    );
}

// Només es tornen a pintar les files que canvien. Perquè funcioni, item, renderers
// i visibleFields han de ser estables entre renders (constants de mòdul o useMemo).
const TableRow = memo(TableRowComponent) as typeof TableRowComponent;

interface TableBodyProps<T extends BaseTableItem> {
    items: T[];
    renderers?: Renderers<T>;
    visibleFields: (keyof T)[];
    bodyClass: string,
    rowClass: string,
    cellClass: string,
    sortedField?: keyof T,
};

function TableBody<T extends BaseTableItem>({ items, renderers, bodyClass, rowClass, cellClass, visibleFields, sortedField }: TableBodyProps<T>) {

    return (
        <tbody className={bodyClass}>
            {items.map(x => (
                <TableRow key={x.id} item={x} renderers={renderers} cellClass={cellClass} rowClass={rowClass} visibleFields={visibleFields} sortedField={sortedField} />
            ))}
        </tbody>
    );
}

interface TableProps<T extends BaseTableItem> {
    headers: TableHeaders<T>;
    items: T[];
    renderers?: Renderers<T>;
    bodyClass?: string;
    tableClass?: string;
    tableHeaderClass?: string;
    rowClass?: string;
    cellClass?: string;
    headerClass?: string;
    headerCellClass?: string;
    visibleFields?: (keyof T)[];
    // Ordenació controlada: la pàgina guarda l'estat (useSort) i ordena els items (useTableView).
    sortableFields?: (keyof T)[];
    sort?: SortState<T>;
    onSort?: (key: keyof T) => void;
};

export function Table<T extends BaseTableItem>({
    headers,
    items,
    renderers,
    tableClass = "",
    bodyClass = "",
    rowClass = "",
    cellClass = "",
    headerClass = "",
    headerCellClass = "",
    visibleFields,
    sortableFields,
    sort,
    onSort,
}: TableProps<T>) {
    const fields = useMemo(
        () => visibleFields ?? Object.keys(headers) as (keyof T)[],
        [visibleFields, headers]);

    return (
        <table className={tableClass}>
            <TableHeader headers={headers} headerClass={headerClass} headerCellClass={headerCellClass} visibleFields={fields}
                sortableFields={sortableFields} sort={sort} onSort={onSort} />
            <TableBody items={items} renderers={renderers} bodyClass={bodyClass} cellClass={cellClass} rowClass={rowClass} visibleFields={fields}
                sortedField={sort?.key} />
        </table>
    );

}


function isPrimitive(value: any): value is PrimitiveType {
    return (
        typeof value === "string" ||
        typeof value === "number"
    );
}
