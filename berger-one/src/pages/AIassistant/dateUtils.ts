export const formatDateToIST = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const get = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value ?? '';

    return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`;
};
