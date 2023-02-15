import { useState } from "react";

export interface SelectorOption {
    key: string,
    value: string
}

export interface Selector {
    options: SelectorOption[],
    selected: string,
}

export interface SelectorProps {
    selector: Selector,
    onSelect: (val: string) => void,
}

export const SelectorComponent = ({ selector, onSelect }: SelectorProps) => {
    const { selected, options } = selector;
    const [value, setValue] = useState(selected)

    const onSelected = (e: React.FormEvent<HTMLSelectElement>) => {
        setValue(e.currentTarget.value);
        onSelect(e.currentTarget.value);
    }

    return (
        <div className="grow max-w-xs">
            <select 
                value={value}
                onChange={onSelected}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {options.map(x => <option key={x.key} value={x.key}>{x.value}</option>)}
            </select>
        </div>
    );
}