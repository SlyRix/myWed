-- Gift Registry Schema for Wedding Website
-- This schema defines the database structure for wedding gift registry and contributions

-- Gifts table - stores gift items for the registry
CREATE TABLE IF NOT EXISTS gifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_en TEXT NOT NULL,
    name_de TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_de TEXT NOT NULL,
    description_ta TEXT NOT NULL,
    price REAL NOT NULL CHECK(price > 0),
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    product_url TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);

-- Contributions table - stores guest contributions to gifts
CREATE TABLE IF NOT EXISTS contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gift_id INTEGER NOT NULL,
    contributor_name TEXT NOT NULL CHECK(length(contributor_name) <= 100),
    amount REAL NOT NULL CHECK(amount > 0),
    message TEXT CHECK(message IS NULL OR length(message) <= 200),
    created_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
    FOREIGN KEY (gift_id) REFERENCES gifts(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gifts_category ON gifts(category);
CREATE INDEX IF NOT EXISTS idx_contributions_gift_id ON contributions(gift_id);
CREATE INDEX IF NOT EXISTS idx_contributions_created_at ON contributions(created_at DESC);

-- Insert default wedding registry items (common German wedding gifts)
INSERT OR REPLACE INTO gifts (id, name_en, name_de, name_ta, description_en, description_de, description_ta, price, image_url, category) VALUES
    (1,
     'Honeymoon',
     'Hochzeitsreise',
     'தேனிலவு பயணம்',
     'Help us create unforgettable memories on our honeymoon adventure',
     'Helft uns, unvergessliche Erinnerungen auf unserer Hochzeitsreise zu schaffen',
     'எங்கள் தேனிலவு பயணத்தில் மறக்க முடியாத நினைவுகளை உருவாக்க உதவுங்கள்',
     2000.0,
     'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
     'experience'),
    (2,
     'Coffee Machine',
     'Kaffeemaschine',
     'காபி இயந்திரம்',
     'A high-quality coffee machine for our morning rituals together',
     'Eine hochwertige Kaffeemaschine für unsere morgendlichen Rituale zusammen',
     'நமது காலை வழக்கங்களுக்கான உயர்தர காபி இயந்திரம்',
     400.0,
     'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
     'kitchen'),
    (3,
     'Bedding Set',
     'Bettwäsche Set',
     'படுக்கை விரிப்பு',
     'Luxurious bedding for our new home and peaceful nights',
     'Luxuriöse Bettwäsche für unser neues Zuhause und friedliche Nächte',
     'எங்கள் புதிய வீட்டிற்கும் அமைதியான இரவுகளுக்கும் ஆடம்பரமான படுக்கை விரிப்பு',
     150.0,
     'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
     'home'),
    (4,
     'Kitchen Mixer',
     'Küchenmaschine',
     'சமையலறை கலப்பி',
     'A versatile kitchen mixer for baking and cooking adventures',
     'Eine vielseitige Küchenmaschine für Back- und Kochabenteuer',
     'சமையல் மற்றும் பேக்கிங் சாகசங்களுக்கான பல்துறை சமையலறை கலப்பி',
     300.0,
     'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80',
     'kitchen'),
    (5,
     'Vacuum Cleaner',
     'Staubsauger',
     'வெற்றிட சுத்தம் செய்யும் இயந்திரம்',
     'Modern vacuum cleaner to keep our home fresh and clean',
     'Moderner Staubsauger, um unser Zuhause frisch und sauber zu halten',
     'எங்கள் வீட்டை புதியதாகவும் சுத்தமாகவும் வைத்திருக்க நவீன வெற்றிட சுத்தம் செய்யும் இயந்திரம்',
     250.0,
     'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
     'home'),
    (6,
     'Dinnerware Set',
     'Geschirr Set',
     'பாத்திர தொகுப்பு',
     'Elegant dinnerware set for hosting family and friends',
     'Elegantes Geschirr-Set für Gastgeber von Familie und Freunden',
     'குடும்பம் மற்றும் நண்பர்களை உபசரிக்க நேர்த்தியான பாத்திர தொகுப்பு',
     200.0,
     'https://images.unsplash.com/photo-1584990347449-39b3b9b49c9e?w=800&q=80',
     'kitchen');

-- Sample contribution (for testing - can be removed in production)
-- INSERT INTO contributions (gift_id, contributor_name, amount, message) VALUES
--     (1, 'John & Mary', 250.0, 'Wishing you a wonderful honeymoon!');
