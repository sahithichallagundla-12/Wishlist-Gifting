const axios = require("axios");

/**
 * Generate a placeholder image URL with the product name
 * Using placehold.co service
 * @param {string} itemName - The name of the item for the placeholder
 * @returns {string} - A styled placeholder image URL
 */
function generatePlaceholderImage(itemName) {
  if (!itemName || typeof itemName !== "string") {
    itemName = "Product";
  }

  const encodedName = encodeURIComponent(itemName.substring(0, 35));
  const placeholderUrl = `https://placehold.co/800x800/E7CDCE/C00645?text=${encodedName}`;
  console.log(
    `[PlaceholderGenerator] Generated placeholder for: "${itemName}"`,
  );
  return placeholderUrl;
}

/**
 * Generate an AI image using Google Imagen-3.0 model
 * @param {string} prompt - The text prompt for image generation
 * @returns {Promise<{success: boolean, imageBase64?: string, error?: string}>}
 */
async function generateImageWithImagen(prompt) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Valid prompt is required");
    }

    console.log(
      `[ImageGenerator] Generating image with Imagen for: "${prompt}"`,
    );

    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(
      url,
      {
        instances: [{ prompt: prompt }],
        parameters: { sampleCount: 1 },
      },
      {
        timeout: 30000,
      },
    );

    if (
      response.data &&
      response.data.predictions &&
      response.data.predictions[0]
    ) {
      const imageBase64 = response.data.predictions[0].bytesBase64Encoded;
      console.log("[ImageGenerator] Successfully generated image with Imagen");
      return {
        success: true,
        imageBase64: imageBase64,
      };
    }

    throw new Error("No image data in response");
  } catch (error) {
    console.error(
      `[ImageGenerator] Imagen generation failed: ${error.message}`,
    );
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Generate an AI image using Google Gemini-2.0-flash with image modality
 * @param {string} prompt - The text prompt for image generation
 * @returns {Promise<{success: boolean, imageBase64?: string, mimeType?: string, error?: string}>}
 */
async function generateImageWithGemini(prompt) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const { GoogleGenerativeAI } = require("@google/generative-ai");

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Valid prompt is required");
    }

    console.log(
      `[ImageGenerator] Generating image with Gemini for: "${prompt}"`,
    );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const result = await model.generateContent(prompt);
    const parts = result.response.candidates?.[0]?.content?.parts;

    if (parts && parts.length > 0) {
      for (const part of parts) {
        if (part.inlineData) {
          console.log(
            "[ImageGenerator] Successfully generated image with Gemini",
          );
          return {
            success: true,
            imageBase64: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
          };
        }
      }
    }

    throw new Error("No image data in response");
  } catch (error) {
    console.error(
      `[ImageGenerator] Gemini generation failed: ${error.message}`,
    );
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Convert Base64 image data to data URL
 * @param {string} base64Data - The base64 encoded image data
 * @param {string} mimeType - The MIME type (default: image/png)
 * @returns {string} - Data URL
 */
function base64ToDataUrl(base64Data, mimeType = "image/png") {
  return `data:${mimeType};base64,${base64Data}`;
}

/**
 * Create a product-specific image generation prompt
 * @param {string} productName - The name of the product
 * @param {string} description - Optional product description
 * @returns {string} - A detailed prompt for image generation
 */
function createImagePrompt(productName, description = "") {
  let prompt = `Generate a professional product image of ${productName}`;

  if (description) {
    prompt += ` with the following details: ${description}`;
  }

  prompt +=
    ". The image should be on a clean white background, well-lit, professional quality, suitable for an e-commerce catalog.";

  return prompt;
}

module.exports = {
  generatePlaceholderImage,
  generateImageWithImagen,
  generateImageWithGemini,
  base64ToDataUrl,
  createImagePrompt,
};
