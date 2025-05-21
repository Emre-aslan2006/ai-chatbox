const chatbox = document.getElementById("chatbox");
const form = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (message === "") return;
  addMessage("user", message);
  userInput.value = "";
  addMessage("bot", "Typing...");

  try {
    const reply = await getBotReply(message);
    updateLastBotMessage(reply);
  } catch (err) {
    updateLastBotMessage("Error: Could not connect to API.");
    console.error(err);
  }
});

function addMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.innerText = text;
  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function updateLastBotMessage(text) {
  const messages = document.querySelectorAll(".bot");
  const lastBotMsg = messages[messages.length - 1];
  if (lastBotMsg) lastBotMsg.innerText = text;
}

async function getBotReply(input) {
  const response = await fetch("https://ai-chatbox-server.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: input }] })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Something went wrong.";
}
