# MCS/MCP Implementation Analysis - Wedding Website

## Current State Overview

The wedding website implements a **Managed Content System (MCS)** for page content editing with the following architecture:

### Key Finding
There is NO MCP (Managed Content Protocol) implementation - only a basic MCS system that stores page content as JSON blobs in the D1 database without language support. The system is completely **disconnected from the i18n system**.

---

## 1. Current MCS Implementation

### 1.1 Frontend Components

**Location**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/admin/`

**Main Files**:
- **PageContentEditor.js** (lines 1-495)
  - Main CMS interface component
  - Loads/saves page content via API
  - Renders different editors based on page ID
  - Currently supports pages: `christian-ceremony`, `hindu-ceremony`, `reception`, `our-story`, `home`

- **AdminDashboard.js** (lines 1-583)
  - Houses PageContentEditor in "Content" tab
  - Integrated with Guest List, Gifts, and QR Code management
  - Uses tabs to switch between admin functions

#### PageContentEditor Features:
```javascript
// Supports:
- Timeline events (with CRUD, reordering)
- Hero images (via ImageUploader)
- Ritual cards (Hindu ceremony only)
- Story milestones (with images)
- Home page hero section images

// Key Handlers:
- updateContent() - Update nested content properties
- addArrayItem() - Add items to arrays (timeline, rituals, etc.)
- removeArrayItem() - Delete items from arrays
- moveArrayItem() - Reorder items (up/down)
- updateArrayItem() - Update specific array item fields
```

### 1.2 Backend API (Cloudflare Worker)

**Location**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/workers/api/src/index.js`

**Endpoints** (lines 997-1097):

```javascript
// PUBLIC - Get page content by page ID
GET /api/content/{pageId}
- Query: page_id from page_content table
- Response: { pageId, content (JSON), updatedAt }
- Error: 404 if page not found

// ADMIN ONLY - Update page content
PUT /api/content/{pageId}
- Requires: Authorization Bearer token
- Body: { content: {...} }
- Validates: pageId format, content is object, max 1MB size
- Response: { success, pageId, updatedAt }
```

**Database Layer**:
```sql
CREATE TABLE page_content (
    page_id TEXT PRIMARY KEY,
    content TEXT NOT NULL,      -- JSON blob
    updated_at INTEGER NOT NULL, -- Unix timestamp ms
    updated_by TEXT DEFAULT 'admin'
);
```

### 1.3 Frontend Content API Client

**Location**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/api/contentApi.js`

```javascript
// getPageContent(pageId)
- Calls: GET /api/content/{pageId}
- Returns: { pageId, content, updatedAt }
- Fallback: { pageId, content: {}, updatedAt: null }

// updatePageContent(pageId, content)
- Calls: PUT /api/content/{pageId}
- Requires: adminToken in localStorage
- Returns: { success, pageId, updatedAt }
```

### 1.4 Pages Using CMS Content

Currently integrated into:
1. **ChristianCeremony.js** - Loads timeline events from CMS
2. **HinduCeremony.js** - Loads timeline and rituals from CMS
3. **Reception.js** - Loads timeline from CMS
4. **OurStory.js** - Loads story milestones from CMS
5. **Hero.js** - Loads hero images from CMS

**Pattern**:
```javascript
const [cmsContent, setCmsContent] = useState(null);

useEffect(() => {
    const loadContent = async () => {
        try {
            const data = await getPageContent('page-id');
            if (data?.content) setCmsContent(data.content);
        } catch (error) {
            console.error('Failed to load CMS content');
        }
    };
    loadContent();
}, []);

// Fallback to i18n translations
const timelineEvents = cmsContent?.timeline || [
    { time: t('path.to.event.time'), ... }
];
```

---

## 2. Internationalization (i18n) Implementation

### 2.1 Current i18n System

**Library**: react-i18next
**Languages**: English (en), German (de), Tamil (ta)
**Location**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/i18n/locales/{locale}/translation.json`

### 2.2 Current Content Types in i18n

**File Structure**: 3 separate JSON files with hardcoded content

**Available Pages** (from translation.json):
- header - Navigation labels
- home - Welcome section
- christian - Christian ceremony details
- hindu - Hindu ceremony details & rituals
- reception - Reception details
- story - Our Story timeline (if exists)
- etc.

### 2.3 CRITICAL GAP: MCS Not Integrated with i18n

**Key Issue**:
```javascript
// CMS content is stored as single JSON blob per page, NO language field
{
    "page_id": "christian-ceremony",
    "content": { ... },      // NO language: "en" key
    "updated_at": 1234567890
}

// This means editing timeline in CMS overwrites ALL languages
const timelineEvents = cmsContent?.timeline || 
    [ t('christian.schedule.events.arrival.time'), ... ];
    //   ^^^ Falls back to i18n ONLY if CMS is empty
```

---

## 3. Content Types Currently Editable

### Via Admin Dashboard -> Content Tab:

| Page | Editable Elements | Structure |
|------|-------------------|-----------|
| **Christian Ceremony** | Hero image, Timeline events | `{ images: { hero }, timeline: [...] }` |
| **Hindu Ceremony** | Hero image, Timeline, Ritual cards | `{ images: { hero }, timeline: [...], rituals: [...] }` |
| **Reception** | Hero image, Timeline events | `{ images: { hero }, timeline: [...] }` |
| **Our Story** | Timeline/Milestones with images | `{ timeline: [...] }` |
| **Home** | Hero background & pattern images | `{ hero: { backgroundImage, patternImage } }` |

### NOT Editable:
- Page intro/outro text
- Section headings
- Location details
- Date/time information
- Dress code
- Any text content (only images and timeline events)
- RSVP button text
- Any content in multiple languages

---

## 4. Current Limitations

### Major Issues:

1. **No i18n Integration**
   - CMS content stored without language field
   - Cannot edit content in multiple languages
   - Pages still rely on hardcoded i18n translations for most text

2. **Limited Content Types**
   - Only timeline events and images editable
   - No text fields for page intro/outro
   - No section heading editing
   - No RSVP button customization

3. **Fallback Mechanism**
   - If CMS is empty, pages show hardcoded i18n translations
   - If CMS has content, i18n is completely ignored
   - No merging or smart fallback between CMS and i18n

4. **No Language Support**
   - All page content stored in single "neutral" format
   - Cannot have different timeline content per language
   - Cannot edit reception location in 3 different languages

5. **Missing Infrastructure**
   - No translation export/import functionality
   - No language selector in editor UI
   - No version history for translations
   - No translation workflow

---

## 5. Database Schema Analysis

### Current page_content Table:
```sql
page_id (TEXT) | content (TEXT/JSON) | updated_at | updated_by
```

**Limitations**:
- No `language` column
- No `section` column (for page sections)
- Content must be entire page, no granular editing
- No translatable fields separated from static content

---

## 6. How to Add Multi-Language Support

### Proposed Schema Change:
```sql
CREATE TABLE page_content (
    id INTEGER PRIMARY KEY,
    page_id TEXT NOT NULL,      -- 'christian-ceremony'
    language TEXT NOT NULL,     -- 'en', 'de', 'ta'
    section TEXT,               -- 'intro', 'timeline', 'outro' (optional)
    content TEXT NOT NULL,      -- JSON blob
    updated_at INTEGER NOT NULL,
    updated_by TEXT,
    UNIQUE(page_id, language, section)
);
```

Or simpler (nested by language):
```sql
CREATE TABLE page_content (
    page_id TEXT PRIMARY KEY,
    en TEXT NOT NULL,           -- JSON content in English
    de TEXT NOT NULL,           -- JSON content in German
    ta TEXT NOT NULL,           -- JSON content in Tamil
    updated_at INTEGER NOT NULL
);
```

---

## 7. Page Content Structure Examples

### What's Currently Stored for Christian Ceremony:
```javascript
{
    "images": {
        "hero": "/url/to/image.jpg"
    },
    "timeline": [
        { "time": "1:30 PM", "title": "Guest Arrival", "description": "..." },
        { "time": "2:00 PM", "title": "Ceremony Begins", "description": "..." },
        // ... more events
    ]
}
```

### What SHOULD Be Stored (Multi-Language):
```javascript
{
    "en": {
        "intro": "We are delighted to invite you...",
        "images": { "hero": "/url/to/image.jpg" },
        "location": { "title": "Location", "address": "..." },
        "timeline": [ ... ],
        "outro": "Thank you for celebrating with us"
    },
    "de": {
        "intro": "Wir freuen uns, Sie einzuladen...",
        "images": { "hero": "/url/to/image.jpg" },
        "location": { "title": "Ort", "address": "..." },
        "timeline": [ ... ],
        "outro": "Danke für die Teilnahme"
    },
    "ta": {
        "intro": "எங்களுடன் கொண்டாட...",
        // ... Tamil content
    }
}
```

---

## 8. Current Editor UI

### AdminDashboard.js Content Tab (lines 429-454):
```javascript
<div className="space-y-6">
    {/* Page selector dropdown */}
    <div className="bg-white p-6 rounded-lg shadow-md">
        <label>Select Page to Edit:</label>
        <select value={selectedPage} onChange={...}>
            <option>Christian Ceremony</option>
            <option>Hindu Ceremony</option>
            <option>Reception</option>
            <option>Our Story</option>
            <option>Home Page</option>
        </select>
    </div>

    {/* Content editor */}
    <PageContentEditor
        pageId={selectedPage}
        pageTitle={selectedPage...}
    />
</div>
```

**Missing**:
- Language selector
- Section selector
- Preview of changes
- Revision history
- Translation status indicator
- Side-by-side language editing

---

## 9. File Locations Quick Reference

| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| Page Editor | `src/components/admin/PageContentEditor.js` | 1-495 | CMS editor UI |
| Admin Dashboard | `src/components/admin/AdminDashboard.js` | 429-454 | Editor integration |
| Content API | `src/api/contentApi.js` | 64-127 | Fetch/update endpoints |
| Worker Handler | `workers/api/src/index.js` | 997-1097 | Backend endpoints |
| Database Schema | `workers/api/schema.sql` | 36-46 | page_content table |
| i18n Translations | `src/i18n/locales/{locale}/translation.json` | Various | Fallback content |

---

## 10. Current Content Editing Workflow

1. Admin logs in at `/admin`
2. Clicks "Content" tab
3. Selects page from dropdown (no language selector!)
4. PageContentEditor loads content via `getPageContent(pageId)`
5. Renders appropriate editor (ceremony, story, or home)
6. Admin edits timeline/images
7. Clicks "Save Changes"
8. `updatePageContent(pageId, content)` saves to D1
9. Changes appear immediately on page (no language fallback)

---

## Summary: What Works vs. What's Missing

### Works:
- Basic JSON content storage in D1
- Timeline event editing (add, edit, delete, reorder)
- Image uploading
- Admin authentication
- Public content retrieval

### Missing (for full MCS):
- Multi-language support
- Text field editing (only images + arrays)
- Page intro/outro sections
- Translation workflow
- Version history
- Granular section editing
- Preview before publish
- Content locking during edit
- Draft vs. published content
- Content validation rules
- Bulk operations

### Completely Missing (for MCP - Managed Content Protocol):
- Any protocol standards compliance
- GraphQL or REST API standards
- Content versioning
- Workflow management
- Permission system (only admin token)
- Content transformation/formatting
- API documentation
- Content schema validation
- Rate limiting per content type

---

## Integration Points with i18n

**Current**: Pages check CMS first, fallback to i18n if empty
**Better**: Pages should merge CMS (admin-edited) with i18n (default/fallback)
**Best**: Decouple content from UI strings - store both separately

### Example Current Pattern:
```javascript
const heading = cmsContent?.heading || t('christian.headline');
const timelineEvents = cmsContent?.timeline || 
    t('christian.schedule.events');
```

This is fragile because:
- CMS overrides ALL translations if present
- Can't have partial CMS + partial i18n
- No way to see "what's customized vs. default"
