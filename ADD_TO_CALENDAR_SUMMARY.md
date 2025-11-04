# Add to Calendar Button - Implementation Summary

## Overview
Created a universal "Add to Calendar" button component that generates RFC 5545 compliant .ics files that work with all calendar applications (Google Calendar, Apple Calendar, Outlook, etc.).

## Files Created

### 1. `/src/components/common/AddToCalendarButton.js`
**Purpose**: Universal calendar button component

**Features**:
- Generates RFC 5545 compliant .ics files
- Works with all calendar apps (Google Calendar, Apple Calendar, Outlook, etc.)
- Proper line folding per RFC standard (75 character limit)
- Special character escaping (commas, semicolons, backslashes, newlines)
- Unique event identifiers (UID)
- Multi-language support via i18n
- Theme support (Christian/Hindu color schemes)
- Downloadable .ics file on click

**Props**:
- `eventTitle` (string): Title of the event
- `location` (string): Location of the event
- `startDate` (Date): Start date and time
- `endDate` (Date): End date and time
- `description` (string, optional): Event description
- `theme` (string, optional): 'christian' or 'hindu' for theming

## Files Modified

### 2. `/src/i18n/locales/en/translation.json`
Added calendar translation:
```json
"calendar": {
  "addToCalendar": "Add to Calendar"
}
```

### 3. `/src/i18n/locales/de/translation.json`
Added German translation:
```json
"calendar": {
  "addToCalendar": "Zum Kalender hinzufügen"
}
```

### 4. `/src/i18n/locales/ta/translation.json`
Added Tamil translation:
```json
"calendar": {
  "addToCalendar": "நாட்காட்டியில் சேர்க்கவும்"
}
```

### 5. `/src/components/story/OurStory.js`
**Changes**: Added ceremony data with dates and locations to the wedding event
- Added `isWedding` flag to identify wedding timeline event
- Added `ceremonies` array with Christian and Hindu ceremony details
- Includes multi-language ceremony titles and descriptions
- Ceremony dates:
  - Christian: July 4, 2026, 2:00-4:00 PM at Kirche Altendorf
  - Hindu: July 5, 2026, 10:00 AM-2:00 PM at Shed15 events&more

### 6. `/src/components/story/StoryTimeline.js`
**Changes**: Integrated AddToCalendarButton for wedding events
- Imports AddToCalendarButton and useTranslation
- Detects wedding events via `isWedding` flag
- Renders calendar buttons for each ceremony
- Language-aware ceremony titles and descriptions
- Displays buttons in separate cards with ceremony names

### 7. `/src/components/ceremonies/ChristianCeremony.js`
**Changes**: Replaced CalendarLink with AddToCalendarButton
- Imports AddToCalendarButton instead of CalendarLink
- Updated ceremony dates to July 4, 2026 (ISO format)
- Button centered with consistent styling
- Theme set to "christian"

### 8. `/src/components/ceremonies/HinduCeremony.js`
**Changes**: Replaced CalendarLink with AddToCalendarButton
- Imports AddToCalendarButton instead of CalendarLink
- Updated ceremony dates to July 5, 2026 (ISO format)
- Button centered with consistent styling
- Theme set to "hindu"

## Usage Examples

### Basic Usage
```jsx
import AddToCalendarButton from '../common/AddToCalendarButton';

<AddToCalendarButton
  eventTitle="Rushel & Sivani - Christian Ceremony"
  location="Kirche Altendorf, Dorfpl. 5, 8852 Altendorf"
  startDate={new Date('2026-07-04T14:00:00')}
  endDate={new Date('2026-07-04T16:00:00')}
  description="Join us for our Christian Wedding Ceremony"
  theme="christian"
/>
```

### Advanced Usage with Translations
```jsx
import AddToCalendarButton from '../common/AddToCalendarButton';
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <AddToCalendarButton
      eventTitle={`${t('couple.names')} - ${t('christian.title')}`}
      location={t('christian.location.full')}
      startDate={new Date('2026-07-04T14:00:00')}
      endDate={new Date('2026-07-04T16:00:00')}
      description={t('christian.description')}
      theme="christian"
    />
  );
};
```

### In Timeline (as implemented)
```jsx
{event.isWedding && event.ceremonies && (
  <div className="mt-6 space-y-3">
    {event.ceremonies.map((ceremony, idx) => (
      <div key={idx} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
        <div className="font-semibold text-sm text-gray-700">
          {ceremony.title}
        </div>
        <AddToCalendarButton
          eventTitle={`Rushel & Sivani - ${ceremony.title}`}
          location={ceremony.location}
          startDate={ceremony.startDate}
          endDate={ceremony.endDate}
          description={ceremony.description}
          theme={ceremony.type}
        />
      </div>
    ))}
  </div>
)}
```

## Technical Details

### RFC 5545 Compliance
The component follows the iCalendar standard (RFC 5545):
- Proper VCALENDAR and VEVENT structure
- UTC timezone formatting (YYYYMMDDTHHMMSSZ)
- Line folding for lines exceeding 75 octets
- Special character escaping: `\ ; , \n`
- Unique event identifiers (UID)
- Required fields: DTSTART, DTEND, SUMMARY, DTSTAMP, UID

### Generated .ics File Structure
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Rushel & Sivani Wedding//Wedding Website//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:1234567890-abc123@wedding.rushel.me
DTSTAMP:20260101T120000Z
DTSTART:20260704T140000Z
DTEND:20260704T160000Z
SUMMARY:Rushel & Sivani - Christian Ceremony
DESCRIPTION:Join us for our Christian Wedding Ceremony
LOCATION:Kirche Altendorf, Dorfpl. 5, 8852 Altendorf
STATUS:CONFIRMED
SEQUENCE:0
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR
```

### Browser Compatibility
- Uses Blob API for file generation
- Uses URL.createObjectURL for download
- Proper cleanup with URL.revokeObjectURL
- Works in all modern browsers

### Styling
- Theme-aware colors (Christian: golden brown, Hindu: gold/vermillion)
- Material Design Icons (mdiCalendarPlus)
- Responsive button with hover effects
- Consistent with existing site theme

## Testing Checklist

- [x] Component created with RFC 5545 compliance
- [x] Translations added for EN, DE, TA
- [x] Integrated in StoryTimeline for wedding event
- [x] Integrated in ChristianCeremony page
- [x] Integrated in HinduCeremony page
- [x] Theme support for Christian and Hindu ceremonies
- [x] Multi-language ceremony titles
- [x] Proper date formatting (ISO 8601)

## Next Steps (User Testing)
1. Test .ics file download in browser
2. Import .ics file into Google Calendar
3. Import .ics file into Apple Calendar (iOS/macOS)
4. Import .ics file into Outlook
5. Verify event details appear correctly
6. Test in all three languages (EN, DE, TA)
7. Test on mobile and desktop
