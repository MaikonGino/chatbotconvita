// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Elementos do DOM ---
  const openChatBtn = document.getElementById('chat-bubble');
  const closeChatBtn = document.getElementById('close-chat');
  const chatWindow = document.getElementById('chat-window');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const voiceToggleBtn = document.getElementById('voice-toggle');
  const micBtn = document.getElementById('mic-btn');

  // --- 2. Lógica para Abrir/Fechar o Chat ---
  openChatBtn.addEventListener('click', () => {
    chatWindow.classList.add('open');
    openChatBtn.classList.add('open');
  });

  closeChatBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
    openChatBtn.classList.remove('open');
    speechSynthesis.cancel(); // Para qualquer fala pendente
  });

  // --- 3. Lógica de Envio de Mensagem (Formulário) ---
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userInput = chatInput.value.trim();

    if (userInput) {
      addMessage(userInput, 'user');
      chatInput.value = '';
      getBotResponse(userInput);
    }
  });

  // --- 4. Adiciona Mensagem na Tela ---
  function addMessage(message, sender) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper', sender);

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');

    // NOVO: Converte Markdown de link [texto](url) para HTML <a>
    const messageWithLinks = message.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank">$1</a>'
    );
    messageContent.innerHTML = `<p>${messageWithLinks}</p>`;

    messageWrapper.appendChild(messageContent);
    chatMessages.appendChild(messageWrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // --- 5. Lógica Principal do Bot (CONECTADA COM O "CÉREBRO") ---
  const API_URL = "https://maikongino-chatbot-convita-fatec.hf.space/ask";

  async function getBotResponse(userInput) {
    addMessage("Pensando...", "bot");
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userInput })
      });

      if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);

      const data = await response.json();
      const thinkingMessage = chatMessages.lastChild;
      chatMessages.removeChild(thinkingMessage);
      addMessage(data.answer, 'bot');

      if (isVoiceEnabled) {
        // Remove o markdown do link antes de falar
        const textToSpeak = data.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        speak(textToSpeak);
      }

    } catch (error) {
      console.error("Erro ao conectar com o cérebro:", error);
      const thinkingMessage = chatMessages.lastChild;
      if (thinkingMessage) chatMessages.removeChild(thinkingMessage);
      addMessage("Desculpe, estou com problemas para me conectar ao meu cérebro. 🧠 Tente novamente mais tarde.", "bot");
    }
  }

  // --- 6. LÓGICA DE SAÍDA DE ÁUDIO (TEXT-TO-SPEECH) ---
  let isVoiceEnabled = false;

  function speak(text) {
    speechSynthesis.cancel(); // Limpa falas anteriores
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    speechSynthesis.speak(utterance);
  }

  voiceToggleBtn.addEventListener('click', () => {
    isVoiceEnabled = !isVoiceEnabled;
    voiceToggleBtn.classList.toggle('active'); // O CSS cuida de trocar o ícone

    if (isVoiceEnabled) {
      voiceToggleBtn.setAttribute('aria-label', 'Desativar voz do assistente');
      speak("Voz ativada.");
    } else {
      voiceToggleBtn.setAttribute('aria-label', 'Ativar voz do assistente');
      speechSynthesis.cancel();
    }
  });

  // --- 7. LÓGICA DE ENTRADA DE ÁUDIO (SPEECH-TO-TEXT) ---
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Impede o formulário de enviar
      try {
        if (micBtn.classList.contains('is-listening')) {
          recognition.stop();
        } else {
          recognition.start();
        }
      } catch(err) {
        console.error("Erro ao iniciar reconhecimento: ", err);
      }
    });

    recognition.onstart = () => {
      micBtn.classList.add('is-listening');
      micBtn.disabled = true;
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      chatForm.dispatchEvent(submitEvent);
    };

    recognition.onend = () => {
      micBtn.classList.remove('is-listening');
      micBtn.disabled = false;
    };

    recognition.onerror = (event) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      micBtn.classList.remove('is-listening');
      micBtn.disabled = false;
    };

  } else {
    console.warn("Seu navegador não suporta a Web Speech API (reconhecimento de voz).");
    micBtn.style.display = 'none';
  }
});
