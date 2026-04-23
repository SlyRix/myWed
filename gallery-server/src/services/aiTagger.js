const fs = require('fs');
const { getDb } = require('../db');

const VALID_TAGS = [
  'couple', 'family', 'friends', 'dancing', 'ceremony',
  'reception', 'flowers', 'food', 'venue', 'details', 'fun', 'group'
];

async function tagPhoto(photoId, localPath) {
  if (!process.env.OPENAI_API_KEY) return;

  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const imageData = fs.readFileSync(localPath);
    const base64 = imageData.toString('base64');
    const ext = localPath.split('.').pop().toLowerCase();
    const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
      : ext === 'png' ? 'image/png'
      : ext === 'webp' ? 'image/webp'
      : 'image/jpeg';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `This is a wedding photo. Pick 1 to 3 tags that best describe it from this list only: ${VALID_TAGS.join(', ')}. Reply with just the tags as a JSON array, nothing else. Example: ["couple","dancing"]`
          },
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64}`, detail: 'low' }
          }
        ]
      }]
    });

    const content = response.choices[0]?.message?.content?.trim() || '[]';
    const parsed = JSON.parse(content);
    const tags = parsed.filter(t => VALID_TAGS.includes(t));

    getDb()
      .prepare('UPDATE photos SET ai_tags = ? WHERE id = ?')
      .run(JSON.stringify(tags), photoId);
  } catch {
    // AI tagging is best-effort — never fail the upload
  }
}

module.exports = { tagPhoto };
