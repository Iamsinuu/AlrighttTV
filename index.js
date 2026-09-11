const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// ---------------- CONFIGURATION ----------------
// Yahan aapko apna Original Server ka URL daalna hai
const ORIGINAL_SERVER_URL = "https://www.crunchyroll.com.com/auth/login-otp";

// Yahan apna Premium Token daalein jo inject karna hai
const PREMIUM_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6InhRTUNIZ0JpVlg3NVliYkZBNmNoZ3ciLCJ0eXAiOiJKV1QifQ.eyJhbm9ueW1vdXNfaWQiOiJjMWZhN2NmZi04Y2NiLTQxMGYtOTVmNC04NTFjNzUyOGUxNjYiLCJiZW5lZml0cyI6WyJjYXRhbG9nIiwiY29uY3VycmVudF9zdHJlYW1zLjQiLCJjcl9iZW50byIsImNyX2Zhbl9wYWNrIiwiY3JfcHJlbWl1bSIsIm5vX2FkcyIsIm9mZmxpbmVfdmlld2luZyIsInNpbXVsY2FzdCJdLCJjbGllbnRfaWQiOiJjcl9hbmRyb2lkIiwiY2xpZW50X3RhZyI6IjMuMTIwLjAiLCJjb3VudHJ5IjoiSU4iLCJkZXZpY2VfaWQiOiJlMzg5ZTg4ZS0xNzY1LTQ4MGQtYmZjZi0xMmJjODc5MTVlZjciLCJldHBfdXNlcl9pZCI6ImJiMzhhNWM3LWIyM2UtNTg2Ny05OWQ4LThiYjVmZTk2ZDdiNyIsImV4cCI6MTc4OTA3Mzg5MSwiZXh0ZW5kZWRfbWF0dXJpdHkiOnsiQVUiOiJSIDE4KyIsIkJSIjoiMTgiLCJJTiI6IkEiLCJLUiI6IjE5IiwiVU4iOiIxOCJ9LCJqdGkiOiJjMDJjOGYxYy0wODNkLTQ3ZDItYTVlZC0xODkzM2I0ZmIwMTMiLCJtYXR1cml0eSI6Ik0zIiwib2F1dGhfc2NvcGVzIjoiYWNjb3VudCBjb250ZW50IG1wIG9mZmxpbmVfYWNjZXNzIHBpbnMgcmV2aWV3cyB0YWxrYm94IHRlZW4tcHJvZmlsZSIsInByb2ZpbGVfaWQiOiJiYjM4YTVjNy1iMjNlLTU4NjctOTlkOC04YmI1ZmU5NmQ3YjciLCJwcm9maWxlX3R5cGUiOiJhZ2dyZXRzdWtvIiwicnRfaWQiOiJkYWhoOWNoZGJiMGxpaXIxYXMyMCIsInNjb3BlcyI6eyJjciI6eyJhY2NfaWQiOiJiYjM4YTVjNy1iMjNlLTU4NjctOTlkOC04YmI1ZmU5NmQ3YjciLCJleHRfaWQiOiIxMjk0NzkxNDQ3In19LCJzdGF0dXMiOiJBQ1RJVkUiLCJ0bnQiOiJjciJ9.CYY7FedcobCALVHBeV2nDRUuFXtkChb7gBgGBw8WrA_0fyJ4XWIp4PUrsF4KCvXb8e-VHuClXA2AWVEeLfVMtqjb6AtFJuBuwzGclXUJS0iLCP45tZjU8ebMxfjzQtVRWrkQQoLY8m9_qYVYDBIyL0HwtfnlGVwCfwHrebU6XOjWOFuu4qk0zzmj2ZlWl5GD98FL07uaNIwL6aKKuICnLobCxy8XQ6z6P8tkjqK1ibrVrxjoSHW6DZNbZc46bZb5lQVpr3fDWF5ANE2lWWBtaJ-pRwnd1tHd3rLHyT5Fn2WccrBdkokqoqZLfhJhTY4wGTJvf1SHD5F5m2N8GGxbPQ";
// -----------------------------------------------

// OTP Login Route (Aapka API Server Endpoint)
app.post('/api/proxy/login-otp', async (req, res) => {
    try {
        // Step 1: Modded client se request aati hai (OTP Data)
        const clientPayload = req.body; 

        // Step 2: Intercept request + Premium Token inject karna
        // Default tareeka: Headers mein token pass karna
        const customHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PREMIUM_TOKEN}`, // Yahan token inject ho raha hai
            // Agar koi custom header chahiye toh aap yahan add kar sakte hain:
            // 'X-Premium-Auth': PREMIUM_TOKEN 
        };

        /* 
        NOTE: Agar Original Server token ko Header ki jagah 
        Body mein expect karta hai, toh isko un-comment karein:
        
        const clientPayload = { ...req.body, premium_token: PREMIUM_TOKEN };
        */

        // Step 3: Original App Server ko request forward karna
        // Valid token verify karke original server data return karega
        const originalServerResponse = await axios.post(
            ORIGINAL_SERVER_URL, 
            clientPayload, 
            { headers: customHeaders }
        );

        // Step 4: Same response App (Modded Client) ko forward kar dena[cite: 1]
        res.status(originalServerResponse.status).json(originalServerResponse.data);

    } catch (error) {
        // Agar Original Server koi error deta hai (e.g., 401 Unauthorized, 400 Bad Request)
        if (error.response) {
            // Hum same error Modded Client ko bhej denge taaki App crash na ho
            res.status(error.response.status).json(error.response.data);
        } else {
            // Agar API server aur Original Server ke beech connection fail ho jaye
            res.status(500).json({ error: "Original server is unreachable or down." });
        }
    }
});

// Server Start Karna
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Aapka API Proxy Server port ${PORT} par chal raha hai.`);
    console.log(`App se request yahan bhejein: http://localhost:${PORT}/api/proxy/login-otp`);
});