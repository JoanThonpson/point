# 🏁 Activity map - Gerenciador de Checklists para Gincanas

Sistema web para gerenciar provas e checklists de equipes em gincanas, com acompanhamento em tempo real.

[![Site no ar](https://img.shields.io/badge/site-online-brightgreen)](https://joanthonpson.github.io/point/)

## 🎯 Funcionalidades

- **Login administrativo** para fiscais marcarem atividades
- **Painel de acompanhamento** com progresso de todas as equipes
- **Checklists por equipe** com marcação em tempo real
- **Ranking automático** para facilitar o acompanhamento
- **Visualização pública** sem necessidade de login para visualizar os dados

## 🚀 Acesse o sistema

**Link do site:** [https://joanthonpson.github.io/point/](https://joanthonpson.github.io/point/)

## 🛠️ Tecnologias utilizadas

| Ferramenta            | Finalidade                            |
| --------------------- | ------------------------------------- |
| React 19              | Interface do usuário                  |
| TypeScript            | Tipagem segura e manutenção do código |
| Vite                  | Build e servidor de desenvolvimento   |
| Tailwind CSS          | Estilização rápida e responsiva       |
| Supabase (PostgreSQL) | Banco de dados online                 |
| GitHub Pages          | Hospedagem gratuita                   |
| GitHub Actions        | Deploy automatizado                   |

## 📊 Banco de dados

O sistema utiliza **Supabase** (PostgreSQL) com as seguintes tabelas:

- `teams` - Cadastro de equipes (nome, localização, descrição)
- `checklist_items` - Atividades vinculadas a cada equipe

📦 Estrutura do projeto

point/
├── .github/workflows/ # Deploy automático
├── src/
│ ├── services/
│ │ └── supabase.ts # Conexão com o banco
│ ├── App.tsx # Componente principal
│ ├── store.ts # Lógica de dados e operações
│ ├── main.tsx # Ponto de entrada
│ └── index.css # Estilos globais
├── .env # Credenciais do Supabase (não commitado)
├── vite.config.ts # Configuração do Vite
└── package.json # Dependências
