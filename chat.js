// Noxora server-side AI function. Keep OPENAI_API_KEY in Netlify environment variables.
exports.handler = async function(event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  if (!process.env.OPENAI_API_KEY) return { statusCode: 500, headers, body: JSON.stringify({ error: 'OPENAI_API_KEY is missing. Add it in Netlify environment variables.' }) };
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON request' }) }; }
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const safeMessages = messages.slice(-20).filter(m => m && ['user','assistant'].includes(m.role) && typeof m.content === 'string').map(m => ({ role:m.role, content:m.content.slice(0,6000) }));
  if (!safeMessages.length || safeMessages[safeMessages.length-1].role !== 'user') return { statusCode: 400, headers, body: JSON.stringify({ error: 'Send a user message first.' }) };
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST', headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({ model:process.env.OPENAI_MODEL || 'gpt-4o-mini', messages:[{role:'system',content:'You are Noxora, a helpful, friendly AI assistant. Give clear, useful answers. Do not claim to have performed actions you have not performed.'},...safeMessages], max_tokens:900 })
    });
    const data = await response.json();
    if (!response.ok) return { statusCode:response.status, headers, body:JSON.stringify({ error:data.error?.message || 'AI provider request failed' }) };
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) return { statusCode:502, headers, body:JSON.stringify({error:'AI returned an empty response'}) };
    return { statusCode:200, headers, body:JSON.stringify({ reply }) };
  } catch (err) { return { statusCode:502, headers, body:JSON.stringify({ error:'Could not reach AI provider. Please try again.' }) }; }
};
