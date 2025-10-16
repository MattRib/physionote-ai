# Audio Upload Feature

## 📋 Visão Geral

Esta funcionalidade permite que os usuários façam upload de arquivos de áudio pré-gravados para criar novas sessões, além da opção de gravação ao vivo existente.

## 🎯 Motivação

Anteriormente, o sistema suportava apenas gravação ao vivo durante a consulta. Com esta implementação, os usuários agora podem:
- Fazer upload de áudios gravados em dispositivos externos (celular, gravador, etc.)
- Processar áudios de sessões que ocorreram fora do sistema
- Ter flexibilidade no momento de documentação (gravar durante ou após a consulta)

## 🏗️ Arquitetura

### Frontend (`NewSessionFlow.tsx`)

#### Estados Adicionados
```typescript
const [recordingMode, setRecordingMode] = useState<RecordingMode>('live');
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [isDragging, setIsDragging] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const fileInputRef = useRef<HTMLInputElement>(null);
```

#### Validações
- **Tipos aceitos**: MP3, WAV, M4A, OGG, WebM
- **Tamanho máximo**: 25MB
- **Formato**: `audio/*` MIME types

```typescript
const ACCEPTED_AUDIO_TYPES = [
  'audio/mpeg',   // MP3
  'audio/wav',    // WAV
  'audio/mp4',    // M4A
  'audio/m4a',    // M4A
  'audio/ogg',    // OGG
  'audio/webm'    // WebM
];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
```

#### Funções Principais

**`validateFile(file: File): string | null`**
- Valida tipo de arquivo e tamanho
- Retorna mensagem de erro ou `null` se válido

**`handleFileSelect(file: File)`**
- Processa arquivo selecionado
- Executa validação
- Atualiza estado `selectedFile`

**`handleFileDrop(e: DragEvent)`**
- Gerencia drag & drop
- Previne comportamento padrão do navegador
- Valida e processa arquivo

**`handleRemoveFile()`**
- Remove arquivo selecionado
- Reseta estados relacionados

**`formatFileSize(bytes: number): string`**
- Converte bytes para formato legível (KB, MB)

### UI Components

#### Seção 2: Método de Captura de Áudio

**Tab: Gravar Agora**
- Ícone: Microfone
- Comportamento: Mantém fluxo de gravação ao vivo existente
- Info card explicando que a gravação começará automaticamente

**Tab: Upload de Arquivo**
- Ícone: Upload
- Estados:
  1. **Zona de Drop (vazia)**: Área com borda tracejada, mensagem "Arraste um arquivo de áudio aqui"
  2. **Preview do Arquivo**: Card com informações do arquivo selecionado

**Zona de Drop (Empty State)**
```tsx
<div className="drag-drop-zone">
  <Upload size={48} />
  <p>Arraste um arquivo de áudio aqui</p>
  <p>ou clique para selecionar</p>
  <small>MP3, WAV, M4A, OGG - Máx. 25MB</small>
</div>
```

**Preview Card (File Selected)**
```tsx
<div className="file-preview">
  <Music icon />
  <div>
    <p className="filename">{truncatedFilename}</p>
    <p className="filesize">{formattedSize}</p>
  </div>
  <button onClick={handleRemoveFile}>
    <X icon />
  </button>
</div>
```

### Backend (`/api/sessions/route.ts`)

#### Processamento Dual

A API agora suporta dois modos de entrada:

**Modo JSON (Live Recording)**
```typescript
POST /api/sessions
Content-Type: application/json

{
  "patientId": "cuid",
  "sessionType": "consulta",
  "specialty": "Fisioterapia",
  "motivation": "Dor lombar",
  "recordingMode": "live"
}
```

**Modo FormData (Upload)**
```typescript
POST /api/sessions
Content-Type: multipart/form-data

FormData {
  patientId: "cuid",
  sessionType: "consulta",
  specialty: "Fisioterapia",
  motivation: "Dor lombar",
  audio: File,
  recordingMode: "upload"
}
```

#### Validações Backend
1. **Tipo de conteúdo**: Detecta `multipart/form-data` vs `application/json`
2. **Arquivo obrigatório**: Se modo upload, arquivo é required
3. **Tipo de arquivo**: Valida MIME type (`audio/*`)
4. **Tamanho**: Máximo 25MB
5. **Paciente existe**: Verifica no banco de dados

#### Status da Sessão
- **Live**: Status inicial `"recording"`
- **Upload**: Status inicial `"processing"`

#### Processamento do Arquivo (TODO)

Atualmente implementado com placeholder:
```typescript
if (recordingMode === 'upload' && audioFile) {
  console.log(`[Audio Upload] Session: ${session.id}, File: ${audioFile.name}`);
  console.warn('[TODO] Implement audio file storage and processing');
}
```

**Próximos passos**:
1. Salvar arquivo no storage (filesystem ou S3)
2. Criar registro de transcrição no banco
3. Iniciar processamento assíncrono com Whisper
4. Gerar nota com OpenAI após transcrição

## 🎨 Design

### Cores e Estilos

**Tab Ativa (Gradient)**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
color: white
```

**Tab Inativa**
```css
background: #F3F4F6
color: #6B7280
hover:background: #E5E7EB
```

**Zona de Drop**
- Normal: `border-dashed border-2 border-gray-300`
- Dragging: `border-[#667eea] bg-blue-50`

**Preview Card**
```css
background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)
border: 1px solid #6EE7B7
```

### Animações
- Transições: `300ms ease-in-out`
- Hover effects: Scale 1.05 em botões
- Drag feedback: Mudança de cor e background

## 🧪 Testes

### Cenários de Teste

1. **Upload via Drag & Drop**
   - Arrastar arquivo MP3 válido
   - Verificar preview aparece
   - Confirmar criação de sessão

2. **Upload via Click**
   - Clicar em zona de drop
   - Selecionar arquivo no file picker
   - Validar upload

3. **Validação de Tipo**
   - Tentar upload de arquivo não-áudio (.pdf, .txt)
   - Verificar mensagem de erro

4. **Validação de Tamanho**
   - Upload arquivo > 25MB
   - Confirmar rejeição

5. **Remoção de Arquivo**
   - Selecionar arquivo
   - Clicar em botão remover
   - Verificar volta para empty state

6. **Modo Live (Regressão)**
   - Alternar para tab "Gravar Agora"
   - Confirmar fluxo original funciona

## 📊 Fluxo de Dados

```
User selects file
    ↓
validateFile() → Type & Size check
    ↓
setSelectedFile(file)
    ↓
User clicks "Iniciar Sessão"
    ↓
handleStartSession()
    ↓
Create FormData
    ↓
POST /api/sessions (multipart/form-data)
    ↓
Backend validates file
    ↓
Create Session (status: "processing")
    ↓
[TODO] Save file to storage
    ↓
[TODO] Start transcription + note generation
    ↓
Redirect to /dashboard/session?sessionId=xxx
```

## 🔐 Segurança

### Validações Implementadas
- ✅ Tipo de arquivo (MIME type)
- ✅ Tamanho máximo (25MB)
- ✅ Validação de paciente existente
- ✅ Sanitização de inputs (Zod schema)

### Pendente
- ⏳ Análise de conteúdo do arquivo (detectar malware)
- ⏳ Rate limiting para uploads
- ⏳ Quarentena de arquivos suspeitos

## 📝 Logs

### Console Logs Implementados

**Frontend**
```typescript
// Em validateFile()
console.error('Arquivo inválido:', errorMessage);

// Em handleFileSelect()
console.log('File selected:', file.name, file.size);
```

**Backend**
```typescript
// Sucesso
console.log(`[Session Created] ID: ${session.id}, Mode: ${recordingMode}`);

// Upload detectado
console.log(`[Audio Upload] Session: ${session.id}, File: ${audioFile.name}, Size: ${audioFile.size} bytes`);

// TODO reminder
console.warn('[TODO] Implement audio file storage and processing');
```

## 🚀 Próximas Melhorias

### Funcionalidades
1. **Progress Bar**: Indicador visual durante upload
2. **Storage Integration**: Salvar arquivos no filesystem ou S3
3. **Processamento Assíncrono**: Background job para transcrição
4. **Preview de Áudio**: Player para ouvir arquivo antes de enviar
5. **Multi-upload**: Suporte para múltiplos arquivos de uma vez

### UX
1. **Drag Feedback Animado**: Ripple effect ou pulse durante drag
2. **Upload Speed**: Mostrar velocidade de upload (MB/s)
3. **Retry**: Opção de tentar novamente em caso de falha
4. **Cancel**: Cancelar upload em andamento

### Técnico
1. **Chunked Upload**: Para arquivos grandes (>25MB)
2. **Resumable Upload**: Retomar upload interrompido
3. **Compression**: Comprimir áudio antes de enviar
4. **Validation Service**: Microserviço dedicado para validação

## 🐛 Troubleshooting

### Arquivo não é aceito
- **Causa**: MIME type não reconhecido
- **Solução**: Converter para MP3/WAV antes de upload

### Upload falha silenciosamente
- **Causa**: Tamanho excede limite
- **Solução**: Reduzir qualidade/comprimir áudio

### Preview não aparece
- **Causa**: JavaScript error em validateFile()
- **Solução**: Verificar console do navegador

### Sessão criada mas áudio não processa
- **Causa**: Backend TODO não implementado
- **Solução**: Aguardar implementação de storage + transcription

## 📚 Referências

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [File API](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text)

## 📅 Changelog

### v1.0.0 (2025-01-XX)
- ✅ Implementada UI com tabs (Live vs Upload)
- ✅ Drag & drop com validação de arquivo
- ✅ Preview de arquivo selecionado
- ✅ Backend aceita FormData + JSON
- ✅ Validações de tipo e tamanho
- ✅ Status diferenciado (recording vs processing)
- ⏳ Storage e processamento assíncrono (TODO)
