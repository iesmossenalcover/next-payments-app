import { useState } from "react";

export interface SelectorOption {
    key: string,
    value: string | number
}

export interface Selector {
    options: SelectorOption[],
    selected: string | number,
}

export interface SelectorProps {
    id: string,
    name: string,
    selector: Selector,
    onSelect: (val: string) => void,
    className?: string
}

const defaultClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

export const SelectorComponent = ({ id, name, selector, onSelect, className = defaultClass }: SelectorProps) => {
    const { selected, options } = selector;

    const onSelected = (e: React.FormEvent<HTMLSelectElement>) => {
        onSelect(e.currentTarget.value);
    }

    return (
        <select
            id={id}
            name={name}
            value={selected}
            onChange={onSelected}
            className={className}>
            {selected === "" ? <option key={""} value={""}>-</option> : null}
            {options.map(x => <option key={x.key} value={x.key}>{x.value}</option>)}
        </select>
    );
}