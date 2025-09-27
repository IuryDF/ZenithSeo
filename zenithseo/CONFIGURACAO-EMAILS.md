# 📧 Configuração de Templates de Email - ZenithSEO

Este guia explica como configurar templates de email personalizados no Supabase para melhorar a experiência do usuário com emails de confirmação e recuperação de senha.

## 📋 Visão Geral

O ZenithSEO inclui templates HTML personalizados e profissionais para:
- ✅ **Confirmação de cadastro** (`confirm-signup.html`)
- 🔐 **Recuperação de senha** (`reset-password.html`)

## 🎨 Templates Criados

### 1. Template de Confirmação de Cadastro
- **Arquivo**: `email-templates/confirm-signup.html`
- **Características**:
  - Design moderno com gradiente azul
  - Responsivo para mobile
  - Lista de funcionalidades da plataforma
  - Notas de segurança
  - Branding consistente com ZenithSEO

### 2. Template de Recuperação de Senha
- **Arquivo**: `email-templates/reset-password.html`
- **Características**:
  - Design com gradiente vermelho para urgência
  - Avisos de segurança destacados
  - Dicas para criação de senhas seguras
  - Instruções claras sobre validade do link

## ⚙️ Como Configurar no Supabase

### Passo 1: Acessar o Painel do Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **ZenithSEO**

### Passo 2: Navegar para Configurações de Email
1. No menu lateral, clique em **Authentication**
2. Clique na aba **Email Templates**
3. Você verá as opções para diferentes tipos de email

### Passo 3: Configurar Template de Confirmação
1. Clique em **Confirm signup**
2. Substitua o conteúdo padrão pelo código do arquivo `email-templates/confirm-signup.html`
3. **Importante**: Mantenha as variáveis do Supabase:
   - `{{ .ConfirmationURL }}` - Link de confirmação
   - `{{ .Email }}` - Email do usuário
   - `{{ .SiteURL }}` - URL do site (se necessário)

### Passo 4: Configurar Template de Recuperação de Senha
1. Clique em **Reset password**
2. Substitua o conteúdo padrão pelo código do arquivo `email-templates/reset-password.html`
3. **Importante**: Mantenha as variáveis do Supabase:
   - `{{ .ConfirmationURL }}` - Link de redefinição
   - `{{ .Email }}` - Email do usuário

### Passo 5: Configurar Remetente
1. Na seção **SMTP Settings**, configure:
   - **From email**: `noreply@zenithseo.com` (ou seu domínio)
   - **From name**: `ZenithSEO`
2. Se não tiver SMTP próprio, pode usar o padrão do Supabase

### Passo 6: Testar os Templates
1. Salve as configurações
2. Teste criando uma nova conta
3. Teste a recuperação de senha
4. Verifique se os emails chegam com o design correto

## 🎯 Variáveis Disponíveis

### Para Confirmação de Cadastro:
- `{{ .ConfirmationURL }}` - URL para confirmar a conta
- `{{ .Email }}` - Email do usuário
- `{{ .SiteURL }}` - URL base do site
- `{{ .Token }}` - Token de confirmação (se necessário)

### Para Recuperação de Senha:
- `{{ .ConfirmationURL }}` - URL para redefinir senha
- `{{ .Email }}` - Email do usuário
- `{{ .SiteURL }}` - URL base do site
- `{{ .Token }}` - Token de recuperação (se necessário)

## 🎨 Personalização Adicional

### Cores e Branding
Os templates usam as cores do ZenithSEO:
- **Azul primário**: `#3b82f6` (confirmação)
- **Vermelho**: `#ef4444` (recuperação de senha)
- **Cinzas**: `#f8fafc`, `#334155`, etc.

### Modificações Possíveis
1. **Logo**: Substitua o texto "ZenithSEO" por uma imagem
2. **Cores**: Ajuste o gradiente e cores conforme necessário
3. **Conteúdo**: Personalize textos e mensagens
4. **Links sociais**: Adicione links reais para suporte e documentação

## 📱 Responsividade

Os templates são totalmente responsivos e incluem:
- Media queries para telas pequenas
- Ajustes de padding e font-size
- Layout otimizado para mobile

## 🔒 Segurança

### Recursos de Segurança Incluídos:
- Avisos sobre validade dos links
- Instruções sobre o que fazer se não solicitou
- Dicas de segurança para senhas
- Informações sobre uso único dos links

## 🚀 Próximos Passos

Após configurar os templates:

1. **Teste completo**: Crie contas de teste e verifique os emails
2. **Feedback**: Colete feedback dos usuários sobre a experiência
3. **Monitoramento**: Acompanhe as taxas de confirmação
4. **Otimização**: Ajuste conforme necessário

## 📞 Suporte

Se encontrar problemas na configuração:
1. Verifique se as variáveis `{{ }}` estão corretas
2. Teste com emails diferentes
3. Consulte a documentação do Supabase
4. Verifique os logs de email no painel do Supabase

## 📝 Notas Importantes

- ⚠️ **Backup**: Sempre faça backup dos templates originais antes de modificar
- 🔄 **Versionamento**: Mantenha versões dos templates para rollback se necessário
- 📊 **Analytics**: Considere adicionar tracking de abertura de emails
- 🌐 **Domínio**: Para melhor deliverability, configure um domínio próprio para emails

---

**Criado para ZenithSEO** - Templates profissionais para uma melhor experiência do usuário! 🚀