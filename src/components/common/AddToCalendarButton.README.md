# AddToCalendarButton Component

## Overview
A universal "Add to Calendar" button component that generates RFC 5545 compliant .ics files compatible with all major calendar applications.

## Compatibility
- ✅ Google Calendar
- ✅ Apple Calendar (macOS/iOS)
- ✅ Microsoft Outlook
- ✅ Yahoo Calendar
- ✅ Any calendar app that supports .ics files

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `eventTitle` | string | Yes | The title/name of the event |
| `location` | string | Yes | Physical location or address of the event |
| `startDate` | Date | Yes | JavaScript Date object for event start |
| `endDate` | Date | Yes | JavaScript Date object for event end |
| `description` | string | No | Additional details about the event |
| `theme` | string | No | 'christian' or 'hindu' for color theming (default: 'christian') |

## Usage Examples

### Basic Example
```jsx
import AddToCalendarButton from './components/common/AddToCalendarButton';

function MyEvent() {
  return (
    <AddToCalendarButton
      eventTitle="Rushel & Sivani - Wedding Ceremony"
      location="123 Main Street, City, Country"
      startDate={new Date('2026-07-04T14:00:00')}
      endDate={new Date('2026-07-04T16:00:00')}
      description="Join us for our special day!"
      theme="christian"
    />
  );
}
```

### With Translation Support
```jsx
import AddToCalendarButton from './components/common/AddToCalendarButton';
import { useTranslation } from 'react-i18next';

function MyEvent() {
  const { t } = useTranslation();
  
  return (
    <AddToCalendarButton
      eventTitle={t('event.title')}
      location={t('event.location')}
      startDate={new Date('2026-07-04T14:00:00')}
      endDate={new Date('2026-07-04T16:00:00')}
      description={t('event.description')}
      theme="hindu"
    />
  );
}
```

### Multiple Events
```jsx
const ceremonies = [
  {
    title: 'Christian Ceremony',
    location: 'Church Address',
    start: new Date('2026-07-04T14:00:00'),
    end: new Date('2026-07-04T16:00:00'),
    theme: 'christian'
  },
  {
    title: 'Hindu Ceremony',
    location: 'Temple Address',
    start: new Date('2026-07-05T10:00:00'),
    end: new Date('2026-07-05T14:00:00'),
    theme: 'hindu'
  }
];

function EventList() {
  return (
    <div className="space-y-4">
      {ceremonies.map((ceremony, idx) => (
        <div key={idx}>
          <h3>{ceremony.title}</h3>
          <AddToCalendarButton
            eventTitle={ceremony.title}
            location={ceremony.location}
            startDate={ceremony.start}
            endDate={ceremony.end}
            theme={ceremony.theme}
          />
        </div>
      ))}
    </div>
  );
}
```

## Date Format Requirements

Dates must be JavaScript Date objects. Use ISO 8601 format for consistency:

```javascript
// ✅ Correct
startDate={new Date('2026-07-04T14:00:00')}

// ✅ Also correct
startDate={new Date(2026, 6, 4, 14, 0, 0)} // Note: month is 0-indexed

// ❌ Incorrect (string, not Date object)
startDate="2026-07-04T14:00:00"
```

## Styling

The button automatically adapts its colors based on the `theme` prop:

- **Christian theme**: Golden brown/cream colors
- **Hindu theme**: Gold/vermillion colors

The button includes:
- Icon from Material Design Icons (calendar plus icon)
- Hover effect with shadow
- Responsive sizing
- Proper ARIA labels for accessibility

## Technical Implementation

### RFC 5545 Compliance
The component generates iCalendar files following the RFC 5545 standard:

- ✅ Proper VCALENDAR structure
- ✅ UTC timezone formatting
- ✅ Line folding (75 character limit)
- ✅ Special character escaping
- ✅ Unique event identifiers (UID)
- ✅ All required iCalendar fields

### Generated File
When clicked, the button generates and downloads a `.ics` file with a name based on the event title:
```
rushel-&-sivani-christian-ceremony.ics
```

### Browser Support
Works in all modern browsers that support:
- Blob API
- URL.createObjectURL
- Download attribute on `<a>` elements

## Accessibility

The component includes proper accessibility features:
- `aria-label` with translated text
- Semantic button element
- Keyboard navigable
- Screen reader friendly

## Internationalization

Button text is automatically translated based on the current language:
- English: "Add to Calendar"
- German: "Zum Kalender hinzufügen"
- Tamil: "நாட்காட்டியில் சேர்க்கவும்"

Translation key: `calendar.addToCalendar`

## Testing

To test the component:
1. Click the button to download the .ics file
2. Open the downloaded file in your calendar application
3. Verify all details (title, location, date/time, description) appear correctly
4. Test in multiple calendar apps
5. Test in different languages

## Troubleshooting

### File doesn't download
- Check browser console for errors
- Verify Date objects are valid
- Ensure popup blocker isn't blocking downloads

### Event details incorrect
- Verify Date objects use correct timezone
- Check for special characters that need escaping
- Ensure all required props are provided

### Button doesn't appear
- Check that Material Design Icons are installed
- Verify Tailwind CSS classes are available
- Check for console errors

## Dependencies

- `react`
- `react-i18next` (for translations)
- `@mdi/react` and `@mdi/js` (for calendar icon)
- Tailwind CSS (for styling)
