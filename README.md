# Lista Fácil (Dev_App_Mob)

Bem-vindo ao repositório do **Lista Fácil**, um aplicativo mobile desenvolvido para facilitar a criação, organização e o gerenciamento das suas listas do dia a dia (como listas de compras, tarefas e lembretes).

## Tecnologias Utilizadas

Este projeto está sendo construído sob um ecossistema moderno de desenvolvimento mobile JavaScript:

- **React / React Native**: Utilizado para a construção das interfaces (UI) através do `react-jsx`.
- **JavaScript (ESNext)**: Fazendo uso dos recursos mais recentes da linguagem ECMAScript.
- **date-fns**: Utilizado para manipulação, cálculo e formatação de datas de maneira leve e com suporte a múltiplas linguagens.
- **Path Aliases (`@/*`)**: Configurado para simplificar as importações e manter o código mais limpo (apontando diretamente para o diretório `src/`).

## Estrutura do Projeto

A maior parte do código fonte da aplicação reside na pasta `/src`. 
Através da configuração estabelecida no `jsconfig.json`, é possível realizar importações absolutas a partir da raiz de `src`. Por exemplo:

```javascript
// Em vez de: import Componente from '../../components/Componente';
import Componente from '@/components/Componente';
```

## 🛠️ Como executar o projeto

### Pré-requisitos
- Node.js instalado em sua máquina.
- Um gerenciador de pacotes da sua preferência (`npm` ou `yarn`).

### Instalação

1. Acesse o diretório do projeto:
   ```bash
   cd Dev_App_Mob
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   # ou
   yarn start
   ```

## 📝 Licença

Este projeto é de uso livre. Desenvolvido por Lucas.