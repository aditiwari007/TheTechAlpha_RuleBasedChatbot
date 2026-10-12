const chatForm = document.querySelector("#chat-form");
const messageInput = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const clearButton = document.querySelector("#clear-chat");
const chatMessages = document.querySelector("#chat-messages");

function addMessage(role, text, isError = false) {
  const row = document.createElement("div");
  row.className = `message-row ${role}${isError ? " error" : ""}`;

  const avatar = document.createElement("span");
  avatar.className = "message-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = role === "user" ? "You" : "✳";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = text;

  row.append(avatar, bubble);
  chatMessages.append(row);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return row;
}

function addTypingIndicator() {
  const row = document.createElement("div");
  row.className = "message-row assistant";
  row.setAttribute("role", "status");
  row.setAttribute("aria-label", "The assistant is typing");

  const avatar = document.createElement("span");
  avatar.className = "message-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = "✳";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble typing-bubble";
  bubble.innerHTML = "<span></span><span></span><span></span>";

  row.append(avatar, bubble);
  chatMessages.append(row);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return row;
}

function setBusy(isBusy) {
  sendButton.disabled = isBusy;
  messageInput.disabled = isBusy;
  clearButton.disabled = isBusy;
  document.querySelectorAll(".suggestion").forEach((button) => {
    button.disabled = isBusy;
  });
}

async function sendMessage(rawMessage) {
  const message = rawMessage.trim();
  if (!message || sendButton.disabled) return;

  document.querySelector("#welcome-block")?.remove();
  addMessage("user", message);
  messageInput.value = "";
  messageInput.style.height = "";
  setBusy(true);
  const typingIndicator = addTypingIndicator();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    typingIndicator.remove();

    if (!response.ok) {
      throw new Error(data.error || "Sorry, something went wrong. Please try again.");
    }

    addMessage("assistant", data.reply);
  } catch (error) {
    typingIndicator.remove();
    const friendlyError = error instanceof TypeError
      ? "I couldn't reach the server. Check your connection and try again."
      : error.message;
    addMessage("assistant", friendlyError, true);
  } finally {
    setBusy(false);
    messageInput.focus();
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(messageInput.value);
});

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

messageInput.addEventListener("input", () => {
  messageInput.style.height = "auto";
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 140)}px`;
});

document.querySelectorAll(".suggestion").forEach((button) => {
  button.addEventListener("click", () => sendMessage(button.dataset.question));
});

clearButton.addEventListener("click", () => {
  chatMessages.replaceChildren();
  const welcome = document.createElement("div");
  welcome.className = "welcome-block";
  welcome.id = "welcome-block";
  welcome.innerHTML = `
    <div class="welcome-icon" aria-hidden="true">✳</div>
    <h1>Hello! How can I help you today?</h1>
    <p>Choose a question covered by the chatbot's built-in rules.</p>
    <div class="suggestions" aria-label="Suggested questions">
      <button class="suggestion" type="button" data-question="How are you?">How are you?</button>
      <button class="suggestion" type="button" data-question="What is Python?">What is Python?</button>
      <button class="suggestion" type="button" data-question="What is artificial intelligence?">What is artificial intelligence?</button>
    </div>`;
  chatMessages.append(welcome);
  welcome.querySelectorAll(".suggestion").forEach((button) => {
    button.addEventListener("click", () => sendMessage(button.dataset.question));
  });
  messageInput.focus();
});