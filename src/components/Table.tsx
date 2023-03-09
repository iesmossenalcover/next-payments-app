import { type } from 'os'
import { useState } from 'react'

export interface TableProps {
    headers: string[],
    rows: Row[],
    paging: boolean,
}

export interface RowProps {
    row: Row
}

export interface Row {
    key: number,
    values: string[]
}

interface HeaderProps {
    value: string
}

interface FieldProps {
    
    value: string
}

interface PagesProps {
    current: number,
    total: number
}

const Table = (props: TableProps) => {

    const { headers, rows, paging } = props;

    const [page, _setPage] = useState(0)
    const [itemspPerPage, _setItempsPerPage] = useState(rows.length)
    console.log(rows.length);
    const getVisibleRows = (): Row[] => {
        const skip = page * itemspPerPage;
        return rows.slice(skip, skip + itemspPerPage);
    }

    const pages = () => {
        if (!paging) return null;

        return (
            <div className="mt-3 flex justify-center">
                <Pages current={0} total={10} />
            </div>
        );
    }

    return (
        <>
            <table className="min-w-full">
                <thead className="border-b">
                    <tr>
                        {headers.map((x, idx) => <Header key={idx} value={x} />)}
                    </tr>
                </thead>
                <tbody>
                    {getVisibleRows().map(x => <Row key={x.key} row={x} />)}
                </tbody>
            </table>
            {pages()}
        </>
    )
}

export default Table;

const Header = ({ value }: HeaderProps) => {
    return (
        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            {value}
        </th>
    );
}

const Row = ({ row }: RowProps) => {
    return (
        <tr className="border-b">
            {row.values.map((x, idx) => <Field key={idx} value={x} />)}
        </tr>
    );
}

const Field = ({ value }: FieldProps) => {
    return (
        <td key={value} className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
            {value}
        </td>
    )
}

const Pages = ({ current, total }: PagesProps) => {

    return (
        <nav>
            <ul className="flex list-style-none">
                {[...Array(total)].map((_, idx) => {
                    return (
          
                        <li key={idx} className="page-item">
                            <a className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none" href="#" aria-label="Previous">
                                {idx}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}