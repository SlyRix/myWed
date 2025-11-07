# MCS Implementation - Code Examples & Integration Points

## Quick Reference: Key Code Locations

### Frontend Components
- **Editor UI**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/admin/PageContentEditor.js` (495 lines)
- **Admin Dashboard**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/admin/AdminDashboard.js` (583 lines)
- **Content API Client**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/api/contentApi.js` (154 lines)

### Backend
- **Worker Endpoints**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/workers/api/src/index.js` (lines 997-1097)
- **Database Schema**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/workers/api/schema.sql` (lines 36-46)

### Page Integrations
- `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/ceremonies/ChristianCeremony.js` (line 14-36)
- `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/ceremonies/HinduCeremony.js` (similar pattern)
- `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/ceremonies/Reception.js` (similar pattern)
- `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/home/Hero.js` (similar pattern)
- `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/story/OurStory.js` (similar pattern)

---

## Code Snippet 1: PageContentEditor Component Structure

**File**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/admin/PageContentEditor.js`

```javascript
// Lines 1-50: Component Initialization
const PageContentEditor = ({ pageId, pageTitle }) => {
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Lines 20-36: Load content on mount
    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getPageContent(pageId);
                setContent(data.content || {});
            } catch (err) {
                setError(`Failed to load content: ${err.message}`);
                setContent({});
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, [pageId]);

    // Lines 38-51: Save handler
    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            await updatePageContent(pageId, content);
            setSuccessMessage('Content saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(`Failed to save content: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };
};

// Lines 54-72: Update nested content (dot notation)
const updateContent = (path, value) => {
    setContent(prevContent => {
        const newContent = { ...prevContent };
        const keys = path.split('.');
        let current = newContent;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
        return newContent;
    });
};

// Lines 75-97: Add array item
const addArrayItem = (arrayPath, defaultItem) => {
    setContent(prevContent => {
        const newContent = { ...prevContent };
        const keys = arrayPath.split('.');
        let current = newContent;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }

        const arrayKey = keys[keys.length - 1];
        if (!Array.isArray(current[arrayKey])) current[arrayKey] = [];
        current[arrayKey] = [...current[arrayKey], defaultItem];
        return newContent;
    });
};
```

---

## Code Snippet 2: Ceremony Editor (renderCeremonyEditor)

**File**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/admin/PageContentEditor.js` (lines 240-378)

```javascript
const renderCeremonyEditor = (pageId, content, { 
    updateContent, 
    addArrayItem, 
    removeArrayItem, 
    moveArrayItem, 
    updateArrayItem 
}) => {
    const images = content.images || {};
    const timeline = content.timeline || [];
    const rituals = content.rituals || []; // For Hindu only

    return (
        <>
            {/* Hero Image Section */}
            <ImageUploader
                currentImage={images.hero || ''}
                onImageSelect={(url) => updateContent('images.hero', url)}
                label="Hero Image"
            />

            {/* Timeline Events Section - Lines 254-327 */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Timeline Events</h3>
                    <button
                        onClick={() => addArrayItem('timeline', { 
                            time: '', 
                            title: '', 
                            description: '' 
                        })}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        <Icon path={mdiPlus} /> Add Event
                    </button>
                </div>

                <div className="space-y-4">
                    {timeline.map((event, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            {/* Move/Delete buttons */}
                            <div className="flex justify-between items-center">
                                <span>Event {index + 1}</span>
                                <div className="flex gap-2">
                                    {index > 0 && (
                                        <button onClick={() => moveArrayItem('timeline', index, 'up')}>
                                            <Icon path={mdiArrowUp} />
                                        </button>
                                    )}
                                    {index < timeline.length - 1 && (
                                        <button onClick={() => moveArrayItem('timeline', index, 'down')}>
                                            <Icon path={mdiArrowDown} />
                                        </button>
                                    )}
                                    <button onClick={() => removeArrayItem('timeline', index)}>
                                        <Icon path={mdiDelete} />
                                    </button>
                                </div>
                            </div>

                            {/* Event fields */}
                            <input
                                type="text"
                                value={event.time || ''}
                                onChange={(e) => updateArrayItem('timeline', index, 'time', e.target.value)}
                                placeholder="Time (e.g., 14:00)"
                            />
                            <input
                                type="text"
                                value={event.title || ''}
                                onChange={(e) => updateArrayItem('timeline', index, 'title', e.target.value)}
                                placeholder="Event Title"
                            />
                            <textarea
                                value={event.description || ''}
                                onChange={(e) => updateArrayItem('timeline', index, 'description', e.target.value)}
                                placeholder="Event Description"
                                rows="2"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Hindu Ceremony Rituals - Lines 329-376 */}
            {pageId === 'hindu-ceremony' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Ritual Cards</h3>
                        <button
                            onClick={() => addArrayItem('rituals', { 
                                title: '', 
                                description: '' 
                            })}
                        >
                            Add Ritual
                        </button>
                    </div>

                    <div className="space-y-4">
                        {rituals.map((ritual, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <input
                                    value={ritual.title || ''}
                                    onChange={(e) => updateArrayItem('rituals', index, 'title', e.target.value)}
                                    placeholder="Ritual Title"
                                />
                                <textarea
                                    value={ritual.description || ''}
                                    onChange={(e) => updateArrayItem('rituals', index, 'description', e.target.value)}
                                    placeholder="Ritual Description"
                                    rows="2"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};
```

---

## Code Snippet 3: Story Editor (renderStoryEditor)

**File**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/admin/PageContentEditor.js` (lines 381-467)

```javascript
const renderStoryEditor = (content, { 
    addArrayItem, 
    removeArrayItem, 
    moveArrayItem, 
    updateArrayItem 
}) => {
    const timeline = content.timeline || [];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Story Timeline</h3>
                <button
                    onClick={() => addArrayItem('timeline', { 
                        date: '', 
                        title: '', 
                        description: '', 
                        image: '' 
                    })}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    <Icon path={mdiPlus} /> Add Milestone
                </button>
            </div>

            <div className="space-y-6">
                {timeline.map((event, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-medium">Milestone {index + 1}</span>
                            <div className="flex gap-2">
                                {index > 0 && (
                                    <button onClick={() => moveArrayItem('timeline', index, 'up')}>
                                        <Icon path={mdiArrowUp} />
                                    </button>
                                )}
                                {index < timeline.length - 1 && (
                                    <button onClick={() => moveArrayItem('timeline', index, 'down')}>
                                        <Icon path={mdiArrowDown} />
                                    </button>
                                )}
                                <button onClick={() => removeArrayItem('timeline', index)}>
                                    <Icon path={mdiDelete} />
                                </button>
                            </div>
                        </div>

                        <input
                            type="text"
                            value={event.date || ''}
                            onChange={(e) => updateArrayItem('timeline', index, 'date', e.target.value)}
                            placeholder="Date (e.g., January 2020)"
                        />
                        <input
                            type="text"
                            value={event.title || ''}
                            onChange={(e) => updateArrayItem('timeline', index, 'title', e.target.value)}
                            placeholder="Milestone Title"
                        />
                        <textarea
                            value={event.description || ''}
                            onChange={(e) => updateArrayItem('timeline', index, 'description', e.target.value)}
                            placeholder="Description"
                            rows="2"
                        />

                        {/* Image uploader for each milestone */}
                        <ImageUploader
                            currentImage={event.image || ''}
                            onImageSelect={(url) => updateArrayItem('timeline', index, 'image', url)}
                            label={`Milestone ${index + 1} Image`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
```

---

## Code Snippet 4: Content API Calls

**File**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/api/contentApi.js`

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://api.rushel.me/api';

// Get auth headers with admin token
const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Lines 64-89: GET page content (public)
export const getPageContent = async (pageId) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/content/${pageId}`, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    pageId,
                    content: {},
                    updatedAt: null
                };
            }
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching page content:', error);
        throw error;
    }
};

// Lines 107-127: PUT page content (admin only)
export const updatePageContent = async (pageId, content) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/content/${pageId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication required. Please log in again.');
            }
            throw new Error(`Failed to update: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating page content:', error);
        throw error;
    }
};
```

---

## Code Snippet 5: Backend Endpoints (Cloudflare Worker)

**File**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/workers/api/src/index.js`

```javascript
// Lines 1001-1038: GET /api/content/{pageId}
async function handleGetPageContent(env, pageId, requestOrigin) {
    try {
        // Input validation: pageId format check
        if (!pageId || typeof pageId !== 'string' || !/^[a-z0-9-]+$/.test(pageId)) {
            return new Response(
                JSON.stringify({ error: 'Invalid page ID format' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Query D1 database
        const result = await env.DB.prepare(
            'SELECT content, updated_at FROM page_content WHERE page_id = ?'
        ).bind(pageId).first();

        if (!result) {
            return new Response(
                JSON.stringify({ error: 'Page content not found' }),
                { status: 404, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        return new Response(
            JSON.stringify({
                pageId,
                content: JSON.parse(result.content),
                updatedAt: result.updated_at
            }),
            { status: 200, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Get page content error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch page content' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

// Lines 1046-1097: PUT /api/content/{pageId}
async function handleUpdatePageContent(env, pageId, request, requestOrigin) {
    try {
        // Input validation: pageId format
        if (!pageId || typeof pageId !== 'string' || !/^[a-z0-9-]+$/.test(pageId)) {
            return new Response(
                JSON.stringify({ error: 'Invalid page ID format' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        const body = await request.json();
        const { content } = body;

        // Validate content object
        if (!content || typeof content !== 'object') {
            return new Response(
                JSON.stringify({ error: 'Content is required and must be an object' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Validate size (max 1MB)
        const contentStr = JSON.stringify(content);
        if (contentStr.length > 1048576) {
            return new Response(
                JSON.stringify({ error: 'Content too large. Maximum 1MB.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        const now = Date.now();

        // Upsert into D1 (INSERT OR REPLACE)
        await env.DB.prepare(
            'INSERT OR REPLACE INTO page_content (page_id, content, updated_at) VALUES (?, ?, ?)'
        ).bind(pageId, contentStr, now).run();

        return new Response(
            JSON.stringify({
                success: true,
                pageId,
                updatedAt: now
            }),
            { status: 200, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Update page content error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to update page content' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}
```

---

## Code Snippet 6: Page Integration Pattern

**File**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/ceremonies/ChristianCeremony.js` (lines 1-80)

```javascript
const ChristianCeremony = () => {
    const { t } = useTranslation();
    const [cmsContent, setCmsContent] = useState(null);
    const [isLoadingContent, setIsLoadingContent] = useState(true);

    // Lines 22-36: Load CMS content on mount
    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getPageContent('christian-ceremony');
                if (data && data.content) {
                    setCmsContent(data.content);
                }
            } catch (error) {
                console.error('Failed to load CMS content, using defaults:', error);
            } finally {
                setIsLoadingContent(false);
            }
        };
        loadContent();
    }, []);

    // Lines 38-70: Fallback pattern - CMS first, then i18n
    const timelineEvents = cmsContent?.timeline || [
        {
            time: t('christian.schedule.events.arrival.time'),
            title: t('christian.schedule.events.arrival.title'),
            description: t('christian.schedule.events.arrival.description')
        },
        {
            time: t('christian.schedule.events.begins.time'),
            title: t('christian.schedule.events.begins.title'),
            description: t('christian.schedule.events.begins.description')
        },
        // ... more events
    ];

    // Line 73: Use CMS image if available
    const heroImage = cmsContent?.images?.hero || '/images/placeholder.jpg';
};
```

---

## Database Schema (D1)

**File**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/workers/api/schema.sql` (lines 36-46)

```sql
-- Current schema (NO language support)
CREATE TABLE IF NOT EXISTS page_content (
    page_id TEXT PRIMARY KEY,           -- e.g., 'christian-ceremony'
    content TEXT NOT NULL,              -- JSON blob (no language field!)
    updated_at INTEGER NOT NULL,        -- Unix timestamp ms
    updated_by TEXT DEFAULT 'admin'     -- Admin username
);

CREATE INDEX IF NOT EXISTS idx_page_content_updated ON page_content(updated_at);

-- Example data stored:
-- page_id: 'christian-ceremony'
-- content: '{"images":{"hero":"..."},"timeline":[...]}'
-- updated_at: 1699564800000
-- updated_by: 'admin'
```

---

## Admin Dashboard Content Tab Integration

**File**: `/mnt/c/Users/Rushel/Documents/Website/tt/mywed/src/components/admin/AdminDashboard.js` (lines 429-454)

```javascript
{/* Page Content Management */}
{activeTab === 'content' && (
    <div className="space-y-6">
        {/* Page selector - NO language selector! */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <label className="block text-gray-700 font-medium mb-3">
                Select Page to Edit:
            </label>
            <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="w-full md:w-auto p-3 border border-gray-300 rounded-lg text-base"
            >
                <option value="christian-ceremony">Christian Ceremony</option>
                <option value="hindu-ceremony">Hindu Ceremony</option>
                <option value="reception">Reception</option>
                <option value="our-story">Our Story</option>
                <option value="home">Home Page</option>
            </select>
        </div>

        {/* Content editor component */}
        <PageContentEditor
            key={selectedPage}
            pageId={selectedPage}
            pageTitle={selectedPage
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
        />
    </div>
)}
```

---

## Summary Table: What Each File Does

| File | Type | Lines | Purpose | i18n Integration |
|------|------|-------|---------|------------------|
| PageContentEditor.js | Component | 495 | Main CMS editor UI | None |
| AdminDashboard.js | Component | 583 | Admin dashboard | None |
| contentApi.js | API Client | 154 | Frontend API calls | None |
| workers/api/src/index.js | Backend | 1100+ | Cloudflare endpoints | None |
| schema.sql | DB Schema | 52 | D1 database | No language column |
| ChristianCeremony.js | Page | 150+ | Uses CMS + fallback | i18n fallback only |
| HinduCeremony.js | Page | 150+ | Uses CMS + fallback | i18n fallback only |
| Reception.js | Page | 150+ | Uses CMS + fallback | i18n fallback only |
| OurStory.js | Page | 150+ | Uses CMS + fallback | i18n fallback only |
| Hero.js | Page | 150+ | Uses CMS images | i18n fallback only |

---

## Key Data Structures

### What gets stored in `page_content.content` (JSON):

```javascript
// Christian/Hindu Ceremony & Reception
{
    "images": {
        "hero": "/uploads/ceremony-hero.jpg"
    },
    "timeline": [
        {
            "time": "2:00 PM",
            "title": "Ceremony Begins",
            "description": "The bride walks down the aisle..."
        }
    ]
}

// Our Story
{
    "timeline": [
        {
            "date": "January 2020",
            "title": "We Met",
            "description": "Our love story began...",
            "image": "/uploads/story-1.jpg"
        }
    ]
}

// Home Page
{
    "hero": {
        "backgroundImage": "/uploads/hero-bg.jpg",
        "patternImage": "/uploads/pattern.jpg"
    }
}

// Hindu Ceremony (additional)
{
    "rituals": [
        {
            "title": "Mandap Ceremony",
            "description": "The main wedding rituals begin..."
        }
    ]
}
```

