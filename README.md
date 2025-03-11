# Sistema de Gerenciamento de Equipamentos

Sistema para gerenciamento de equipamentos fotográficos e cinematográficos, incluindo controle de manutenção, reservas e projetos.

## Funcionalidades

- Gerenciamento de Equipamentos
- Controle de Manutenção
- Gestão de Projetos
- Gestão de Equipes
- Sistema de Reservas
- Notificações
- Relatórios e Dashboards

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- MongoDB
- TypeScript
- JWT para autenticação

### Frontend
- React
- TypeScript
- Material-UI
- Recharts para gráficos
- React Router para navegação

## Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- MongoDB
- NPM ou Yarn

### Backend
1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute o servidor:
```bash
npm run dev
```

### Frontend
1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute a aplicação:
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.tsx
    └── package.json
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request