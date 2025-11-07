#!/usr/bin/env node
// Migration script to populate page_content table from i18n translation files

const fs = require('fs');
const path = require('path');

// Load translation files
const enTranslations = require('../../src/i18n/locales/en/translation.json');
const deTranslations = require('../../src/i18n/locales/de/translation.json');
const taTranslations = require('../../src/i18n/locales/ta/translation.json');

const translations = {
    en: enTranslations,
    de: deTranslations,
    ta: taTranslations
};

// Mapping of page IDs to translation keys
const pageMapping = {
    'christian-ceremony': 'christian',
    'hindu-ceremony': 'hindu',
    'reception': 'reception',
    'our-story': 'story',
    'home': 'home'
};

/**
 * Escape single quotes for SQL
 */
function escapeSql(str) {
    if (typeof str !== 'string') {
        str = JSON.stringify(str);
    }
    return str.replace(/'/g, "''");
}

/**
 * Transform translation data to CMS content format
 * This extracts the relevant fields for each page type
 */
function transformToContentFormat(pageId, translationData) {
    if (!translationData) {
        return {};
    }

    const content = {};

    switch (pageId) {
        case 'christian-ceremony':
        case 'hindu-ceremony':
        case 'reception':
            // Ceremony pages structure
            content.headline = translationData.headline || '';
            content.description = translationData.description || '';
            content.description2 = translationData.description2 || '';
            content.scheduleTitle = translationData.schedule?.title || '';

            // Timeline events
            if (translationData.schedule && translationData.schedule.events) {
                content.timeline = Object.values(translationData.schedule.events).map(event => ({
                    time: event.time || '',
                    title: event.title || '',
                    description: event.description || ''
                }));
            }

            // Hindu ceremony specific: rituals
            if (pageId === 'hindu-ceremony' && translationData.rituals) {
                content.ritualsTitle = translationData.rituals.title || '';
                content.ritualsDescription = translationData.rituals.description || '';

                if (translationData.rituals.items) {
                    // Convert items object to array
                    content.rituals = Object.values(translationData.rituals.items).map(ritual => ({
                        title: ritual.title || '',
                        description: ritual.description || ''
                    }));
                }
            }

            // Images placeholder
            content.images = {
                hero: ''
            };
            break;

        case 'our-story':
            // Story page structure
            content.headline = translationData.title || '';
            content.description = translationData.description || '';

            // Timeline/milestones - transform events object to array
            // Preserve the order and map to correct image paths
            if (translationData.events) {
                const eventKeys = ['met', 'firstMeet', 'firstDate', 'families', 'proposal', 'engagement', 'wedding'];
                const imageMap = {
                    'met': '/images/story-met.jpg',
                    'firstMeet': '/images/story-firstmeet.jpg',
                    'firstDate': '/images/story-firstdate.jpg',
                    'families': '/images/story-families.jpg',
                    'proposal': '/images/story-proposal.jpg',
                    'engagement': '/images/story-engagement.jpg',
                    'wedding': '/images/story-wedding.jpg'
                };

                content.timeline = eventKeys
                    .filter(key => translationData.events[key])
                    .map(key => {
                        const event = translationData.events[key];
                        return {
                            date: event.date || '',
                            title: event.title || '',
                            description: event.description || '',
                            image: imageMap[key] || ''
                        };
                    });
            }
            break;

        case 'home':
            // Home page structure
            content.hero = {
                backgroundImage: '',
                patternImage: ''
            };
            break;

        default:
            break;
    }

    return content;
}

/**
 * Generate SQL INSERT statements
 */
function generateMigrationSql() {
    const sqlStatements = [];
    const timestamp = Date.now();
    let insertCount = 0;

    console.log('🚀 Starting i18n to database migration...\n');

    // First, clear existing content
    sqlStatements.push('-- Clear existing page_content');
    sqlStatements.push('DELETE FROM page_content;\n');

    // For each page
    Object.entries(pageMapping).forEach(([pageId, translationKey]) => {
        console.log(`📄 Processing page: ${pageId} (${translationKey})`);

        // For each language
        ['en', 'de', 'ta'].forEach(lang => {
            const translationData = translations[lang][translationKey];

            if (!translationData) {
                console.log(`  ⚠️  No ${lang} translations found for ${translationKey}`);
                return;
            }

            const content = transformToContentFormat(pageId, translationData);
            const contentJson = JSON.stringify(content);
            const escapedContent = escapeSql(contentJson);

            const sql = `INSERT INTO page_content (page_id, language, content, updated_at) VALUES ('${pageId}', '${lang}', '${escapedContent}', ${timestamp});`;
            sqlStatements.push(sql);

            insertCount++;
            console.log(`  ✅ ${lang.toUpperCase()}: ${Object.keys(content).length} fields`);
        });

        console.log('');
    });

    console.log(`✨ Generated ${insertCount} INSERT statements\n`);

    return sqlStatements.join('\n');
}

/**
 * Main execution
 */
function main() {
    try {
        const sql = generateMigrationSql();
        const outputPath = path.join(__dirname, 'migrate-i18n.sql');

        fs.writeFileSync(outputPath, sql, 'utf8');

        console.log('💾 SQL file saved to:', outputPath);
        console.log('\n📋 Summary:');
        console.log('  - Pages migrated: 5 (home, christian-ceremony, hindu-ceremony, reception, our-story)');
        console.log('  - Languages: 3 (en, de, ta)');
        console.log('  - Total records: 15');
        console.log('\n🔧 To apply migration, run:');
        console.log('  cd workers/api && wrangler d1 execute wedding-db --file=migrate-i18n.sql');
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { generateMigrationSql, transformToContentFormat };
