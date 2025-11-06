document.addEventListener('DOMContentLoaded', () => {

  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');
  const langOptions = document.querySelectorAll('.lang-option');
  const currentLangFlag = document.getElementById('current-lang-flag'); // Agora é uma <img>
  const micBtn = document.getElementById('mic-btn');
  const voiceToggleBtn = document.getElementById('voice-toggle');
  const openChatBtn = document.getElementById('chat-bubble');
  const closeChatBtn = document.getElementById('close-chat');
  const chatWindow = document.getElementById('chat-window');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  let currentLang = 'pt-BR';

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
      langMenu.classList.add('hidden');
    }
  });

  langOptions.forEach(option => {
    option.addEventListener('click', () => {
      currentLang = option.getAttribute('data-lang');

      // --- ATUALIZADO: Pega o SRC da imagem da bandeira clicada ---
      const newFlagSrc = option.querySelector('.flag-img').src;
      currentLangFlag.src = newFlagSrc; // Atualiza a imagem do botão principal
      // ----------------------------------------------------------

      langOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      langMenu.classList.add('hidden');

      if (recognition) {
        recognition.lang = currentLang;
      }
      console.log("Idioma alterado para:", currentLang);
    });
  });

  openChatBtn.addEventListener('click', () => {
    chatWindow.classList.add('open');
    openChatBtn.classList.add('open');
  });
  closeChatBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
    openChatBtn.classList.remove('open');
    speechSynthesis.cancel();
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userInput = chatInput.value.trim();
    if (userInput) {
      addMessage(userInput, 'user');
      chatInput.value = '';
      getBotResponse(userInput);
    }
  });

  function addMessage(message, sender) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper', sender);
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    const messageWithLinks = message.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank">$1</a>'
    );
    messageContent.innerHTML = `<p>${messageWithLinks}</p>`;
    messageWrapper.appendChild(messageContent);
    chatMessages.appendChild(messageWrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  const API_URL = "https://maikongino-chatbot-convita-fatec.hf.space/ask";

  async function getBotResponse(userInput) {
    addMessage("Pensando...", "bot");
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question: userInput})
      });
      if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
      const data = await response.json();
      const thinkingMessage = chatMessages.lastChild;
      chatMessages.removeChild(thinkingMessage);
      addMessage(data.answer, 'bot');

      if (isVoiceEnabled) {
        const textToSpeak = data.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        const langCode = mapLangCode(data.lang);
        speak(textToSpeak, langCode);
      }
    } catch (error) {
      console.error("Erro ao conectar com o cérebro:", error);
      const thinkingMessage = chatMessages.lastChild;
      if (thinkingMessage) chatMessages.removeChild(thinkingMessage);
      addMessage("Desculpe, estou com problemas para me conectar ao meu cérebro. 🧠 Tente novamente mais tarde.", "bot");
    }
  }

  let isVoiceEnabled = false;
  let voices = [];

  function mapLangCode(lang) {
    const langMap = {'en': 'en-US', 'pt': 'pt-BR', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE', 'it': 'it-IT'};
    return langMap[lang] || 'pt-BR';
  }

  function speak(text, langCode = 'pt-BR') {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    let selectedVoice = voices.find(voice => voice.lang === langCode);
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.startsWith(langCode.split('-')[0]));
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    speechSynthesis.speak(utterance);
  }

  function loadVoices() {
    voices = speechSynthesis.getVoices();
  }

  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();

  voiceToggleBtn.addEventListener('click', () => {
    isVoiceEnabled = !isVoiceEnabled;
    voiceToggleBtn.classList.toggle('active');
    if (isVoiceEnabled) {
      voiceToggleBtn.setAttribute('aria-label', 'Desativar voz do assistente');
      if (voices.length === 0) loadVoices();
      setTimeout(() => speak("Voz ativada.", 'pt-BR'), 100);
    } else {
      voiceToggleBtn.setAttribute('aria-label', 'Ativar voz do assistente');
      speechSynthesis.cancel();
    }
  });

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = currentLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micBtn.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        if (micBtn.classList.contains('is-listening')) {
          recognition.stop();
        } else {
          recognition.lang = currentLang;
          recognition.start();
        }
      } catch (err) {
        console.error("Erro ao iniciar reconhecimento: ", err);
        if (err.name === 'not-allowed') {
          addMessage("Para usar a voz, você precisa me dar permissão para usar o microfone.", "bot");
        }
      }
    });

    recognition.onstart = () => {
      micBtn.classList.add('is-listening');
      micBtn.disabled = true;
      langBtn.disabled = true;
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      const submitEvent = new Event('submit', {bubbles: true, cancelable: true});
      chatForm.dispatchEvent(submitEvent);
    };

    recognition.onend = () => {
      micBtn.classList.remove('is-listening');
      micBtn.disabled = false;
      langBtn.disabled = false;
    };

    recognition.onerror = (event) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      micBtn.classList.remove('is-listening');
      micBtn.disabled = false;
      langBtn.disabled = false;
    };

  } else {
    console.warn("Seu navegador não suporta a Web Speech API.");
    micBtn.style.display = 'none';
    langBtn.style.display = 'none';
  }
});
