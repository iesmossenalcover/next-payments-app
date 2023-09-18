const dateDisplayOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
const dateTimeDisplayOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

const parseDateIfNeeded = (date: Date | string) => typeof date === "string" ? new Date(date) : date;

export const displayDate = (date: Date | string) => parseDateIfNeeded(date).toLocaleDateString([], dateDisplayOptions);
export const displayTime = (date: Date, includeSeconds: boolean = false) => parseDateIfNeeded(date).toLocaleTimeString([], { second: includeSeconds ? "2-digit" : undefined, ...dateTimeDisplayOptions });
export const displayDateTime = (date: Date, includeSeconds: boolean = false) => `${displayDate(date)} - ${displayTime(date, includeSeconds)}`;
export const twoDigit = (n: number) => n < 10 ? '0' + n : '' + n;
export const toInputDateTime = (d: Date): string => `${d.getFullYear()}-${twoDigit(d.getMonth() + 1)}-${twoDigit(d.getDate())}T${twoDigit(d.getHours())}:${twoDigit(d.getMinutes())}`;
export const toInputDate = (d: Date): string => `${d.getFullYear()}-${twoDigit(d.getMonth() + 1)}-${twoDigit(d.getDate())}`;

export const plainErrors = (errors?: Map<string, string[]>) => (
    errors ? Array.from(errors.entries()).map(x => `${x[1].join(", ")}`) : ""
)

export const displayErrors = (errors?: Map<string, string[]>) => (
    errors ?
        <ul>
            {Array.from(errors.entries()).map((x, idx) => <li key={idx} className="text-red-500 italic">{x[0]}: {x[1].join(", ")}</li>)}
        </ul> : null
)

export const displayKeyErrors = (key: string, errors?: Map<string, string[]>) => {
    if (!errors || !errors.has(key)) return null;
    const list = errors.get(key) as string[];
    return (
        <ul>
            {list.map((x, idx) => <li key={idx} className="text-red-500 italic">{x}</li>)}
        </ul>
    )
}