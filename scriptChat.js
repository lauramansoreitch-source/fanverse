const chatForm = document.getElementById("chatForm");
const apiKeyInput = document.getElementById("apiKey");
const userMessageInput = document.getElementById("userMessage");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");
const statusMessage = document.getElementById("statusMessage");

function addMessage(role, text) {
  const message = document.createElement("div");
  message.className = `message message--${role}`;

  const label = document.createElement("span");
  label.className = "message__label";
  label.textContent = role === "user" ? "VOCÊ" : "ASSISTENTE";

  const paragraph = document.createElement("p");
  // textContent evita interpretar a resposta como HTML.
  paragraph.textContent = text;

  message.append(label, paragraph);
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const apiKey = apiKeyInput.value.trim();
  const userMessage = userMessageInput.value.trim();

  if (!apiKey || !userMessage) {
    statusMessage.textContent = "Informe a chave da API e uma mensagem.";
    return;
  }

  addMessage("user", userMessage);
  userMessageInput.value = "";
  sendButton.disabled = true;
  statusMessage.textContent = "Aguardando resposta...";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: userMessage
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.error?.message || `A API retornou o erro ${response.status}.`;
      throw new Error(errorMessage);
    }

    // A resposta da API pode conter vários itens de saída.
    const answer =
      data.output
        ?.flatMap((item) => item.content ?? [])
        .filter((content) => content.type === "output_text")
        .map((content) => content.text)
        .join("\n")
        || data.output_text;

    if (!answer) {
      throw new Error("Não foi possível encontrar texto na resposta da API.");
    }

    addMessage("assistant", answer);
    statusMessage.textContent = "";
  } catch (error) {
    addMessage("assistant", `Não foi possível obter uma resposta: ${error.message}`);
    statusMessage.textContent = "Verifique a chave e tente novamente.";
  } finally {
    sendButton.disabled = false;
    userMessageInput.focus();
  }
});