const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const TARGET_SERVER = process.env.TARGET_SERVER || 'https://www.crunchyroll.com';

// Fresh JWT Access Token (Iss token me cr_premium, no_ads, etc. benefits active hain)
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "eyJhbGciOiJSUzI1NiIsImtpZCI6InhRTUNIZ0JpVlg3NVliYkZBNmNoZ3ciLCJ0eXAiOiJKV1QifQ.eyJhbm9ueW1vdXNfaWQiOiJjMWZhN2NmZi04Y2NiLTQxMGYtOTVmNC04NTFjNzUyOGUxNjYiLCJiZW5lZml0cyI6WyJjYXRhbG9nIiwiY29uY3VycmVudF9zdHJlYW1zLjQiLCJjcl9iZW50byIsImNyX2Zhbl9wYWNrIiwiY3JfcHJlbWl1bSIsIm5vX2FkcyIsIm9mZmxpbmVfdmlld2luZyIsInNpbXVsY2FzdCJdLCJjbGllbnRfaWQiOiJjcl9hbmRyb2lkIiwiY2xpZW50X3RhZyI6IjMuMTIwLjAiLCJjb3VudHJ5IjoiSU4iLCJkZXZpY2VfaWQiOiJlMzg5ZTg4ZS0xNzY1LTQ4MGQtYmZjZi0xMmJjODc5MTVlZjciLCJldHBfdXNlcl9pZCI6ImJiMzhhNWM3LWIyM2UtNTg2Ny05OWQ4LThiYjVmZTk2ZDdiNyIsImV4cCI6MTc4OTA3Mzg5MSwiZXh0ZW5kZWRfbWF0dXJpdHkiOnsiQVUiOiJSIDE4KyIsIkJSIjoiMTgiLCJJTiI6IkEiLCJLUiI6IjE5IiwiVU4iOiIxOCJ9LCJqdGkiOiJj02Jm1Y3ZDItYTVlZC0xODkzM2I0ZmIwMTMiLCJtYXR1cml0eSI6Ik0zIiwib2F1dGhfc2NvcGVzIjoiYWNjb3VudCBjb250ZW50IG1wIG9mZmxpbmVfYWNjZXNzIHBpbnMgcmV2aWV3cyB0YWxrYm94IHRlZW4tcHJvZmlsZSIsInByb2ZpbGVfaWQiOiJiYjM4YTVjNy1iMjNlLTU4NmctOTlkOC04YmI1ZmU5NmQ3YjciLCJwcm9maWxlX3R5cGUiOiJhZ2dyZXRzdWtvIiwicnRfaWQiOiJkYWhoOWNoZGJiMGxpaXIxYXMyMCIsInNjb3BlcyI6eyJjciI6eyJhY2NfaWQiOiJiYjM4YTVjNy1iMjNlLTU4NmctOTlkOC04YmI1ZmU5NmQ3YjciLCJleHRfaWQiOiIxMjk0NzkxNDQ3In19LCJzdGF0dXMiOiJBQ1RJVkUiLCJ0bnQiOiJjciJ9.CYY7FedcobCALVHBeV2nDRUuFXtkChb7gBgGBw8WrA_0fyJ4XWIp4PUrsF4KCvXb8e-VHuClXA2AWVEeLfVMtqjb6AtFJuBuwzGclXUJS0iLCP45tZjU8ebMxfjzQtVRWrkQQoLY8m9_qYVYDBIyL0HwtfnlGVwCfwHrebU6XOjWOFuu4qk0zzmj2ZlWl5GD98FL07uaNIwL6aKKuICnLobCxy8XQ6z6P8tkjqK1ibrVrxjoSHW6DZNbZc46bZb5lQVpr3fDWF5ANE2lWWBtaJ-pRwnd1tHd3rLHyT5Fn2WccrBdkokqoqZLfhJhTY4wGTJvf1SHD5F5m2N8GGxbPQ";

app.use('/', createProxyMiddleware({
  target: TARGET_SERVER,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      // Authorization Header inject karna
      proxyReq.setHeader('Authorization', `Bearer ${ACCESS_TOKEN}`);
      
      // Standard headers
      proxyReq.setHeader('User-Agent', 'Crunchyroll/3.120.0 Android/10 okhttp/5.3.2');
      proxyReq.setHeader('Host', 'www.crunchyroll.com');
      proxyReq.setHeader('Accept', 'application/json');
    }
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Crunchyroll proxy server running on port ${PORT}`);
});