import React from 'react';

const CalendarLink = ({ title, description, location, startDate, endDate }) => {
    // Format dates for calendar URLs
    const formatCalendarDate = (date) => {
        // Format date as YYYYMMDDTHHMMSSZ in UTC timezone for calendar links
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    // Generate Google Calendar URL
    const generateGoogleCalendarUrl = () => {
        const start = formatCalendarDate(startDate);
        const end = endDate ? formatCalendarDate(endDate) : formatCalendarDate(new Date(startDate.getTime() + 2 * 60 * 60 * 1000)); // Default 2 hours

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: title,
            details: description || '',
            location: location || '',
            dates: `${start}/${end}`
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    // Generate iCal format URL (for Apple Calendar, Outlook, etc.)
    const generateIcsUrl = () => {
        const start = formatCalendarDate(startDate);
        const end = endDate ? formatCalendarDate(endDate) : formatCalendarDate(new Date(startDate.getTime() + 2 * 60 * 60 * 1000));

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description || ''}`,
            `LOCATION:${location || ''}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        return URL.createObjectURL(blob);
    };

    return (
        <div className="flex flex-col md:flex-row gap-2">
            <a
                href={generateGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
                <span className="mr-1 text-christian-accent">📅</span>
                <span>Google Calendar</span>
            </a>

            <a
                href={generateIcsUrl()}
                download={`${title.replace(/\s+/g, '-')}.ics`}
                className="inline-flex items-center text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
                <span className="mr-1 text-christian-accent">📅</span>
                <span>Apple/Outlook (.ics)</span>
            </a>
        </div>
    );
};

export default CalendarLink;