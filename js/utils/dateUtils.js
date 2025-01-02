export function buildDateRange(now, timePeriod) {
    if (!(now instanceof Date) || isNaN(now)) {
        throw new Error('Invalid date provided');
    }

    // Ensure we're working with UTC dates for consistency
    const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const startDate = new Date(endDate);

    switch (timePeriod) {
        case 'monthly':
            startDate.setUTCDate(startDate.getUTCDate() - 30);
            break;
        case 'weekly':
            startDate.setUTCDate(startDate.getUTCDate() - 7);
            break;
        case 'daily':
            startDate.setUTCDate(startDate.getUTCDate() - 1);
            break;
        default:
            throw new Error('Invalid time period provided');
    }

    // GitHub's API uses ISO 8601 format for dates
    // Adding a small buffer to the end date to account for timezone differences
    endDate.setUTCHours(23, 59, 59, 999);

    return `created:${formatDate(startDate)}..${formatDate(endDate)}`;
}

export function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        throw new Error('Invalid date provided');
    }
    return date.toISOString().split('T')[0];
}

export function isValidDateRange(startDate, endDate) {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        return false;
    }
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return false;
    }
    return startDate <= endDate;
}

export function parseDate(dateString) {
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) {
        throw new Error('Invalid date string provided');
    }
    return parsed;
}
