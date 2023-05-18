const dateDisplayOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
const dateTimeDisplayOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

const parseDateIfNeeded = (date: Date | string) => typeof date === "string" ? new Date(date) : date;

export const displayDate = (date: Date | string) => parseDateIfNeeded(date).toLocaleDateString([], dateDisplayOptions);
export const displayTime = (date: Date) => parseDateIfNeeded(date).toLocaleTimeString([], dateTimeDisplayOptions);
export const displayDateTime = (date: Date) => `${displayDate(date)} - ${displayTime(date)}`;
export const twoDigit = (n: number) => n < 10 ? '0' + n : '' + n;
export const toInputDate = (d: Date): string => `${d.getFullYear()}-${twoDigit(d.getMonth() + 1)}-${twoDigit(d.getDate())}T${twoDigit(d.getHours())}:${twoDigit(d.getMinutes())}`;