export function buildDateRange(now, timePeriod) {
    const endDate = new Date(now);
    const startDate = new Date(now);

    switch (timePeriod) {
        case 'monthly':
            startDate.setDate(startDate.getDate() - 30);
            break;
        case 'weekly':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case 'daily':
        default:
            startDate.setDate(startDate.getDate() - 1);
    }

    return `created:${formatDate(startDate)}..${formatDate(endDate)}`;
}

export function formatDate(date) {
    return date.toISOString().split('T')[0];
}
