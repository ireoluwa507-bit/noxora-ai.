const chatArea = document.getElementById("chatArea");
const chatInput = document.getElementById("chatInput");
const chatForm = document.getElementById("chatForm");
const sendButton = document.getElementById("sendButton");
const toast = document.getElementById("toast");
document.getElementById("year").textContent = new Date().getFullYear();

let history = [];
let waiting = false;

function addMessage(text, who) {
  const row = document.createElement("div");
  row.className = `message ${who === "user" ? "user-message" : "assistant-message"}`;
  if (who !== "user") {
    const avatar = document.createElement("span");
    avatar.className = "mini-avatar";
    avatar.textContent = "N";
    row.appendChild(avatar);
  }
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  row.appendChild(bubble);
  chatArea.appendChild(row);
  chatArea.scrollTop = chatArea.scrollHeight;
  return bubble;
}

async function sendMessage(text) {
  text = text.trim();
  if (!text || waiting) return;
  toast.textContent = "";
  addMessage(text, "user");
  history.push({ role: "user", content: text });
  chatInput.value = "";
  chatInput.style.height = "auto";
  waiting = true;
  sendButton.disabled = true;
  const replyBubble = addMessage("Thinking…", "assistant");
  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-12) })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
    if (!data.reply) throw new Error("The AI returned an empty reply.");
    replyBubble.textContent = data.reply;
    history.push({ role: "assistant", content: data.reply });
  } catch (error) {
    replyBubble.textContent = "I couldn't connect to the AI service just now.";
    toast.textContent = error.message.includes("404")
      ? "Chat backend not found. Deploy this folder with Netlify Functions enabled."
      : "Check the Netlify function and OPENAI_API_KEY environment variable, then try again.";
    history.pop();
  } finally {
    waiting = false;
    sendButton.disabled = false;
    chatInput.focus();
    chatArea.scrollTop = chatArea.scrollHeight;
  }
}

chatForm.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage(chatInput.value);
});
chatInput.addEventListener("input", () => {
  chatInput.style.height = "auto";
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
});
chatInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});
document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => sendMessage(button.dataset.prompt || ""));
});