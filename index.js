const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Target Server: Crunchyroll
const TARGET_SERVER = process.env.TARGET_SERVER || 'https://www.crunchyroll.com';

// Standard & Auth Headers
const CUSTOM_HEADERS = {
  'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6InhRTUNIZ0JpVlg3NVliYkZBNmNoZ3ciLCJ0eXAiOiJKV1QifQ.eyJhbm9ueW1vdXNfaWQiOiI2OTRjYTIwMi1iZjY0LTRiMjgtODcwYi05MmE1MWU2OTMzYjciLCJiZW5lZml0cyI6WyJjYXRhbG9nIiwiY29uY3VycmVudF9zdHJlYW1zLjQiLCJjcl9iZW50byIsImNyX2Zhbl9wYWNrIiwiY3JfcHJlbWl1bSIsIm5vX2FkcyIsIm9mZmxpbmVfdmlld2luZyIsInNpbXVsY2FzdCJdLCJjbGllbnRfaWQiOiJjcl9hbmRyb2lkIiwiY2xpZW50X3RhZyI6IjMuMTIwLjAiLCJjb3VudHJ5IjoiSU4iLCJkZXZpY2VfaWQiOiI2ZTFhZGZmNi0xYWJlLTQzMGYtYWEyNS01Y2Y2Nzg4ZjU0NDEiLCJldHBfdXNlcl9pZCI6ImJiMzhhNWM3LWIyM2UtNTg2Ny05OWQ4LThiYjVmZTk2ZDdiNyIsImV4cCI6MTc4OTA3MTcxMCwiZXh0ZW5kZWRfbWF0dXJpdHkiOnsiQVUiOiJSIDE4KyIsIkJSIjoiMTgiLCJJTiI6IkEiLCJLUiI6IjE5IiwiVU4iOiIxOCJ9LCJqdGkiOiI0MmI4MDdkYy1hMjNmLTQzYmYtOWMyZi04MmI0MWQ5MTMyMjMiLCJtYXR1cml0eSI6Ik0zIiwib2F1dGhfc2NvcGVzIjoiYWNjb3VudCBjb250ZW50IG1wIG9mZmxpbmVfYWNjZXNzIHBpbnMgcmV2aWV3cyB0YWxrYm94IHRlZW4tcHJvZmlsZSIsInByb2ZpbGVfaWQiOiJiYjM4YTVjNy1iMjNlLTU4NjctOTlkOC04YmI1ZmU5NmQ3YjciLCJwcm9maWxlX3R5cGUiOiJhZ2dyZXRzdWtvIiwicnRfaWQiOiJkYWhndjFqZDBkcGlsdWY2NmswMCIsInNjb3BlcyI6eyJjciI6eyJhY2NfaWQiOiJiYjM4YTVjNy1iMjNlLTU4NjctOTlkOC04YmI1ZmU5NmQ3YjciLCJleHRfaWQiOiIxMjk0NzkxNDQ3In19LCJzdGF0dXMiOiJBQ1RJVkUiLCJ0bnQiOiJjciJ9.cEzF2utgFE74x6CVq6DOCejfxScvoyTktE01WUbvjiCGPoJ6vPewotz9dtkoGjJOwpKne8fd3sF444Nq9pbF4iSkPCsWuMQf9t5ZCjIQ75j3oy0jnzKn4CXSPJsx5FPnDK7bhZL5pZ5OtRdYtWFpFY3DXeU2CDOm6373OMTwlQZv2M_tyBpxLR78RcOWd3zbT1sEuXzyUUgUKjs5Bz-WO5ypIEqLZ-KKrTvZOkPSWfbnyla2nPmb7j0tXwydx4tGh9ha4THMefzhQU7MTrgyOUxPGwQy41eeNiQjSTPz',
  'ETP-Anonymous-ID': '694ca202-bf64-4b28-870b-92a51e6933b7',
  'User-Agent': 'Crunchyroll/3.120.0 Android/10 okhttp/5.3.2',
  'Accept': '*/*',
  'Accept-Encoding': 'gzip'
};

// Cloudflare & Session Cookies
const COOKIE_HEADER = 'cr_exp=bb38a5c7-b23e-5867-99d8-8bb5fe96d7b7bb38a5c7-b23e-5867-99d8-8bb5fe96d7b7';

app.use('/', createProxyMiddleware({
  target: TARGET_SERVER,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      // Headers Inject karna
      Object.entries(CUSTOM_HEADERS).forEach(([key, value]) => {
        proxyReq.setHeader(key, value);
      });

      // Cookie Header set karna
      proxyReq.setHeader('Cookie', COOKIE_HEADER);

      // Host header override karna taaki backend signature mismatch na ho
      proxyReq.setHeader('Host', 'www.crunchyroll.com');
    }
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Crunchyroll Proxy running on port ${PORT}`);
});