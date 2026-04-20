require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function test() {
    let log = '';
    const print = (msg) => { log += msg + '\n'; console.log(msg); };
    
    print('GEMINI_API_KEY present: ' + !!process.env.GEMINI_API_KEY);
    
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        print('Testing gemini-2.0-flash-exp with IMAGE modality...');
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                responseModalities: ['TEXT', 'IMAGE']
            }
        });

        const result = await model.generateContent(
            'Generate a product image of wireless headphones on white background'
        );

        const parts = result.response.candidates?.[0]?.content?.parts;
        print('Parts received: ' + (parts?.length || 0));
        
        if (parts) {
            for (const p of parts) {
                if (p.inlineData) {
                    print('SUCCESS! Got image. MIME: ' + p.inlineData.mimeType + ' Size: ' + (p.inlineData.data?.length || 0));
                } else if (p.text) {
                    print('Text part: ' + p.text.substring(0, 100));
                }
            }
        }
    } catch (e) {
        print('ERROR: ' + e.message);
    }
    
    fs.writeFileSync('test_result.txt', log, 'utf8');
}

test();
