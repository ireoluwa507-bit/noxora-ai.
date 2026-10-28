NOXORA WEBSITE — DEPLOYMENT GUIDE

WHAT'S INCLUDED
- Responsive black/purple Noxora website
- AI chat interface
- Netlify serverless function at netlify/functions/chat.js
- Netlify configuration

IMPORTANT
The website design works without an API key, but AI replies require an OpenAI API key, API billing/credits, and the backend deployed as a Netlify Function. This project does not include an API key.

DEPLOY THE COMPLETE SITE
1. Extract noxora-website.zip on your phone or computer.
2. In Netlify, choose Add new site / Deploy manually (wording can vary).
3. Upload the extracted site folder if Netlify supports folder upload. If it only accepts a ZIP, upload the ZIP.
4. For the most reliable Functions deployment, connect the GitHub repository and commit ALL these files while preserving the path netlify/functions/chat.js. Netlify must use the repository root as the base directory.
5. In Netlify: Site configuration (or Site settings) > Environment variables, add:
   Key: OPENAI_API_KEY
   Value: your secret OpenAI API key
   Do not share this key or place it in index.html/app.js.
6. Optionally add OPENAI_MODEL with value gpt-4o-mini.
7. Trigger a fresh deploy after setting environment variables.
8. Test the website, then test:
   https://YOUR-SITE.netlify.app/.netlify/functions/chat
   Opening that URL in a browser with GET may say "Use POST for chat." or Method Not Allowed; that means the function route exists. A 404 means the function is not deployed or the site build settings/path are wrong.
9. AI API usage can cost money. Set usage limits/alerts in your API provider account.

MONETIZATION CHECKLIST
- Add a real Privacy Policy, Terms, and Contact page before applying to ad networks.
- Publish original useful content and make the site reliable on mobile.
- Apply to an ad network that accepts your country/site; approval is not guaranteed.
- Use affiliate programs that explicitly accept Nigerian publishers and disclose affiliate links.
- Never click your own ads or encourage users to click ads.
- Do not promise users guaranteed earnings.
- Add real privacy/cookie disclosures where required.
- This starter does not yet include ad tags, affiliate integrations, login/accounts, payments, or a native Android APK. Those require separate setup.

TROUBLESHOOTING
- 404 on /.netlify/functions/chat: ensure netlify/functions/chat.js is committed in the deployed repository and functions directory is netlify/functions.
- Missing OPENAI_API_KEY: add it in Netlify environment variables and redeploy.
- 401/invalid API key: check key is valid and belongs to an account with API access.
- 429/quota: check API billing/usage limits.
