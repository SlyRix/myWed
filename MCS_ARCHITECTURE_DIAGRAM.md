# MCS Architecture Diagram

## Overall System Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                                       │
│  /admin (password protected - AdminRoute component)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │Guest List  │  │Gifts       │  │Content     │  │QR Codes    │        │
│  │Tab         │  │Tab         │  │Tab (CMS)   │  │Tab         │        │
│  └────────────┘  └────────────┘  └──────┬─────┘  └────────────┘        │
│                                          │                               │
│                                    ┌─────▼─────┐                        │
│                                    │Page        │                        │
│                                    │Selector    │                        │
│                                    │Dropdown    │                        │
│                                    │(no lang)   │                        │
│                                    └─────┬─────┘                        │
│                                          │                               │
│                                    ┌─────▼──────────────────┐          │
│                                    │PageContentEditor       │          │
│                                    │- Load content          │          │
│                                    │- Display editor        │          │
│                                    │- Save changes          │          │
│                                    └─────┬──────────────────┘          │
│                                          │                               │
└──────────────────────────────────────────┼───────────────────────────────┘
                                           │
                        Frontend API Layer │
                                           │
                    contentApi.js Functions│
                                           │
        ┌──────────────────────────────────┼──────────────────────────────┐
        │                                  │                              │
   ┌────▼────────────┐          ┌─────────▼──────────┐                  │
   │GET /api/content │          │PUT /api/content    │                  │
   │/{pageId}        │          │/{pageId}           │                  │
   │                 │          │                    │                  │
   │- Public        │          │- Admin only        │                  │
   │- No auth       │          │- Bearer token      │                  │
   │- Returns JSON  │          │- Validates content │                  │
   └────┬────────────┘          └─────────┬──────────┘                  │
        │                                 │                              │
   Backend (Cloudflare Worker)            │                              │
   workers/api/src/index.js               │                              │
        │                                 │                              │
   ┌────▼─────────────────────────────────▼────────────────┐            │
   │  handleGetPageContent()   | handleUpdatePageContent()  │            │
   │  (Lines 1001-1038)        | (Lines 1046-1097)          │            │
   │                                                        │            │
   │  - Validate pageId format                             │            │
   │  - Query D1 database                                  │            │
   │  - Parse JSON content                                 │            │
   │  - Check max size (1MB)                               │            │
   │  - Upsert into page_content table                     │            │
   └────┬─────────────────────────────────────────────────┘            │
        │                                                              │
   Database (Cloudflare D1)                                           │
        │                                                              │
   ┌────▼───────────────────────────────────────┐                   │
   │ page_content TABLE                         │                   │
   ├────────────────────────────────────────────┤                   │
   │ page_id TEXT PRIMARY KEY                   │                   │
   │   'christian-ceremony'                     │                   │
   │   'hindu-ceremony'                         │                   │
   │   'reception'                              │                   │
   │   'our-story'                              │                   │
   │   'home'                                   │                   │
   ├────────────────────────────────────────────┤                   │
   │ content TEXT (JSON)                        │                   │
   │   { images, timeline, rituals, ... }       │                   │
   │   NO LANGUAGE FIELD!                       │                   │
   ├────────────────────────────────────────────┤                   │
   │ updated_at INTEGER                         │                   │
   ├────────────────────────────────────────────┤                   │
   │ updated_by TEXT DEFAULT 'admin'            │                   │
   └────────────────────────────────────────────┘                   │
                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Content Display Flow (Frontend Pages)

```
┌──────────────────────────────────────────────────────────────┐
│  Page Component (e.g., ChristianCeremony.js)                │
│  - useTranslation() from react-i18next                       │
│  - useState for CMS content                                  │
└──────────┬───────────────────────────────────────────────────┘
           │
      useEffect on mount
           │
     ┌─────▼──────────────────┐
     │ Load CMS content via   │
     │ getPageContent()       │
     │ API call              │
     │ GET /api/content/{id} │
     └─────┬──────────────────┘
           │
      ┌────▴─────────────────────────────────────────┐
      │                                              │
  CMS has               CMS is empty or error
  content               (404 or failed)
      │                                              │
  ┌───▼──────┐                              ┌────────▼──────┐
  │Use CMS   │                              │Fall back to   │
  │content   │                              │i18n           │
  │directly  │                              │translations   │
  └───┬──────┘                              └────┬───────────┘
      │                                          │
      │  const timeline =                        │  const timeline = [
      │    cmsContent?.timeline                  │    {
      │                                          │      time: t('path.time'),
      │  const heroImage =                       │      title: t('path.title'),
      │    cmsContent?.images?.hero              │      description: t('path.description')
      │                                          │    }
      │  const rituals =                         │  ]
      │    cmsContent?.rituals                   │
      │                                          │  const heroImage =
      └────────────┬─────────────────────────────┘    '/images/placeholder.jpg'
                   │
             ┌─────▼──────────┐
             │ Render page    │
             │ with content   │
             └────────────────┘
```

---

## i18n System (Currently Separate)

```
┌─────────────────────────────────────────────────────────────┐
│ i18n Translation Files (HARDCODED, not editable via CMS)    │
│ react-i18next library                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ en/translation.json  |  de/translation.json  | ta/translation.json
│                      |                       |
│ {                    |  {                    | {
│   header: {          |    header: {          |   header: {
│     home: "Home"     |      home: "Startseite"|     home: "...", 
│   },                 |    },                 |   },
│   christian: {       |    christian: {       |   christian: {
│     schedule: {      |      schedule: {      |     schedule: {
│       events: {      |        events: {      |       events: {
│         arrival: {   |          arrival: {   |         arrival: {
│           time: "1:30 PM",
│           title: "Guest Arrival",
│           description: "Please arrive..."
│         }            |          }            |         }
│       }              |        }              |       }
│     }                |      }                |     }
│   }                  |    }                  |   }
│ }                    |  }                    | }
│                      |                       |
└──────────────────────────────────────────────┘
```

---

## Content Data Flow - Christian Ceremony Example

```
┌─ ADMIN EDITS CONTENT ─────────────────────────────────────┐
│                                                             │
│ 1. Click "Content" tab                                     │
│ 2. Select "Christian Ceremony" from dropdown               │
│ 3. PageContentEditor loads:                               │
│    getPageContent('christian-ceremony')                   │
│                                                             │
│ 4. Editor renders timeline section:                       │
│    - Time input field                                     │
│    - Title input field                                    │
│    - Description textarea                                │
│    - Up/down buttons to reorder                          │
│    - Delete button                                        │
│                                                             │
│ 5. Admin edits a timeline event:                         │
│    { time: "2:00 PM", title: "...", description: "..." } │
│                                                             │
│ 6. Click "Save Changes"                                   │
│    updatePageContent('christian-ceremony', {...})         │
│                                                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
         PUT /api/content/christian-ceremony
         {
           content: {
             images: { hero: "/url" },
             timeline: [
               { time: "1:30 PM", title: "...", description: "..." },
               { time: "2:00 PM", title: "...", description: "..." },
               ...
             ]
           }
         }
                  │
                  ▼
┌─ BACKEND UPDATES CONTENT ─────────────────────────────────┐
│                                                             │
│ 1. Validate pageId format (/^[a-z0-9-]+$/)                │
│ 2. Validate content is object                             │
│ 3. Validate content size < 1MB                            │
│ 4. INSERT OR REPLACE INTO page_content:                  │
│    - page_id: 'christian-ceremony'                       │
│    - content: JSON.stringify(content)                    │
│    - updated_at: Date.now()                              │
│                                                             │
│ 5. Return: { success: true, pageId, updatedAt }          │
│                                                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
         Response received by frontend
                  │
                  ▼
┌─ GUEST VISITS PAGE ───────────────────────────────────────┐
│                                                             │
│ 1. Navigate to /christian-ceremony                        │
│ 2. ChristianCeremony.js loads:                           │
│    useEffect { getPageContent('christian-ceremony') }    │
│                                                             │
│ 3. CMS has content! Use it:                              │
│    cmsContent.timeline = [                               │
│      { time: "1:30 PM", title: "...", description: "..." }
│      { time: "2:00 PM", title: "...", description: "..." }
│    ]                                                       │
│                                                             │
│ 4. Display timeline with CMS data (NOT i18n)             │
│    - All in English (CMS has no language field)          │
│    - German or Tamil guests see English!                 │
│                                                             │
│ 5. Hero image from CMS:                                  │
│    cmsContent.images.hero = "/uploaded/image.jpg"        │
│                                                             │
└───────────────────────────────────────────────────────────┘
```

---

## CRITICAL ISSUE: i18n Not Used When CMS Content Exists

```
CURRENT CODE PATTERN:
┌─────────────────────────────────────────────────────────┐
│ const timelineEvents = cmsContent?.timeline || [       │
│   {                                                     │
│     time: t('christian.schedule.events.arrival.time'),  │
│     title: t('christian.schedule.events.arrival.title'),│
│     description: t('...')                              │
│   },                                                    │
│   ...                                                   │
│ ];                                                      │
└─────────────────────────────────────────────────────────┘

IF cmsContent.timeline EXISTS:
  -> Use cmsContent.timeline
  -> Ignore all i18n translations
  -> All guests see same language (likely English)

IF cmsContent.timeline is undefined or null:
  -> Fall back to i18n translations
  -> Show content in selected language
  -> But only if CMS is EMPTY


PROBLEM:
========
- CMS stores language-agnostic JSON (no 'en', 'de', 'ta' keys)
- If admin edits CMS, OVERWRITES all language variants
- German/Tamil users can't see translations
- Can't have different timeline for different languages
- No way to mix CMS (admin-edited) with i18n (default text)
```

---

## Data Storage Comparison

```
WHAT'S IN D1 DATABASE (page_content table):
┌────────────────────────────────────┐
│ page_id: 'christian-ceremony'       │
│ content: {                          │
│   images: { hero: "..." },          │
│   timeline: [                       │
│     {                               │
│       time: "2:00 PM",              │
│       title: "Ceremony Begins",     │
│       description: "The bride..."   │
│     }                               │
│   ]                                 │
│ }                                   │
│                                     │
│ NOTE: No language field!            │
│ NOTE: Single JSON blob per page     │
└────────────────────────────────────┘

WHAT'S IN i18n JSON FILES:
┌────────────────────────────────────┐
│ en/translation.json:                │
│ {                                   │
│   christian: {                      │
│     schedule: {                     │
│       title: "Ceremony Schedule",   │
│       events: {                     │
│         begins: {                   │
│           time: "2:00 PM",          │
│           title: "Ceremony Begins", │
│           description: "The..."     │
│         }                           │
│       }                             │
│     }                               │
│   }                                 │
│ }                                   │
│                                     │
│ de/translation.json:                │
│ {                                   │
│   christian: {                      │
│     schedule: {                     │
│       title: "Zeremonie-Plan",      │
│       events: {                     │
│         begins: {                   │
│           time: "14:00 Uhr",        │
│           title: "Zeremonie beginnt"
│           description: "Die..."     │
│         }                           │
│       }                             │
│     }                               │
│   }                                 │
│ }                                   │
│                                     │
│ ta/translation.json:                │
│ {                                   │
│   christian: {                      │
│     schedule: {                     │
│       title: "விழா அட்டவணை",         │
│       events: {                     │
│         begins: {                   │
│           time: "2:00 மணி பிப",    │
│           title: "விழா தொடங்கும்",   │
│           description: "மணவாளி..."  │
│         }                           │
│       }                             │
│     }                               │
│   }                                 │
│ }                                   │
│                                     │
│ NOTE: Separate files per language   │
│ NOTE: Hierarchical structure        │
└────────────────────────────────────┘

BEST SOLUTION:
Store both in database by language!
┌────────────────────────────────────┐
│ page_id: 'christian-ceremony'       │
│ language: 'en'                      │
│ content: {                          │
│   images: { hero: "..." },          │
│   timeline: [{...}],                │
│   intro: "We are delighted...",    │
│   outro: "Thank you for..."         │
│ }                                   │
│ updated_at: 1699...                 │
│                                     │
│ page_id: 'christian-ceremony'       │
│ language: 'de'                      │
│ content: {                          │
│   images: { hero: "..." },          │
│   timeline: [{...}],                │
│   intro: "Wir freuen uns...",      │
│   outro: "Danke für..."             │
│ }                                   │
│ updated_at: 1699...                 │
│                                     │
│ page_id: 'christian-ceremony'       │
│ language: 'ta'                      │
│ content: {                          │
│   images: { hero: "..." },          │
│   timeline: [{...}],                │
│   intro: "எங்கள்...",                │
│   outro: "நன்றி...",                 │
│ }                                   │
│ updated_at: 1699...                 │
└────────────────────────────────────┘
```

---

## File Dependencies

```
┌─ ADMIN DASHBOARD ──────────────┐
│                                │
│ AdminDashboard.js              │
│ (tabs, layout)                 │
│      │                         │
│      ├─────────────────────────────────────┐
│      │                                     │
│      ▼                                     ▼
│ PageContentEditor.js            GiftsManager.js
│ - Loads content                 - Gift CRUD
│ - Displays editor
│ - Saves changes
│      │
│      ├──────────────────┐
│      │                  │
│      ▼                  ▼
│ contentApi.js    ImageUploader.js
│ - GET content    - Upload images
│ - PUT content
│
└────────────────────────────────┘

┌─ PAGE COMPONENTS ───────────────────┐
│                                     │
│ ChristianCeremony.js                │
│ HinduCeremony.js                    │
│ Reception.js                        │
│ OurStory.js                         │
│ Hero.js                             │
│      │                              │
│      ├─────────────┬─────────────┐  │
│      │             │             │  │
│      ▼             ▼             ▼  │
│ contentApi     react-i18next    Other
│ - Load CMS     - Translations   components
│ - Cache        - Language select
│                                     │
└─────────────────────────────────────┘

┌─ BACKEND ──────────────────────────┐
│                                    │
│ workers/api/src/index.js           │
│                                    │
│ handleGetPageContent()             │
│ handleUpdatePageContent()          │
│      │                             │
│      ▼                             │
│ Cloudflare D1 Database             │
│ page_content table                 │
│                                    │
└────────────────────────────────────┘
```

---

## Migration Path for i18n Integration

```
CURRENT STATE:
  D1: page_content(page_id, content, updated_at, updated_by)
       - Single JSON blob per page
       - No language field
  
  i18n: 3 separate JSON files (en, de, ta)
       - Hardcoded translations
       - Not editable via CMS

STEP 1: Update Schema
  ALTER TABLE page_content ADD COLUMN language TEXT;
  CREATE UNIQUE INDEX page_content_key ON page_content(page_id, language);

STEP 2: Backfill Data
  INSERT INTO page_content (page_id, language, content, updated_at)
  SELECT page_id, 'en', content, updated_at FROM page_content_old;

STEP 3: Update API Endpoints
  GET /api/content/{pageId}/{language}
  PUT /api/content/{pageId}/{language}

STEP 4: Update Frontend
  - Add language selector to PageContentEditor
  - Update contentApi.js to include language parameter
  - Update fallback logic in page components

STEP 5: Update Page Components
  - Load: getPageContent('christian-ceremony', currentLanguage)
  - Fallback: Use i18n if CMS returns empty
  - Display: Mix CMS + i18n intelligently

STEP 6: Test
  - Edit content in all 3 languages
  - Verify fallback works
  - Ensure correct language displays

STEP 7: Migrate Existing CMS Content
  - If content exists without explicit language, assign to 'en'
  - Create translated versions from i18n
  - Update admin UI to manage all languages
```

