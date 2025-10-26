# 🎙️ Áudio - Documentação

Esta pasta contém toda a documentação relacionada ao processamento de áudio e transcrição do PhysioNote.AI.

## 📄 Arquivos

### api-processamento-audio.md
Documentação da API de processamento de áudio, incluindo upload, armazenamento e manipulação de arquivos.

### funcionalidade-upload-audio.md
Como funciona o upload de arquivos de áudio na aplicação.

### integracao-whisper.md
Integração com a API Whisper da OpenAI para transcrição de áudio em texto.

### fluxo-transcricao.md
Fluxo completo desde a gravação/upload do áudio até a geração do texto transcrito.

## 🎯 Objetivo

Processar áudio de consultas fisioterapêuticas e convertê-lo em texto de alta qualidade para geração automática de documentação.

## 🛠️ Tecnologias

- **Whisper AI (OpenAI)** - Transcrição de áudio para texto
- **Node.js File System** - Gerenciamento de arquivos
- **Multer** - Upload de arquivos
- **FFmpeg** - Manipulação de áudio (se necessário)

## 🔗 Módulos Relacionados

- [Sessões](../sessoes/) - Onde o áudio é capturado
- [Backend](../backend/) - Processamento server-side
- [Prontuário](../prontuario/) - Destino final do texto transcrito

---
[← Voltar para Documentação](../README.md)
