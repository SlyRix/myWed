import React from 'react';
import { useTranslation } from 'react-i18next';
import { mdiCalendarPlus } from '@mdi/js';
import Icon from '@mdi/react';

/**
 * Universal "Add to Calendar" button component that generates RFC 5545 compliant .ics files
 * Works with all calendar applications (Google Calendar, Apple Calendar, Outlook, etc.)
 *
 * @param {string} eventTitle - Title of the event
 * @param {string} location - Location of the event
 * @param {Date} startDate - Start date and time of the event
 * @param {Date} endDate - End date and time of the event
 * @param {string} description - Description of the event
 * @param {string} theme - Theme color ('christian', 'hindu', or 'reception')
 */
const AddToCalendarButton = ({
    eventTitle,
    location,
    startDate,
    endDate,
    description = '',
    theme = 'christian'
}) => {
    const { t } = useTranslation();

    /**
     * Format date to iCalendar format (YYYYMMDDTHHMMSSZ)
     * Following RFC 5545 standard
     */
    const formatICalDate = (date) => {
        if (!date || !(date instanceof Date)) {
            return '';
        }

        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    };

    /**
     * Generate a unique identifier for the event
     * Format: timestamp-random@wedding.rushel.me
     */
    const generateUID = () => {
        const timestamp = new Date().getTime();
        const random = Math.random().toString(36).substring(2, 9);
        return `${timestamp}-${random}@wedding.rushel.me`;
    };

    /**
     * Escape special characters for iCalendar format
     * Per RFC 5545: escape commas, semicolons, backslashes, and newlines
     */
    const escapeICalText = (text) => {
        if (!text) return '';
        return text
            .replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/\n/g, '\\n');
    };

    /**
     * Fold long lines to 75 characters per RFC 5545
     * Lines longer than 75 octets should be folded
     */
    const foldLine = (line) => {
        if (line.length <= 75) return line;

        const lines = [];
        let currentLine = line.substring(0, 75);
        let remaining = line.substring(75);

        lines.push(currentLine);

        while (remaining.length > 0) {
            currentLine = ' ' + remaining.substring(0, 74); // Space at start for continuation
            remaining = remaining.substring(74);
            lines.push(currentLine);
        }

        return lines.join('\r\n');
    };

    /**
     * Generate RFC 5545 compliant .ics file content
     * Standard format that works with all calendar applications
     */
    const generateICSContent = () => {
        const start = formatICalDate(startDate);
        const end = formatICalDate(endDate || new Date(startDate.getTime() + 2 * 60 * 60 * 1000));
        const now = formatICalDate(new Date());
        const uid = generateUID();

        // Build iCalendar content following RFC 5545
        const lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Rushel & Sivani Wedding//Wedding Website//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${now}`,
            `DTSTART:${start}`,
            `DTEND:${end}`,
            foldLine(`SUMMARY:${escapeICalText(eventTitle)}`),
            foldLine(`DESCRIPTION:${escapeICalText(description)}`),
            foldLine(`LOCATION:${escapeICalText(location)}`),
            'STATUS:CONFIRMED',
            'SEQUENCE:0',
            'TRANSP:OPAQUE',
            'END:VEVENT',
            'END:VCALENDAR'
        ];

        return lines.join('\r\n');
    };

    /**
     * Download the .ics file
     * Creates a Blob and triggers download
     */
    const handleDownload = () => {
        try {
            const icsContent = generateICSContent();
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            // Create temporary download link
            const link = document.createElement('a');
            link.href = url;
            link.download = `${eventTitle.replace(/\s+/g, '-').toLowerCase()}.ics`;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating calendar file:', error);
        }
    };

    // Determine button colors based on theme
    const getThemeClasses = () => {
        switch (theme) {
            case 'hindu':
                return 'bg-hindu-secondary hover:bg-hindu-accent text-white';
            case 'reception':
                return 'bg-christian-accent hover:shadow-lg text-white';
            case 'christian':
            default:
                return 'bg-christian-accent hover:bg-christian-primary text-white';
        }
    };

    const themeClasses = getThemeClasses();

    return (
        <button
            onClick={handleDownload}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md ${themeClasses}`}
            aria-label={t('calendar.addToCalendar')}
        >
            <Icon path={mdiCalendarPlus} size={0.8} />
            <span className="text-sm">{t('calendar.addToCalendar')}</span>
        </button>
    );
};

export default AddToCalendarButton;
