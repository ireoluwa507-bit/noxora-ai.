NOXORA — DEPLOYMENT NOTES

Included:
- index.html, style.css, app.js: responsive Noxora site
- netlify/functions/chat.js: secure server-side OpenAI chat endpoint
- netlify.toml: Netlify publish/functions configuration

IMPORTANT: This is deploy-ready source, not already published. I cannot access your GitHub/Netlify account or set up monetization on your behalf. You must deploy it from your account and add your own secret API key.

DEPLOY TO NETLIFY (Android)
1. Upload these files/folders to your GitHub repository, preserving the structure. The folder `netlify/functions` must contain `chat.js`.
2. In Netlify, import/connect that GitHub repository.
3. Site configuration/build settings: publish directory `.` and functions directory `netlify/functions` (netlify.toml is included).
4. Site configuration > Environment variables: add OPENAI_API_KEY with your secret key. Optional OPENAI_MODEL (default gpt-4o-mini).
5. Trigger a fresh deploy after adding the key.
6. Open your site URL. Send a chat. Test `https://YOUR-SITE.netlify.app/.netlify/functions/chat` by POSTing JSON; opening it in a browser with GET will say Method not allowed, which is expected.

MONETIZATION CHECKLIST
- Ads: apply to an ad network and follow its approval/publisher rules. Insert the network's approved ad code only after acceptance. No ad account or ad code is included, and income is not guaranteed.
- Affiliate: join programs that accept your country/publisher profile; add disclosed affiliate links and privacy/terms pages.
- Premium: connect a payment provider that supports your business/country, add server-side checkout/webhook validation, and only then enable Premium. The current Premium button is a placeholder and does not charge users.
- Add Privacy Policy, Terms, contact/support, cookie/consent handling as required by your ad network and local law before public launch.
- Protect API usage: configure provider limits/budget alerts, add rate limiting and abuse protection before sharing widely. This starter has no user login or rate limiting.

SECURITY
Never put OPENAI_API_KEY in app.js, index.html, or any public GitHub file. Store it only in Netlify environment variables. Do not commit secrets.
