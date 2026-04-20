const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function extractProductImage(url, itemName) {
    if (url) {
        try {
            console.log(`[Scraper] Attempting to extract from: ${url}`);
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Cache-Control': 'max-age=0'
                },
                timeout: 8000,
                maxRedirects: 5
            });

            const $ = cheerio.load(data);
            let imageUrl = null;

            // Priority 1: Open Graph image
            imageUrl = $('meta[property="og:image"]').attr('content');

            // Priority 2: Twitter card image
            if (!imageUrl) {
                imageUrl = $('meta[name="twitter:image"]').attr('content');
            }

            // Priority 3: Schema.org JSON-LD product image
            if (!imageUrl) {
                $('script[type="application/ld+json"]').each((i, el) => {
                    if (imageUrl) return false;
                    try {
                        const raw = $(el).html();
                        const schemaData = JSON.parse(raw);
                        const schema = Array.isArray(schemaData) ? schemaData[0] : schemaData;
                        if (schema.image) {
                            const img = Array.isArray(schema.image) ? schema.image[0] : schema.image;
                            imageUrl = typeof img === 'object' && img.url ? img.url : img;
                        }
                    } catch (e) { /* ignore */ }
                });
            }

            // Priority 4: Amazon-specific selectors
            if (!imageUrl) {
                imageUrl = $('#landingImage').attr('src') ||
                           $('#imgBlkFront').attr('src') ||
                           $('[data-old-hires]').attr('data-old-hires') ||
                           $('img[data-a-dynamic-image]').attr('src');
            }

            // Priority 5: First meaningful <img>
            if (!imageUrl) {
                $('img').each((i, el) => {
                    const src = $(el).attr('src') || $(el).attr('data-src');
                    if (src && !src.includes('.svg') && !src.includes('icon') && !src.includes('logo') && !src.includes('pixel') && !src.includes('data:image') && (src.startsWith('http') || src.startsWith('//'))) {
                        imageUrl = src;
                        return false;
                    }
                });
            }

            if (imageUrl) {
                if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
                if (imageUrl.startsWith('/')) {
                    const urlObj = new URL(url);
                    imageUrl = urlObj.origin + imageUrl;
                }
                console.log(`[Scraper] Successfully extracted image: ${imageUrl.substring(0, 80)}...`);
                return imageUrl;
            }

            console.log('[Scraper] No image found in HTML.');
        } catch (error) {
            console.error(`[Scraper Error] Could not extract from URL: ${error.message}`);
        }
    }

    // AI Fallback: Generate image using Google Gemini
    console.log(`[AI Fallback] Attempting Gemini image generation for: "${itemName}"`);
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('[AI Fallback] No GEMINI_API_KEY configured. Falling back to dynamic placeholder.');
            throw new Error('No API Key');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp', // Or 'imagen-3.0-generate-001'
            generationConfig: {
                responseModalities: ['TEXT', 'IMAGE']
            }
        });

        const result = await model.generateContent(
            `Generate a single clean product image of: ${itemName}. Show the product on a plain white background, studio-quality photo style.`
        );

        const response = result.response;
        const parts = response.candidates?.[0]?.content?.parts;

        if (parts) {
            for (const part of parts) {
                if (part.inlineData) {
                    const base64 = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    const dataUri = `data:${mimeType};base64,${base64}`;
                    console.log('[AI Fallback] Gemini image generated successfully (data URI).');
                    return dataUri;
                }
            }
        }
        throw new Error('Gemini did not return image data');

    } catch (error) {
        console.warn(`[AI Fallback Error] Gemini generation failed (${error.message}). Falling back to algorithmic placeholder.`);
        // Bulletproof placeholder resolver mapping text directly mathematically
        const encodedName = encodeURIComponent(itemName.substring(0, 40));
        return `https://placehold.co/800x800/E2E8F0/1E293B?text=${encodedName}`;
    }
}

module.exports = { extractProductImage };
