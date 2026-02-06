# PetLife — Sistema para Gerenciamento de Clínicas Veterinárias (Web e Mobile)

Este repositório contém três aplicações que compõem o sistema:

- `admin/`: aplicação web para funcionários da clínica.
- `backend/`: API/servidor da aplicação.
- `frontend/`: app mobile (React Native + Expo) para responsáveis dos pets.

## Objetivo

A aplicação web automatiza processos internos da clínica:

- Cadastro de pets e responsáveis.
- Histórico de consultas e procedimentos.
- Agendamento de consultas.
- Receitas, exames e diagnósticos.
- Controle de vacinas.

O app mobile oferece acesso às informações para os responsáveis:

- Perfis individuais de cada pet.
- Histórico de processos e consultas.
- Consultas agendadas.
- Receitas, exames e diagnósticos.
- Controle de vacinas.

## Requisitos

- Node.js (para o mobile com Expo SDK 54, recomenda-se `>= 20.19.4`).
- npm (ou outro gerenciador, se preferir).

## Estrutura do projeto

- `admin/` (Web - React)
- `backend/` (Node.js + Express + Sequelize)
- `frontend/` (Mobile - React Native + Expo)

## Scripts principais (raiz)

Depois de instalar as dependências em cada app, você pode usar:

- `npm run admin:start`
- `npm run admin:build`
- `npm run admin:test`
- `npm run admin:lint`
- `npm run backend:start`
- `npm run backend:test`
- `npm run frontend:start`
- `npm run frontend:android`
- `npm run frontend:ios`
- `npm run frontend:web`

Para instalar tudo de uma vez:

- `npm run install:all`

## Como rodar

### Web (admin)

```
cd admin
npm install
npm start
```

### Backend

```
cd backend
npm install
npm start
```

### Mobile (frontend)

```
cd frontend
npm install
npm start
```

## Rodar com Docker (admin + backend + mysql)

### Guia rápido (Windows)

Pré-requisitos para Windows:

- Git: https://git-scm.com/downloads
- Docker Desktop (com WSL2): https://www.docker.com/products/docker-desktop/

Passos:

1. Abra o PowerShell.
2. Clone o repositório:

```
git clone <URL_DO_REPOSITORIO>
cd petlife
```

3. Suba o ambiente:

```
docker compose up --build
```

4. Acesse:

- Admin: `http://localhost:3000`
- Backend: `http://localhost:8080/live`

Suba tudo com:

```
docker compose up --build
```

Serviços:

- Admin: `http://localhost:3000`
- Backend: `http://localhost:8080`
- MySQL: `localhost:3306`

Configurações usadas no docker:

- DB: `petlife`
- User: `root`
- Senha: `1234`

## Rodar sem Docker (Windows)

### 1) Instalar MySQL

Baixe e instale o MySQL Server no Windows.
Durante a instalação, configure:

- Usuário: `root`
- Senha: `1234`
- Porta: `3306`

Crie o banco `petlife` (pode ser pelo MySQL Workbench ou CLI).

Exemplo via CLI:

```sql
CREATE DATABASE petlife;
```

### 2) Backend

```
cd backend
npm install
npm start
```

O backend sobe em `http://localhost:8080`.

### 3) Admin

```
cd admin
npm install
npm start
```

O admin sobe em `http://localhost:3000`.

## Atualizar Expo (opção 2)

Se você estiver migrando o app mobile antigo para o Expo atual:

```
cd frontend
npm install expo@^54.0.0
npx expo install --fix
npx expo-doctor
```

Isso alinha as versões do React/React Native e pacotes do Expo com o SDK 54.

## Seed do banco (dados genéricos)

Para gerar as tabelas e inserir dados básicos:

```
cd backend
npm run db:seed
```

Para recriar tudo do zero (drop + create), use:

```
$env:SEED_FORCE="true"
npm run db:seed
```

## Troubleshooting (Docker no Windows)

### Erro: `failed to copy: httpReadSeeker ...` ao baixar imagens

Em algumas versões do Docker Desktop no Windows, o backend `containerd` causa falhas no pull das imagens.

Solução:

1. Abra o Docker Desktop.
2. Clique em **Settings** (ícone de engrenagem).
3. Vá em **General**.
4. Desmarque **"Use containerd for pulling and storing images"**.
5. Clique em **Apply & Restart**.
6. Tente novamente:

```
docker pull mysql:8.0
docker compose up --build
```

### Erro: DNS timeout (`nslookup` falhando)

Se o DNS estiver falhando (timeout), o Docker não consegue resolver o registry e não baixa imagens.

Solução (Windows):

1. Troque o DNS da sua conexão para servidores públicos:
   - Preferencial: `1.1.1.1`
   - Alternativo: `8.8.8.8`
2. Limpe o cache DNS:

```
ipconfig /flushdns
```

3. Reinicie o Docker Desktop e tente:

```
docker pull mysql:8.0
docker compose up --build
```
