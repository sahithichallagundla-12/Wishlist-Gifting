const axios = require('axios');
require('dotenv').config();

async function testImagen() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`;
        const response = await axios.post(url, {
            instances: [{ prompt: "A wireless headphone on a white background" }],
            parameters: { sampleCount: 1 }
        });
        if (response.data && response.data.predictions) {
            console.log("SUCCESS length:", response.data.predictions[0].bytesBase64Encoded.length);
        }
    } catch (e) {
        console.error("ERROR:", e.response ? e.response.data : e.message);
    }
}
testImagen();
