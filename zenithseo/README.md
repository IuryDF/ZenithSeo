# ZenithSEO - Gerador de Prompts para SEO

Uma plataforma moderna para gerar prompts criativos e eficazes para SEO e marketing digital, construída com Next.js, Supabase, Stripe e OpenAI.

## 🚀 Funcionalidades

- **Geração de Prompts com IA**: Utilize o poder da OpenAI para gerar prompts personalizados
- **Sistema de Autenticação**: Login/cadastro seguro com Supabase
- **Planos de Assinatura**: Integração com Stripe para planos Free e Pro
- **Dashboard Intuitivo**: Interface moderna para gerenciar prompts
- **Histórico de Prompts**: Visualize e gerencie todos os prompts gerados
- **Proteção de Rotas**: Middleware para proteger páginas autenticadas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Pagamentos**: Stripe
- **IA**: OpenAI GPT-3.5-turbo

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Conta no Stripe
- Chave da API OpenAI

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd zenithseo
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase

# OpenAI
OPENAI_API_KEY=sua_chave_da_openai

# Stripe
STRIPE_SECRET_KEY=sua_chave_secreta_do_stripe
STRIPE_PUBLISHABLE_KEY=sua_chave_publica_do_stripe
STRIPE_WEBHOOK_SECRET=seu_webhook_secret_do_stripe

# NextAuth
NEXTAUTH_SECRET=seu_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Configure o banco de dados Supabase

Execute o SQL contido no arquivo `database.sql` no editor SQL do Supabase para criar as tabelas e configurações necessárias.

### 5. Configure o Stripe

1. Crie produtos no Stripe Dashboard:
   - Produto "Pro Plan" com preço mensal
   - Configure webhooks para: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`

### 6. Execute o projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm run start
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   │   ├── generate/      # Geração de prompts
│   │   ├── prompts/       # Busca de prompts
│   │   ├── stripe/        # Integração Stripe
│   │   └── user/          # Dados do usuário
│   ├── billing/           # Página de cobrança
│   ├── dashboard/         # Dashboard principal
│   ├── login/             # Página de login
│   └── signup/            # Página de cadastro
├── components/            # Componentes React
│   ├── AuthProvider.tsx   # Provider de autenticação
│   ├── PromptForm.tsx     # Formulário de geração
│   └── PromptHistory.tsx  # Histórico de prompts
├── lib/                   # Utilitários e configurações
│   ├── auth.ts           # Funções de autenticação
│   ├── openai.ts         # Cliente OpenAI
│   ├── stripe.ts         # Cliente Stripe
│   └── supabase.ts       # Cliente Supabase
└── middleware.ts          # Middleware de proteção
```

## 🔐 Autenticação e Autorização

- **Rotas Públicas**: `/`, `/login`, `/signup`
- **Rotas Protegidas**: `/dashboard`, `/billing`
- **Middleware**: Redirecionamento automático baseado no status de autenticação

## 💳 Planos de Assinatura

### Plano Free
- 10 prompts por mês
- Acesso básico ao gerador
- Histórico limitado

### Plano Pro (R$ 29,90/mês)
- Prompts ilimitados
- Acesso completo
- Histórico completo
- Suporte prioritário

## 🔄 API Endpoints

- `POST /api/generate` - Gerar novos prompts
- `GET /api/prompts` - Buscar histórico de prompts
- `GET /api/user` - Dados do usuário atual
- `POST /api/stripe/create-checkout-session` - Criar sessão de checkout
- `POST /api/stripe/webhook` - Webhook do Stripe

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras plataformas

Certifique-se de configurar:
- Variáveis de ambiente
- Build command: `npm run build`
- Start command: `npm run start`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email: suporte@zenithseo.com

---

Desenvolvido com ❤️ para otimizar seu SEO e marketing digital.
