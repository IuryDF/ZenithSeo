import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Política de Privacidade</h1>
        <p className="text-gray-300 mb-8">Última atualização: 02/10/2025</p>

        <div className="mb-8">
          <Link
            href="/"
            aria-label="Voltar para a página inicial"
            title="Voltar para a página inicial"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 transition-colors"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Voltar para a página inicial</span>
          </Link>
        </div>

        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-white">Introdução</h2>
            <p className="text-gray-300">Esta Política descreve como coletamos, usamos e protegemos seus dados ao utilizar o ZenithSEO. Ao usar o serviço, você concorda com os termos abaixo.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Controlador e Contato</h2>
            <p className="text-gray-300">Controlador: <span className="font-semibold">ZenithSEO</span>. Para questões de privacidade, envie um email para <a href="mailto:suporte@zenithseo.com.br" className="text-blue-400 hover:underline">suporte@zenithseo.com.br</a> ou abra um ticket em <a href="/support" className="text-blue-400 hover:underline">Suporte</a>.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Dados que coletamos</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><span className="font-semibold">Dados de conta</span>: nome, email, credenciais de autenticação.</li>
              <li><span className="font-semibold">Dados de uso</span>: prompts gerados, tipos de conteúdo, métricas agregadas de performance e preferências.</li>
              <li><span className="font-semibold">Dados de pagamento</span> (Plano Pro): processados pelo Stripe. Não armazenamos números de cartão.</li>
              <li><span className="font-semibold">Logs e suporte</span>: tickets enviados, comunicações e metadados técnicos (ex.: IP, navegador).</li>
              <li><span className="font-semibold">Cookies</span>: essenciais para sessão e analíticos para melhora de produto.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Bases legais (LGPD/GDPR)</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Execução de contrato: prestação do serviço contratado.</li>
              <li>Legítimo interesse: melhoria de produto e segurança, com equilíbrio.</li>
              <li>Consentimento: funcionalidades opcionais e comunicações de marketing.</li>
              <li>Obrigação legal: registros exigidos por lei.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Como usamos seus dados</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Fornecer, manter e melhorar o ZenithSEO.</li>
              <li>Personalizar experiências e recomendar templates.</li>
              <li>Comunicações operacionais e suporte técnico.</li>
              <li>Monitorar abusos, fraudes e garantir segurança.</li>
              <li>Análises agregadas para qualidade de prompts e funcionalidades.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Compartilhamento e Provedores</h2>
            <p className="text-gray-300">Compartilhamos dados com provedores estritamente necessários para operar o serviço, sob contratos e conformidade:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li><span className="font-semibold">Supabase</span> (banco de dados, autenticação).</li>
              <li><span className="font-semibold">Stripe</span> (pagamentos e faturamento Pro).</li>
              <li><span className="font-semibold">OpenAI</span> (processamento de prompts e geração de conteúdo).</li>
              <li><span className="font-semibold">Plataforma de hospedagem</span> (ex.: Vercel) para entrega da aplicação.</li>
              <li><span className="font-semibold">Serviço de email</span> (ex.: Resend ou provedor equivalente) para notificações.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Transferências Internacionais</h2>
            <p className="text-gray-300">Alguns provedores podem operar fora do seu país (ex.: EUA). Adotamos medidas como cláusulas contratuais e criptografia em trânsito (HTTPS) para proteger seus dados.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Segurança</h2>
            <p className="text-gray-300">Aplicamos autenticação, controle de acesso, criptografia em trânsito e práticas de desenvolvimento seguro. Embora nenhum sistema seja 100% seguro, trabalhamos continuamente para reduzir riscos.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Seus direitos</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Acessar, corrigir, atualizar ou excluir dados pessoais.</li>
              <li>Solicitar portabilidade ou cópia de dados.</li>
              <li>Revogar consentimento e restringir certos tratamentos.</li>
              <li>Registrar reclamação junto à autoridade competente (ex.: ANPD).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Retenção</h2>
            <p className="text-gray-300">Mantemos dados enquanto sua conta estiver ativa e conforme necessário para obrigações legais e defesa de direitos. Ao encerrar a conta, eliminamos ou anonimizamos dados, salvo exigência legal.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Cookies</h2>
            <p className="text-gray-300">Usamos cookies essenciais (login/segurança) e analíticos para entender o uso e melhorar o produto. Você pode gerenciar cookies no navegador; funcionalidades podem ser impactadas se desativados.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Uso por Crianças</h2>
            <p className="text-gray-300">O ZenithSEO não é direcionado a menores de 13 anos. Se você acredita que um menor nos forneceu dados, contate-nos para remoção.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Atualizações desta Política</h2>
            <p className="text-gray-300">Podemos atualizar esta Política para refletir mudanças no serviço ou requisitos legais. Publicaremos a versão atualizada e, quando apropriado, notificaremos você.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Contato</h2>
            <p className="text-gray-300">Envie um email para <a href="mailto:suporte@zenithseo.com.br" className="text-blue-400 hover:underline">suporte@zenithseo.com.br</a> ou abra um ticket em <a href="/support" className="text-blue-400 hover:underline">Suporte</a>.</p>
          </div>
        </section>
      </div>
    </div>
  )
}