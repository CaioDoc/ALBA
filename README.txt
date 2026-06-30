# ALBA - Associação Luso-Brasileira de Ayurveda 🌿

Bem-vindo ao repositório oficial da plataforma web da **Associação Luso-Brasileira de Ayurveda (ALBA)**. 

Este projeto é uma solução digital completa que une um portal institucional moderno e um painel de gestão administrativa (CMS próprio). Desenvolvido com foco em UX/UI de alto padrão, velocidade e responsividade, o sistema visa conectar profissionais, estudantes e pacientes da medicina ayurvédica no Brasil e na Europa.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as ferramentas mais modernas do ecossistema front-end:

* **[Next.js (App Router)](https://nextjs.org/):** Framework React para renderização híbrida, rotas nativas e otimização de SEO.
* **[React 18](https://react.dev/):** Biblioteca principal para a construção de interfaces de usuário componentizadas.
* **[Tailwind CSS](https://tailwindcss.com/):** Framework de CSS utilitário para estilização rápida, responsiva e design system padronizado.
* **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática para garantir segurança e escalabilidade no código.
* **[Matter.js](https://brm.io/matter-js/):** Motor de física 2D (utilizado originalmente para interações lúdicas/experimentais na plataforma).

---

## 🌟 Principais Funcionalidades

### 1. Vitrine Pública (Site Institucional)
* **Home Page de Alta Conversão:** Hero section com design em split-screen, carrossel de cursos em destaque e agenda pública interativa.
* **Filosofia & Glossário:** Apresentação da essência do Ayurveda com um glossário expansível (accordion) de termos em sânscrito.
* **Diretório de Profissionais:** Busca e filtragem em tempo real de terapeutas ativos, com *Drawer* (painel lateral) para visualização de perfis e contato direto via WhatsApp.
* **Atividades e Cursos:** Catálogos detalhados de formações e serviços, otimizados para rápida conversão e leitura em dispositivos móveis.

### 2. Painel Administrativo (CMS - `/admin`)
* **Dashboard Interativo:** Visão geral de métricas, atalhos de gestão e últimos *leads* recebidos.
* **Gestão de Associados:** CRM para aprovar, editar, suspender e gerenciar o status dos terapeutas credenciados.
* **Laboratório de Artigos (com IA):** Editor de textos integrado com um assistente virtual simulado para auxiliar na criação de conteúdo otimizado para SEO.
* **Gestão de Eventos e Cursos:** Telas dedicadas para atualizar a agenda pública e administrar status de vendas de turmas.
* **Disparos de WhatsApp:** Simulador de campanhas em massa para promover cursos e contatar associados.
* **Caixa de Entrada (Leads):** Leitor de mensagens integrado para atendimento rápido e direto por WhatsApp ou E-mail.

---

## 📁 Estrutura de Diretórios

O projeto segue a arquitetura recomendada pelo Next.js (App Router):

```text
📁 app/                     # Rotas e páginas da aplicação
├── 📄 layout.tsx           # Layout raiz (Navbar e Footer globais)
├── 📄 page.tsx             # Página Inicial (Home)
├── 📁 admin/               # Painel Administrativo (CMS)
│   ├── 📄 layout.tsx       # Layout restrito do Admin (Sidebar lateral)
│   ├── 📄 page.tsx         # Dashboard
│   ├── 📁 agenda/          # Gestão de Eventos
│   ├── 📁 artigos/         # Editor de Blog e Assistente IA
│   ├── 📁 associados/      # Gestão de Terapeutas
│   ├── 📁 cursos/          # Criação/Edição de Cursos
│   ├── 📁 leads/           # Caixa de entrada de formulários
│   └── 📁 promocoes/       # Disparos de WhatsApp
├── 📁 artigos/             # Blog Público
├── 📁 atividades/          # Serviços e Terapias
├── 📁 cursos/              # Vitrine de Formações e Workshops
├── 📁 profissionais/       # Diretório Oficial de Terapeutas
└── 📁 quem-somos/          # História da ALBA e Acreditação Europeia
│
📁 components/              # Componentes reutilizáveis de UI
├── 📄 Navbar.tsx
├── 📄 Footer.tsx
├── 📄 PublicAgenda.tsx
├── 📄 CourseCarousel.tsx
├── 📄 TherapistDirectory.tsx
└── 📄 ... (Drawers, Modals, Cards)


⚙️ Instalação e Execução Local
Siga as instruções abaixo para rodar o projeto na sua máquina local:

Pré-requisitos
Node.js (versão 18 ou superior)

npm, yarn ou pnpm instalado

Passos
Clone o repositório:
git clone [https://github.com/seu-usuario/alba-ayurveda.git](https://github.com/seu-usuario/alba-ayurveda.git)
   cd alba-ayurveda

Instale as dependências:
npm install
   # ou
   yarn install

Execute o servidor de desenvolvimento:
npm run dev
   # ou
   yarn dev

Acesse a aplicação:
Abra http://localhost:3000 no seu navegador para ver o site público.
Para acessar o painel administrativo, vá para http://localhost:3000/admin.

🛠️ Guia de Manutenção (Próximos Passos)
Esta versão do projeto é um Frontend/MVP de Alta Fidelidade. Isso significa que as lógicas visuais e os estados funcionam perfeitamente no navegador, mas os dados estão atualmente preenchidos diretamente no código (arquivos mockados nas próprias páginas).

Para evoluir este projeto para produção, recomenda-se:

Conexão com Banco de Dados: Substituir as variáveis initialCourses, initialAssociates, etc., por chamadas a uma API (ex: Supabase, Firebase, ou um backend em Node.js/Prisma).

Autenticação: Proteger as rotas de /admin utilizando ferramentas como NextAuth.js.

Integração Real de IA e WhatsApp: Conectar a tela de "Artigos com IA" à API da OpenAI e a tela de "Disparos" a uma API oficial do WhatsApp Cloud ou biblioteca Baileys (como no projeto Galpão do Cândido).

Desenvolvido com dedicação para elevar o padrão da saúde integrativa no mundo. 🕉️
