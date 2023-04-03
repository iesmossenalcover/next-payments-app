export interface ToggleProps {
    onToggled?: (val: boolean) => void,
    value: boolean,
    text: string,
    id: string,
    name: string,
    className?: string
}

const Toggle = ({ id, name, text, onToggled, value, className }: ToggleProps) => {

    return (
        <div
            className={className}>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    id={id}
                    name={name}
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={value}
                    onChange={onToggled ? e => onToggled(e.currentTarget.checked) : undefined} />

                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 font-medium">{text}</span>
            </label>
        </div>
    )
}

export default Toggle;