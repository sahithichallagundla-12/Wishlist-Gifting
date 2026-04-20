const axios = require('axios');

async function runTests() {
    console.log("================================");
    console.log("Starting End-to-End API Tests...");
    console.log("================================\n");
    const base = 'http://localhost:5000/api';
    try {
        const email = `testuser_${Date.now()}@test.com`;
        const regRes = await axios.post(`${base}/users`, { name: 'Test User', email, password: 'password123' });
        const token = regRes.data.token;
        console.log("✅ User registered and Auth Token received.");

        const auth = { headers: { Authorization: `Bearer ${token}` } };

        const wlRes = await axios.post(`${base}/wishlists`, {
            title: 'Automated Test Wishlist',
            description: 'Testing the extraction logic',
            isPublic: true
        }, auth);
        const wishlistId = wlRes.data._id;
        console.log(`✅ Wishlist created successfully (${wishlistId}).\n`);

        console.log("--- TEST 1: Validation Rules ---");
        try {
            await axios.post(`${base}/wishlists/${wishlistId}/items`, {
                name: 'Missing URL Item'
            }, auth);
            console.log("❌ Failed: The server allowed an item without a URL.");
        } catch (e) {
            console.log(`✅ Passed: Server rejected missing URL -> "${e.response.data.message}"`);
        }

        console.log("\n--- TEST 2: Active Web Scraping (Apple) ---");
        const itemRes = await axios.post(`${base}/wishlists/${wishlistId}/items`, {
            name: 'Apple iPhone 15',
            productLink: 'https://www.apple.com/iphone-15/'
        }, auth);
        console.log(`✅ Item created dynamically.`);
        console.log(`🖼️ Resulting Image URL: ${itemRes.data.imageUrl}`);

        console.log("\n--- TEST 3: Restrictive Web Fallback (Amazon) ---");
        const itemRes2 = await axios.post(`${base}/wishlists/${wishlistId}/items`, {
            name: 'Sony Wireless Headphones',
            productLink: 'https://www.amazon.in/dp/B0CZJLHQBK'
        }, auth);
        console.log(`✅ Item created dynamically using fallback engines.`);
        console.log(`🖼️ Resulting Image URL: ${itemRes2.data.imageUrl}`);
        
        console.log("\n================================");
        console.log("Tests Complete.");

    } catch (e) {
        console.error("Test execution failed:", e.message);
        if(e.response) console.error("Details:", e.response.data);
    }
}

runTests();
