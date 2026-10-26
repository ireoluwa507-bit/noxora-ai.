const chatArea = document.getElementById('chatArea');
const chatInput = document.getElementById('chatInput');
const chatForm = document.getElementById('chatForm');
const toast = document.getElementById('toast');
let waitingForReply = false;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3000);
}
function addBubble(text, who) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + who;
  bubble.textContent = text;
  chatArea.appendChild(bubble);
  chatArea.scrollTop = chatArea.scrollHeight;
  return bubble;
}
async function sendMessage(message) {
  const clean = message.trim();
  if (!clean || waitingForReply) return;
  addBubble(clean, 'user');
  chatInput.value = '';
  waitingForReply = true;
  chatInput.disabled = true;
  const sendButton = chatForm.querySelector('button[type="submit"]');
  sendButton.disabled = true;
  const loadingBubble = addBubble('Noxora is thinking…', 'bot');
  try {
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: clean })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Noxora could not answer right now.');
    loadingBubble.textContent = data.reply || 'I could not create a reply just now. Please try again.';
  } catch (error) {
    loadingBubble.textContent = error.message || 'Noxora could not connect. Please try again later.';
  } finally {
    waitingForReply = false;
    chatInput.disabled = false;
    sendButton.disabled = false;
    chatInput.focus();
    chatArea.scrollTop = chatArea.scrollHeight;
  }
}
chatForm.addEventListener('submit', e => { e.preventDefault(); sendMessage(chatInput.value); });
document.querySelectorAll('.prompt').forEach(btn => btn.addEventListener('click', () => sendMessage(btn.textContent)));
document.querySelectorAll('.tool-card').forEach(btn => btn.addEventListener('click', () => {
  const prompts = {
    writer: 'Help me write a short social media bio.',
    study: 'Help me study a difficult topic. Ask me which subject and topic if needed.',
    ideas: 'Give me some useful project ideas and explain how to start small.',
    planner: 'Help me plan my day. Ask what tasks I need to do if I have not listed them.'
  };
  document.getElementById('assistant').scrollIntoView({behavior:'smooth'});
  setTimeout(() => sendMessage(prompts[btn.dataset.tool] || 'Help me get started.'), 350);
}));
document.getElementById('topTry').addEventListener('click', () => document.getElementById('assistant').scrollIntoView({behavior:'smooth'}));
document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('nav').classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => document.getElementById('nav').classList.remove('open')));
