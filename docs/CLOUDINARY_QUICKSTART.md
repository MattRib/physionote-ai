# 🚀 Guia Rápido - Cloudinary

## ✅ Status da Integração

A integração do Cloudinary está **completa e pronta para uso**!

> **Atualização 26/10/2025**: Corrigido bug que causava salvamento local mesmo com Cloudinary configurado. Agora os arquivos vão **APENAS** para o Cloudinary. Ver [documentação da correção](./bugfixes/correcao-cloudinary-salvamento-local.md).

## 📋 Checklist de Configuração

### 1. Obter Credenciais do Cloudinary

1. Acesse [cloudinary.com](https://cloudinary.com/)
2. Crie uma conta gratuita (ou faça login)
3. No Dashboard, copie:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Configurar Variáveis de Ambiente

Abra o arquivo `.env.local` e adicione:

```env
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"
```

> **Nota**: Você já deve ter `DATABASE_URL` e `OPENAI_API_KEY` configurados.

### 3. Verificar Instalação

O pacote `cloudinary` já está instalado. Para confirmar:

```bash
npm list cloudinary
```

Deve retornar algo como: `cloudinary@2.x.x`

## 🧪 Testar a Integração

### Passo 1: Iniciar o Servidor

```bash
npm run dev
```

### Passo 2: Criar uma Sessão com Upload

1. Acesse `http://localhost:3000/dashboard`
2. Clique em "Nova Sessão"
3. Selecione um paciente
4. Escolha "Upload de Arquivo"
5. Selecione um arquivo de áudio (MP3, WAV, WebM, etc.)
6. Envie o arquivo

### Passo 3: Verificar no Cloudinary

1. Acesse seu Dashboard do Cloudinary
2. Vá para "Media Library"
3. Navegue até a pasta `physionote/sessions/`
4. Você deve ver o arquivo que acabou de fazer upload

### Passo 4: Verificar no Banco de Dados

O campo `audioUrl` na sessão deve conter uma URL do Cloudinary:

```
https://res.cloudinary.com/{seu-cloud-name}/video/upload/v{version}/physionote/sessions/session-{uuid}.webm
```

## 🔄 Migrar Arquivos Locais Existentes (Opcional)

Se você já tem sessões com arquivos de áudio salvos localmente, pode migrá-los:

### Migrar Mantendo Arquivos Locais

```bash
npx tsx scripts/migrate-to-cloudinary.ts
```

### Migrar e Deletar Arquivos Locais

```bash
npx tsx scripts/migrate-to-cloudinary.ts --delete-local
```

> **Atenção**: Use `--delete-local` apenas se tiver certeza de que quer remover os arquivos locais após a migração.

## 📊 Monitorar Uso

### Verificar Quota

1. Acesse [cloudinary.com/console](https://cloudinary.com/console)
2. No Dashboard, você verá:
   - **Storage usado** / 25 GB
   - **Bandwidth usado** / 25 GB/mês
   - **Transformações** / 25.000/mês

### Estimativa de Uso

- **Arquivo de áudio médio**: 5-10 MB
- **Sessões possíveis** (plano gratuito): ~250-500 sessões
- **Recomendação**: Monitorar mensalmente

## 🐛 Solução de Problemas

### Erro: "Cloudinary não está configurado"

**Causa**: Variáveis de ambiente não configuradas ou incorretas

**Solução**:
1. Verifique se as variáveis estão no `.env.local`
2. Confirme que os valores estão corretos (sem aspas extras ou espaços)
3. Reinicie o servidor (`Ctrl+C` e `npm run dev`)

### Erro: "Invalid credentials"

**Causa**: API Key ou Secret incorretos

**Solução**:
1. Acesse o Dashboard do Cloudinary
2. Copie novamente as credenciais
3. Atualize o `.env.local`
4. Reinicie o servidor

### Erro: "Arquivo muito grande"

**Causa**: Arquivo excede 25 MB

**Solução**:
1. Reduza a qualidade/tamanho do áudio antes do upload
2. Ou ajuste o limite em `src/app/api/sessions/route.ts` (linha ~219)

### Servidor não inicia

**Causa**: Cache antigo do Next.js

**Solução**:
```bash
# Limpar cache
rm -rf .next

# Ou no Windows
Remove-Item -Recurse -Force .next

# Reiniciar
npm run dev
```

## 📚 Documentação Completa

Para mais detalhes, consulte:
- [docs/audio/CLOUDINARY_INTEGRATION.md](./docs/audio/CLOUDINARY_INTEGRATION.md) - Documentação completa
- [.env.example](./.env.example) - Exemplo de variáveis de ambiente

## 🎯 Próximos Passos

Após configurar o Cloudinary:

1. ✅ Teste fazendo upload de uma sessão
2. ✅ Verifique se o arquivo aparece no Cloudinary
3. ✅ Teste a transcrição de áudio
4. ✅ (Opcional) Migre arquivos existentes
5. ✅ Monitore o uso no Dashboard do Cloudinary

## ✨ Benefícios

Com o Cloudinary integrado, você tem:

- ☁️ **Storage na nuvem** - Sem limites de disco local
- 🚀 **CDN global** - Acesso rápido de qualquer lugar
- 🔒 **Segurança** - URLs HTTPS com controle de acesso
- 💰 **Custo-benefício** - Plano gratuito generoso (25GB)
- 📈 **Escalabilidade** - Cresce com seu projeto

---

**Última atualização**: 2025-10-26
**Versão**: 1.0.0

Está tudo pronto! Configure suas credenciais e comece a usar. 🎉
