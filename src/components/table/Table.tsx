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
}

function TableHeader<T extends BaseTableItem>({ headers, headerClass, headerCellClass, visibleFields }: TableHeaderProps<T>) {
    return (
        <thead className={headerClass}>
            <tr>

                {visibleFields.map(key => (
                    <th key={key as string} className={headerCellClass}>{headers[key as keyof T]}</th>
                ))}
            </tr>
        </thead>
    );
}

interface TableRowProps<T extends BaseTableItem> {
    item: T;
    renderers?: Renderers<T>;
    visibleFields: (keyof T)[];
    rowClass: string;
    cellClass: string;
};

function TableRow<T extends BaseTableItem>({ item, renderers, rowClass, cellClass, visibleFields }: TableRowProps<T>) {

    return (
        <tr className={rowClass}>
            {visibleFields.map((key, idx) => {
                const customRenderer = renderers?.[key];
                const value = item[key];

                if (customRenderer) {
                    return <td key={idx} className={cellClass} >{customRenderer(item)}</td>;
                }

                const val = isPrimitive(value) ? value : "";

                return (
                    <td key={idx} className={cellClass}>{val}</td>
                );
            })}
        </tr>
    );
}

interface TableBodyProps<T extends BaseTableItem> {
    items: T[];
    renderers?: Renderers<T>;
    visibleFields: (keyof T)[];
    bodyClass: string,
    rowClass: string,
    cellClass: string,
};

function TableBody<T extends BaseTableItem>({ items, renderers, bodyClass, rowClass, cellClass, visibleFields }: TableBodyProps<T>) {

    return (
        <tbody className={bodyClass}>
            {items.map(x => (
                <TableRow key={x.id} item={x} renderers={renderers} cellClass={cellClass} rowClass={rowClass} visibleFields={visibleFields} />
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
    visibleFields = Object.keys(headers) as (keyof T)[]
}: TableProps<T>) {

    return (
        <table className={tableClass}>
            <TableHeader headers={headers} headerClass={headerClass} headerCellClass={headerCellClass} visibleFields={visibleFields} />
            <TableBody items={items} renderers={renderers} bodyClass={bodyClass} cellClass={cellClass} rowClass={rowClass}  visibleFields={visibleFields} />
        </table>
    );

}


function objectKeys<T extends {}>(obj: T) {
    return Object.keys(obj).map((objKey) => objKey as keyof T);
}

function isPrimitive(value: any): value is PrimitiveType {
    return (
        typeof value === "string" ||
        typeof value === "number"
    );
}