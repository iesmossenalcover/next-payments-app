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
            <label className="relative inline-flex cursor-pointer items-center">
                <input
                    id={id}
                    name={name}
                    type="checkbox"
                    className="peer sr-only"
                    checked={value}
                    onChange={onToggled ? e => onToggled(e.currentTarget.checked) : undefined} />

                <div className="
                        relative
                        h-6
                        w-11
                        min-w-[44px]
                        rounded-full
                        bg-slate-200
                        transition-colors
                        peer-checked:bg-brand-600
                        peer-focus-visible:ring-2
                        peer-focus-visible:ring-brand-500
                        peer-focus-visible:ring-offset-2
                        after:absolute
                        after:left-[2px]
                        after:top-[2px]
                        after:h-5
                        after:w-5
                        after:rounded-full
                        after:bg-white
                        after:shadow
                        after:transition-transform
                        after:content-['']
                        peer-checked:after:translate-x-5">
                </div>

                <span className="ml-3 text-sm font-medium">{text}</span>
            </label>
        </div>
    )
}

export default Toggle;
