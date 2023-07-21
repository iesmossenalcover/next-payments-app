import { ChangeEvent, useState } from "react";

interface DateTimeProps {
    id: string,
    name: string,
    className?: string,
    placeholder?: string,
    initialValue: string,
    type: "datetime-local" | "date"
    required: boolean,
    onDateChanged: (date: Date | undefined) => void,
}

const DateTime = ({ onDateChanged, placeholder, initialValue, className, name, id, type, required }: DateTimeProps) => {

    const [value, setValue] = useState(initialValue);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setValue(inputValue);
        try {
            const date = new Date(inputValue);
            onDateChanged(date);
        } catch {
            onDateChanged(undefined);
        }
    }


    return <input
        required={required}
        className={className}
        placeholder={placeholder}
        name={name}
        id={id}
        type={type}
        value={value}
        onChange={handleInputChange} />
}

export default DateTime;