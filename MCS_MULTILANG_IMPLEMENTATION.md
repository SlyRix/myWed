# Multi-Language CMS Implementation Guide

## Overview
This document provides instructions for implementing the multi-language content management system (MCS) integration with i18n across all pages of the wedding website.

## Completed Components

### 1. Database Schema ✅
- **File**: `workers/api/schema.sql`
- **Migration**: `workers/api/migrate-multilang.sql`
- **Changes**:
  - Added `language` column to `page_content` table
  - Changed PRIMARY KEY to composite `(page_id, language)`
  - Added indexes for efficient queries
  - Migration script preserves existing data in 'en' language

**Migration Instructions**:
```bash
cd workers/api
wrangler d1 execute wedding-db --file=./migrate-multilang.sql
```

### 2. Backend API ✅
- **File**: `workers/api/src/index.js`
- **Endpoints Updated**:
  - `GET /api/content/{pageId}` - Returns all languages
  - `GET /api/content/{pageId}/{language}` - Returns specific language with 'en' fallback
  - `PUT /api/content/{pageId}/{language}` - Updates specific language

**New Features**:
- Language validation (en, de, ta only)
- Smart fallback to English if requested language missing
- Composite key support for multiple languages per page

### 3. Frontend API Client ✅
- **File**: `src/api/contentApi.js`
- **New Functions**:
  - `getPageContent(pageId, language)` - Get specific language or all languages
  - `getAllPageContent(pageId)` - Get all languages explicitly
  - `getAvailableLanguages(pageId)` - Check which languages have content
  - `updatePageContent(pageId, language, content)` - Update specific language
  - `getMultiplePageContent(pageIds, language)` - Batch fetch with language support

### 4. Admin Page Content Editor ✅
- **File**: `src/components/admin/PageContentEditor.js`
- **New Features**:
  - Language selector with EN/DE/TA buttons and flags
  - Visual indicators for which languages have content
  - Unsaved changes warning when switching languages
  - Intro/Outro text editing sections for all page types
  - Auto-updates available languages list after save

**Layout Structure**:
```
[Language Selector: 🇬🇧 EN | 🇩🇪 DE | 🇱🇰 TA]
[Content Availability Indicators]

┌─ Page Introduction ────────┐
│ <textarea for intro>       │
└────────────────────────────┘

┌─ Page-Specific Content ────┐
│ (images, timeline, etc.)   │
└────────────────────────────┘

┌─ Page Conclusion ──────────┐
│ <textarea for outro>       │
└────────────────────────────┘

[Save] Button
```

## Pending Components

### 5. Page Components with CMS Integration ⏳

The following pages need to be updated to use the new multi-language CMS content:

#### Pages to Update:
1. **ChristianCeremony** - `src/components/ceremonies/ChristianCeremony.js`
2. **HinduCeremony** - `src/components/ceremonies/HinduCeremony.js`
3. **Reception** - `src/components/reception/Reception.js`
4. **OurStory** - `src/components/story/OurStory.js`
5. **Home** (Hero) - `src/components/home/Hero.js`

#### Additional Pages (No Current CMS):
6. **Gallery** - `src/components/gallery/Gallery.js`
7. **Guestbook** - `src/components/guestbook/Guestbook.js`
8. **RSVP** - `src/components/rsvp/RSVPForm.js`
9. **Location** - `src/components/location/Location.js`
10. **FAQ** - Check if exists

#### Implementation Pattern for Each Page:

```javascript
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPageContent } from '../../api/contentApi';

const YourPage = () => {
    const { t, i18n } = useTranslation();
    const [cmsContent, setCmsContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, [i18n.language]); // Reload when language changes

    const loadContent = async () => {
        try {
            const data = await getPageContent('your-page-id', i18n.language);
            setCmsContent(data.content || {});
        } catch (error) {
            console.error('Error loading CMS content:', error);
            setCmsContent({});
        } finally {
            setIsLoading(false);
        }
    };

    // Smart fallback logic:
    // Priority: CMS[currentLanguage] -> i18n translation -> empty string
    const intro = cmsContent?.intro || t('yourPage.intro', { defaultValue: '' });
    const outro = cmsContent?.outro || t('yourPage.outro', { defaultValue: '' });

    return (
        <section className="container mx-auto px-4 py-12">
            {/* Intro Section - Editable via CMS */}
            {intro && (
                <div className="intro-section mb-8 text-center">
                    <p className="text-lg text-gray-700 whitespace-pre-wrap">{intro}</p>
                </div>
            )}

            {/* Main Content - Existing implementation */}
            {/* ... your existing page content ... */}

            {/* Outro Section - Editable via CMS */}
            {outro && (
                <div className="outro-section mt-8 text-center">
                    <p className="text-lg text-gray-700 whitespace-pre-wrap">{outro}</p>
                </div>
            )}
        </section>
    );
};

export default YourPage;
```

#### For Pages with Existing CMS Content (Timeline, Rituals, etc.):

```javascript
// Example for ceremony pages with timeline
const timeline = cmsContent?.timeline || t('ceremonyPage.timeline', {
    returnObjects: true,
    defaultValue: []
});

// Use the CMS content if available, otherwise fall back to translation
{Array.isArray(timeline) && timeline.map((event, index) => (
    <div key={index}>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
    </div>
))}
```

### 6. Admin Dashboard Language Indicators ⏳

**File**: `src/components/admin/AdminDashboard.js`

Update the Content Management tab to show:
- List of editable pages with language completion status
- Visual indicators: `[EN ✓] [DE ✓] [TA ]`
- Quick stats: "5 pages, 12/15 languages complete"

```javascript
// Add to AdminDashboard.js

const [pageLanguageStatus, setPageLanguageStatus] = useState({});

useEffect(() => {
    loadLanguageStatus();
}, []);

const loadLanguageStatus = async () => {
    const pages = ['christian-ceremony', 'hindu-ceremony', 'reception', 'our-story', 'home'];
    const status = {};

    for (const pageId of pages) {
        const languages = await getAvailableLanguages(pageId);
        status[pageId] = languages;
    }

    setPageLanguageStatus(status);
};

// Render in Content tab:
<div className="space-y-2">
    {Object.entries(pageLanguageStatus).map(([pageId, languages]) => (
        <div key={pageId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">{formatPageTitle(pageId)}</span>
            <div className="flex space-x-2">
                {['en', 'de', 'ta'].map(lang => (
                    <span key={lang} className={`px-2 py-1 text-xs rounded ${
                        languages.includes(lang)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-500'
                    }`}>
                        {lang.toUpperCase()} {languages.includes(lang) ? '✓' : ''}
                    </span>
                ))}
            </div>
            <button onClick={() => editPage(pageId)} className="text-blue-600 hover:underline">
                Edit
            </button>
        </div>
    ))}
</div>
```

## Testing Checklist

### Database Migration
- [ ] Run migration script on production D1 database
- [ ] Verify existing data preserved in 'en' language
- [ ] Test composite primary key works (can insert multiple languages per page)

### Backend API
- [ ] Test `GET /api/content/{pageId}` returns all languages
- [ ] Test `GET /api/content/{pageId}/en` returns English content
- [ ] Test `GET /api/content/{pageId}/de` falls back to English if German missing
- [ ] Test `PUT /api/content/{pageId}/en` creates/updates English content
- [ ] Test invalid language code (e.g., 'fr') returns 400 error
- [ ] Test admin authentication required for PUT

### Frontend Admin
- [ ] Language selector switches content correctly
- [ ] Unsaved changes warning appears when switching languages
- [ ] Save button updates correct language
- [ ] Available languages indicators update after save
- [ ] Intro/outro text areas save and load correctly
- [ ] Existing features (timeline, images, rituals) still work

### Frontend Public Pages
- [ ] Intro section displays on all pages when available
- [ ] Outro section displays on all pages when available
- [ ] Content falls back correctly: CMS → i18n → empty
- [ ] Content updates when language is switched
- [ ] No console errors when CMS content missing
- [ ] Existing hardcoded content still works if CMS empty

### Full Workflow Test
1. Login as admin
2. Go to Content Management
3. Select "Christian Ceremony"
4. Switch to German (DE)
5. Add intro text: "Willkommen zu unserer christlichen Zeremonie"
6. Add outro text: "Wir freuen uns auf dich!"
7. Save
8. Switch to Tamil (TA)
9. Add intro text: "எங்கள் கிறிஸ்தவ விழாவுக்கு வரவேற்கிறோம்"
10. Save
11. Logout
12. Visit Christian Ceremony page in English - should see English/fallback
13. Switch to German - should see German intro/outro
14. Switch to Tamil - should see Tamil intro
15. Verify all 3 languages work correctly

## Common Issues & Solutions

### Issue: Content not loading
**Solution**: Check browser console for API errors. Verify API_URL environment variable is correct.

### Issue: Language switcher not showing all languages
**Solution**: Ensure `availableLanguages` state is being updated after save. Check API response includes language field.

### Issue: Unsaved changes lost when switching languages
**Solution**: Confirm `hasUnsavedChanges` is being set to `true` on every content update. Check warning dialog appears.

### Issue: CMS content not appearing on public pages
**Solution**: Verify `getPageContent` is called with correct page ID. Check fallback logic allows empty strings. Ensure `i18n.language` dependency in useEffect.

### Issue: Database migration fails
**Solution**: If table already modified, drop and recreate. Backup data first:
```bash
# Backup
wrangler d1 execute wedding-db --command="SELECT * FROM page_content" > backup.json

# Drop and recreate
wrangler d1 execute wedding-db --command="DROP TABLE page_content"
wrangler d1 execute wedding-db --file=./schema.sql
```

## Security Considerations

✅ **Implemented**:
- Admin authentication required for PUT endpoints
- Language validation (only en/de/ta accepted)
- Content size limit (1MB max)
- Input sanitization for XSS prevention

⚠️ **Additional Recommendations**:
- Consider rate limiting for public GET endpoints if traffic high
- Add CSP headers for user-generated content
- Sanitize intro/outro text before rendering (use `DOMPurify` if HTML allowed)

## Performance Optimizations

**Implemented**:
- Lazy loading of CMS content (only on page mount)
- Database indexes on language and page_id columns
- Smart fallback prevents unnecessary API calls

**Future Improvements**:
- Cache CMS content in localStorage with TTL
- Preload content for all languages on language switch
- Compress large timeline/ritual arrays
- Implement service worker for offline CMS content

## Rollback Plan

If issues arise in production:

1. **Rollback Backend**:
```bash
cd workers/api
git checkout HEAD~1 src/index.js
wrangler deploy
```

2. **Rollback Database** (use backup from before migration):
```bash
cd workers/api
wrangler d1 execute wedding-db --file=./backup.sql
```

3. **Rollback Frontend**:
```bash
git checkout HEAD~1 src/api/contentApi.js src/components/admin/PageContentEditor.js
npm run build
./deploy.sh
```

## Next Steps

1. ✅ Complete database migration
2. ✅ Test backend API endpoints
3. ✅ Test admin page editor
4. ⏳ Update all page components with intro/outro
5. ⏳ Add language indicators to admin dashboard
6. ⏳ Full end-to-end testing
7. ⏳ Deploy to production
8. ⏳ Monitor for issues

## Support & Documentation

- **API Documentation**: See JSDoc comments in `contentApi.js`
- **Database Schema**: See `workers/api/schema.sql`
- **MCS Documentation**: See `MCS_DOCUMENTATION.md`
- **Security Guidelines**: See `CLAUDE.md` Security section

## Contact

For questions or issues:
1. Check this implementation guide
2. Review error logs: `wrangler tail --env production`
3. Test locally first: `wrangler dev` + `npm start`
