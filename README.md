# Lista Fácil

O **Lista Fácil** é uma aplicação web responsiva (mobile-friendly) desenvolvida para facilitar a criação, organização e gerenciamento de listas do dia a dia, como listas de compras, tarefas e lembretes. 

A interface é totalmente otimizada para dispositivos móveis e desktops, oferecendo uma experiência fluida e moderna.

## Tecnologias Utilizadas

A aplicação foi construída utilizando as seguintes tecnologias:

- **React (Vite)**: Framework para construção da interface de usuário de forma rápida e otimizada.
- **Firebase (Auth & Firestore)**: Utilizado para autenticação segura de usuários e armazenamento em tempo real das listas de tarefas.
- **Tailwind CSS & Radix UI**: Para estilização moderna, responsiva e componentes acessíveis.
- **TanStack Query (React Query)**: Gerenciamento de estado assíncrono e cache de dados.
- **React Router DOM**: Para controle de rotas e navegação da aplicação.
- **Framer Motion**: Adição de animações fluidas e interações premium.
- **date-fns**: Manipulação e formatação de datas.

## Estrutura do Projeto

A organização de pastas segue a estrutura padrão do ecossistema React:

- `/src/components`: Componentes reutilizáveis (como layout, inputs, feedbacks, etc.).
- `/src/hooks`: Custom hooks para encapsular lógicas específicas.
- `/src/lib`: Configurações de bibliotecas de terceiros (Firebase, cliente do React Query, utilitários globais).
- `/src/pages`: As visualizações principais da aplicação (`Dashboard`, `ListDetail`, `History`, `Profile`, `Login`).
- `/src/utils`: Funções utilitárias auxiliares.

> [!NOTE]
> O projeto utiliza **Path Aliases (`@/*`)**. Você pode fazer importações absolutas a partir da raiz de `src` (ex: `import Button from '@/components/ui/button'`).

## Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (versão 18 ou superior recomendada).
- Um gerenciador de pacotes (como `npm`, `yarn` ou `pnpm`).

### Passo a Passo

1. **Clone o repositório** (se ainda não o fez) e acesse a pasta raiz do projeto.

2. **Configure as Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto contendo as credenciais do seu projeto Firebase:
   ```env
   VITE_FIREBASE_API_KEY="SUA_API_KEY"
   VITE_FIREBASE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
   VITE_FIREBASE_PROJECT_ID="SEU_PROJECT_ID"
   VITE_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
   VITE_FIREBASE_MESSAGING_SENDER_ID="SEU_SENDER_ID"
   VITE_FIREBASE_APP_ID="SEU_APP_ID"
   ```

3. **Instale as dependências**:
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Abra o link exibido no console (normalmente `http://localhost:5173`) no seu navegador.

## Scripts Disponíveis

No arquivo [package.json](file:///d:/lucas/Documents/lista-facil/package.json), estão definidos os seguintes scripts:

* `npm run dev`: Executa o servidor de desenvolvimento local com Vite.
* `npm run build`: Compila e otimiza a aplicação para produção na pasta `dist`.
* `npm run preview`: Executa localmente o build de produção gerado.
* `npm run lint`: Analisa o código em busca de problemas com o ESLint.
* `npm run lint:fix`: Corrige automaticamente os problemas de estilo e linting encontrados pelo ESLint.
* `npm run typecheck`: Executa a validação de tipos usando o compilador TypeScript baseado no arquivo `jsconfig.json`.