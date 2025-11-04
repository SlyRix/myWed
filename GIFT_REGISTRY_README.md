# Gift Registry System Documentation

## Overview

The wedding gift registry system allows guests to:
- Browse wedding gift items with images and descriptions in multiple languages (English, German, Tamil)
- Make contributions toward gifts (full or partial payments)
- See real-time progress bars showing how much has been contributed
- Add optional messages with their contributions

Admins can:
- Add, edit, and delete gifts
- View all contributions with contributor names and messages
- Export contribution data to CSV
- Track progress toward gift funding goals

## Architecture

### Database Tables

#### `gifts` Table
Stores gift items for the registry:
- `id` - Auto-incrementing primary key
- `name_en`, `name_de`, `name_ta` - Gift names in three languages
- `description_en`, `description_de`, `description_ta` - Gift descriptions in three languages
- `price` - Gift price in CHF (must be positive)
- `image_url` - URL to gift image
- `category` - Gift category (experience, kitchen, home)
- `created_at` - Timestamp of gift creation

#### `contributions` Table
Stores guest contributions to gifts:
- `id` - Auto-incrementing primary key
- `gift_id` - Foreign key to gifts table
- `contributor_name` - Name of contributor (max 100 chars)
- `amount` - Contribution amount in CHF (must be positive)
- `message` - Optional message (max 200 chars)
- `created_at` - Timestamp of contribution

### API Endpoints

#### Public Endpoints

**GET `/api/gifts`**
- Returns all gifts with contribution totals
- Response includes: id, names, descriptions, price, imageUrl, category, totalContributed, contributionCount, remainingAmount, percentageFunded

**POST `/api/gifts/:id/contribute`**
- Makes a contribution to a specific gift
- Rate limited: 10 requests per 15 minutes per IP
- Request body: `{ contributorName, amount, message? }`
- Validates that contribution doesn't exceed remaining balance

#### Admin Endpoints (Require Authentication)

**POST `/api/gifts`**
- Creates a new gift
- Request body: `{ names: {en, de, ta}, descriptions: {en, de, ta}, price, imageUrl, category }`

**PUT `/api/gifts/:id`**
- Updates an existing gift
- Same request body as POST

**DELETE `/api/gifts/:id`**
- Deletes a gift and all its contributions
- Irreversible action

**GET `/api/gifts/:id/contributions`**
- Returns all contributions for a specific gift
- Includes contributor names, amounts, messages, and timestamps

### Frontend Components

**`GiftCard`** - Displays individual gift with progress bar
- Shows gift image, name, description (in current language)
- Animated progress bar showing percentage funded
- "Fully Funded" overlay when target reached
- Click to open contribution modal

**`ContributionModal`** - Modal for making contributions
- Form validation (name required, amount must be positive, can't exceed remaining)
- Optional message field (max 200 chars)
- Success/error handling
- Multilingual support

**`GiftList`** - Grid display of all gifts
- Category filtering (All, Experience, Kitchen, Home)
- Loading and error states
- Success message after contribution
- Responsive grid layout

**`GiftsManager`** (Admin) - Admin interface for gift management
- Add/edit/delete gifts
- View contributions per gift (expandable)
- Export all data to CSV
- Multilingual form (enter translations for all three languages)

## Database Initialization

### 1. Initialize the database schema

From the `workers/api` directory:

```bash
cd workers/api
wrangler d1 execute wedding-db --file=./gift-schema.sql
```

This creates the `gifts` and `contributions` tables with indexes.

### 2. Verify the tables were created

```bash
wrangler d1 execute wedding-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

You should see: `guests`, `sessions`, `rate_limits`, `gifts`, `contributions`

### 3. View sample gifts

The schema file includes 6 sample gifts:
```bash
wrangler d1 execute wedding-db --command="SELECT id, name_en, price, category FROM gifts"
```

### 4. Add a test contribution (optional)

```bash
wrangler d1 execute wedding-db --command="INSERT INTO contributions (gift_id, contributor_name, amount, message) VALUES (1, 'John & Mary Test', 250.0, 'Wishing you a wonderful honeymoon!')"
```

### 5. View contributions

```bash
wrangler d1 execute wedding-db --command="SELECT g.name_en as gift, c.contributor_name, c.amount, c.message FROM contributions c JOIN gifts g ON c.gift_id = g.id"
```

## Common Database Operations

### Add a new gift

```bash
wrangler d1 execute wedding-db --command="INSERT INTO gifts (name_en, name_de, name_ta, description_en, description_de, description_ta, price, image_url, category) VALUES (
  'Air Fryer',
  'Heissluftfritteuse',
  'காற்று வறுப்பான்',
  'Modern air fryer for healthy cooking',
  'Moderne Heissluftfritteuse für gesundes Kochen',
  'ஆரோக்கியமான சமையலுக்கு நவீன காற்று வறுப்பான்',
  180.0,
  'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
  'kitchen'
)"
```

### Update gift price

```bash
wrangler d1 execute wedding-db --command="UPDATE gifts SET price = 2500.0 WHERE id = 1"
```

### Delete a gift (and all its contributions)

```bash
wrangler d1 execute wedding-db --command="DELETE FROM gifts WHERE id = 7"
```

### View gift funding status

```bash
wrangler d1 execute wedding-db --command="
SELECT
  g.name_en,
  g.price,
  COALESCE(SUM(c.amount), 0) as contributed,
  g.price - COALESCE(SUM(c.amount), 0) as remaining,
  ROUND((COALESCE(SUM(c.amount), 0) / g.price) * 100) as percentage
FROM gifts g
LEFT JOIN contributions c ON g.id = c.gift_id
GROUP BY g.id
ORDER BY percentage DESC
"
```

### Export all contributions to view in terminal

```bash
wrangler d1 execute wedding-db --command="
SELECT
  g.name_en as Gift,
  c.contributor_name as Contributor,
  c.amount as Amount,
  c.message as Message,
  datetime(c.created_at/1000, 'unixepoch') as Date
FROM contributions c
JOIN gifts g ON c.gift_id = g.id
ORDER BY c.created_at DESC
"
```

### Delete test contributions

```bash
wrangler d1 execute wedding-db --command="DELETE FROM contributions WHERE contributor_name LIKE '%Test%'"
```

## Security Features

### Input Validation
- Gift names: Max 200 characters per language
- Gift descriptions: Max 500 characters per language
- Contributor names: Max 100 characters
- Contribution messages: Max 200 characters
- Amounts: Must be positive numbers
- Contributions cannot exceed remaining gift balance

### Rate Limiting
- Contributions: 10 per 15 minutes per IP address
- General API: 100 requests per 15 minutes per IP address
- Login attempts: 5 per 15 minutes per IP address

### SQL Injection Prevention
- All queries use parameterized statements
- No raw SQL string concatenation

### XSS Prevention
- React automatically escapes output
- No use of `dangerouslySetInnerHTML` with user data
- Input length limits enforced

### Admin Authentication
- All admin endpoints require valid session token
- Sessions expire after 24 hours
- Token validation on every admin request

## Customization

### Adding New Gift Categories

1. Update the `category` validation in `workers/api/src/index.js`
2. Add category to the filter options in `src/components/gifts/GiftList.js`
3. Add category translations to all language files

### Changing Currency

The system uses CHF (Swiss Francs) by default. To change:

1. Update display in `GiftCard.js` (lines 65, 75, 102)
2. Update display in `ContributionModal.js` (line 210)
3. Update display in `GiftsManager.js` (multiple locations)

### Image Sources

Sample gifts use Unsplash images. For production:
- Upload images to your own CDN/storage
- Update `image_url` in database
- Recommended image size: 800x600px
- Format: WebP or JPEG for best performance

## Testing

### Test the public gift list

```bash
curl https://api.rushel.me/api/gifts | jq
```

### Test making a contribution (requires valid gift ID)

```bash
curl -X POST https://api.rushel.me/api/gifts/1/contribute \
  -H "Content-Type: application/json" \
  -d '{
    "contributorName": "Test User",
    "amount": 50.0,
    "message": "Best wishes!"
  }'
```

### Test admin endpoints (requires authentication)

```bash
# First login to get token
TOKEN=$(curl -X POST https://api.rushel.me/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your_admin_password"}' | jq -r '.token')

# View contributions for gift #1
curl -H "Authorization: Bearer $TOKEN" \
  https://api.rushel.me/api/gifts/1/contributions | jq
```

## Troubleshooting

### Gifts not loading
- Check that database tables exist: `wrangler d1 execute wedding-db --command="SELECT * FROM gifts"`
- Verify API is accessible: `curl https://api.rushel.me/api/gifts`
- Check browser console for CORS errors

### Contributions failing
- Verify contribution doesn't exceed remaining amount
- Check rate limiting (10 per 15 min per IP)
- Ensure gift ID exists in database

### Admin functions not working
- Verify you're logged in (check localStorage for `adminToken`)
- Confirm session hasn't expired (24-hour limit)
- Check network tab for 401 Unauthorized responses

### Database errors
- Ensure you're in `workers/api` directory when running wrangler commands
- Verify database name is `wedding-db` in wrangler.toml
- Check that migrations have been applied

## Maintenance

### Clear old test data

```bash
# Remove test contributions
wrangler d1 execute wedding-db --command="DELETE FROM contributions WHERE contributor_name LIKE '%Test%' OR contributor_name LIKE '%test%'"

# Reset a gift's contributions (use with caution!)
wrangler d1 execute wedding-db --command="DELETE FROM contributions WHERE gift_id = 1"
```

### Backup contributions

```bash
# Export to JSON
wrangler d1 execute wedding-db --command="SELECT * FROM contributions" --json > contributions-backup-$(date +%Y%m%d).json

# Export to CSV (using jq)
wrangler d1 execute wedding-db --command="SELECT * FROM contributions" --json | jq -r '.[] | [.id, .gift_id, .contributor_name, .amount, .message, .created_at] | @csv' > contributions-backup-$(date +%Y%m%d).csv
```

### Monitor contributions

```bash
# Check total contributions across all gifts
wrangler d1 execute wedding-db --command="SELECT COUNT(*) as total_contributions, SUM(amount) as total_amount FROM contributions"

# See most popular gifts
wrangler d1 execute wedding-db --command="
SELECT g.name_en, COUNT(c.id) as contribution_count, SUM(c.amount) as total_contributed
FROM gifts g
LEFT JOIN contributions c ON g.id = c.gift_id
GROUP BY g.id
ORDER BY contribution_count DESC, total_contributed DESC
"
```

## Future Enhancements

Potential features to add:
- Email notifications when gift fully funded
- Thank you notes to contributors
- Group gifting (multiple people for one contribution)
- Anonymous contributions option
- Contribution history for guests (track what they contributed)
- Gift suggestions based on remaining amounts
- Integration with payment processors (Stripe, PayPal)
- Gift delivery tracking
