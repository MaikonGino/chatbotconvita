# Assistente Virtual Convita (Chatbot PNL) 🤖

![Status](https://img.shields.io/badge/Status-Concluído-brightgreen?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/MaikonGino/chatbotconvita?style=for-the-badge)

Este é um projeto acadêmico de chatbot desenvolvido para a disciplina de **Processamento de Linguagem Natural (PNL)** da **FATEC Araras**. O bot simula um assistente virtual para o site [Convita](https://convitads.web.app/home), capaz de interagir em linguagem natural, entender sentimentos e responder perguntas sobre os serviços da empresa.

## ✨ Funcionalidades Principais

Este projeto foi além de um simples bot de regras, incorporando duas camadas de processamento para criar uma experiência de usuário mais "mestre" e humanizada:

* **Interação Humanizada (Camada 1):** O bot responde de forma natural e instantânea a saudações ("Olá", "Boa noite"), despedidas ("tchau"), agradecimentos ("obrigado") e detecção de sentimentos simples ("chat ruim", "ótimo", "credo").
* **Conhecimento de Negócios (Camada 1):** Respostas manuais programadas para as perguntas de negócios mais críticas (como "Orçamentos", "Formas de Pagamento" e "Cidade"), garantindo 100% de precisão.
* **Conhecimento de IA (Camada 2):** Para todas as outras perguntas ("o que vocês fazem?", "tem portfólio?"), o bot utiliza um modelo de Q&A (Question-Answering) treinado para "ler" um contexto de conhecimento centralizado e encontrar a resposta correta.
* **Comandos de Voz (Acessibilidade):** Permite a entrada de perguntas via microfone (Speech-to-Text).
* **Leitura de Respostas (Acessibilidade):** Possui um botão para ligar/desligar a leitura das respostas do bot (Text-to-Speech), com uma UX/UI clara.
* **Design Responsivo:** A interface do chat funciona perfeitamente em dispositivos móveis (Mobile First) e desktops.

## 🏗️ Arquitetura do Projeto

Este projeto foi construído com uma arquitetura desacoplada (Headless), separando o "Rosto" (Front-end) do "Cérebro" (Back-end).

* **Front-end (O "Rosto"):**
    * Construído em **HTML5**, **CSS3** (Mobile First) e **JavaScript** puro.
    * Responsável pela interface do chat (UX/UI) e pelas APIs de voz do navegador (Web Speech API).
    * Hospedado de forma estática no **GitHub Pages**.

* **Back-end (O "Cérebro"):**
    * Uma API REST construída em **Python** com o micro-framework **Flask**.
    * Utiliza a biblioteca **Transformers** da **Hugging Face** para rodar os modelos de PNL (Q&A e Análise de Sentimento).
    * Hospedado de forma permanente no **Hugging Face Spaces**.

## 🛠️ Tecnologias Utilizadas

### Back-end (Cérebro)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-Transformers-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)

### Front-end (Rosto)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Hospedagem (Deploy)
![Hugging Face Spaces](https://img.shields.io/badge/Hugging%20Face-Spaces-yellow?style=for-the-badge&logo=huggingface&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)

## 👨‍💻 Autor

Projeto desenvolvido por **Maikon Gino**.
