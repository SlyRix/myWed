-- Default content initialization for CMS
-- This seeds the page_content table with initial content from all pages
-- Run this after creating the schema to populate default content

-- Home page content
INSERT OR REPLACE INTO page_content (page_id, content, updated_at) VALUES (
    'home',
    '{
        "hero": {
            "backgroundImage": null,
            "patternImage": "/images/floral-pattern.svg"
        }
    }',
    cast(strftime('%s', 'now') as integer) * 1000
);

-- Christian Ceremony content
INSERT OR REPLACE INTO page_content (page_id, content, updated_at) VALUES (
    'christian-ceremony',
    '{
        "images": {
            "hero": "/images/placeholder.jpg"
        },
        "timeline": [
            {
                "time": "13:30",
                "title": "Guest Arrival",
                "description": "Guests are welcomed and seated"
            },
            {
                "time": "14:00",
                "title": "Ceremony Begins",
                "description": "The ceremony officially begins"
            },
            {
                "time": "14:15",
                "title": "Exchange of Vows",
                "description": "The bride and groom exchange their wedding vows"
            },
            {
                "time": "14:30",
                "title": "Pronouncement",
                "description": "The couple is pronounced husband and wife"
            },
            {
                "time": "14:45",
                "title": "Recessional",
                "description": "The newlyweds walk down the aisle"
            },
            {
                "time": "15:00",
                "title": "Photos & Reception",
                "description": "Group photos and celebration"
            }
        ]
    }',
    cast(strftime('%s', 'now') as integer) * 1000
);

-- Hindu Ceremony content
INSERT OR REPLACE INTO page_content (page_id, content, updated_at) VALUES (
    'hindu-ceremony',
    '{
        "images": {
            "hero": "/images/hindu-ceremony/HinduHero.jpg"
        },
        "timeline": [
            {
                "time": "09:30",
                "title": "Baraat",
                "description": "Groom''s procession arrives with music and dancing"
            },
            {
                "time": "10:00",
                "title": "Milni",
                "description": "Families meet and exchange garlands"
            },
            {
                "time": "10:30",
                "title": "Ganesh Puja",
                "description": "Prayer to Lord Ganesh for blessings"
            },
            {
                "time": "11:00",
                "title": "Mandap Ceremony",
                "description": "Bride and groom enter the sacred mandap"
            },
            {
                "time": "11:30",
                "title": "Saptapadi",
                "description": "Seven sacred steps around the holy fire"
            },
            {
                "time": "12:00",
                "title": "Mangalsutra",
                "description": "Groom ties the sacred necklace"
            },
            {
                "time": "12:30",
                "title": "Ashirwad",
                "description": "Elders bless the newlyweds"
            },
            {
                "time": "13:00",
                "title": "Lunch",
                "description": "Traditional feast for all guests"
            }
        ],
        "rituals": [
            {
                "title": "Mandap",
                "description": "The sacred canopy where the ceremony takes place"
            },
            {
                "title": "Kanyadaan",
                "description": "The bride''s father gives her hand in marriage"
            },
            {
                "title": "Mangal Phera",
                "description": "The couple circles the sacred fire seven times"
            }
        ]
    }',
    cast(strftime('%s', 'now') as integer) * 1000
);

-- Reception content
INSERT OR REPLACE INTO page_content (page_id, content, updated_at) VALUES (
    'reception',
    '{
        "images": {
            "hero": "/images/placeholder.jpg"
        },
        "timeline": [
            {
                "time": "18:00",
                "title": "Guest Arrival",
                "description": "Welcome drinks and mingling"
            },
            {
                "time": "18:30",
                "title": "Cocktail Hour",
                "description": "Appetizers and drinks"
            },
            {
                "time": "19:00",
                "title": "Grand Entrance",
                "description": "Introduction of the newlyweds"
            },
            {
                "time": "19:30",
                "title": "Dinner Service",
                "description": "Multi-course dinner"
            },
            {
                "time": "20:30",
                "title": "Speeches & Toasts",
                "description": "Words from family and friends"
            },
            {
                "time": "21:00",
                "title": "First Dance",
                "description": "The couple''s first dance"
            },
            {
                "time": "21:30",
                "title": "Cake Cutting",
                "description": "Traditional cake cutting ceremony"
            },
            {
                "time": "22:00",
                "title": "Party Time",
                "description": "Dancing and celebration"
            }
        ]
    }',
    cast(strftime('%s', 'now') as integer) * 1000
);

-- Our Story content
INSERT OR REPLACE INTO page_content (page_id, content, updated_at) VALUES (
    'our-story',
    '{
        "timeline": [
            {
                "date": "January 2020",
                "title": "First Met Online",
                "description": "Our story began on a dating app where we matched",
                "image": "/images/story-met.jpg"
            },
            {
                "date": "February 2020",
                "title": "First Meeting",
                "description": "We met in person for coffee and talked for hours",
                "image": "/images/story-firstmeet.jpg"
            },
            {
                "date": "March 2020",
                "title": "First Date",
                "description": "Our first official date at a beautiful restaurant",
                "image": "/images/story-firstdate.jpg"
            },
            {
                "date": "December 2020",
                "title": "Meeting the Families",
                "description": "We introduced each other to our families",
                "image": "/images/story-families.jpg"
            },
            {
                "date": "June 2025",
                "title": "The Proposal",
                "description": "He proposed during a romantic sunset walk",
                "image": "/images/story-proposal.jpg"
            },
            {
                "date": "September 2025",
                "title": "Engagement Party",
                "description": "We celebrated our engagement with loved ones",
                "image": "/images/story-engagement.jpg"
            },
            {
                "date": "July 2026",
                "title": "Our Wedding Day",
                "description": "We tie the knot in a beautiful ceremony",
                "image": "/images/story-wedding.jpg"
            }
        ]
    }',
    cast(strftime('%s', 'now') as integer) * 1000
);
