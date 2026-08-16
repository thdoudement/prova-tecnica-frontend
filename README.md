# Busca CEP + CRUD Notícias — Prova Técnica Frontend

Aplicação React (Vite) com busca de endereços via ViaCEP, CRUD de notícias integrado ao backend RESTful, testes BDD, Docker multi-stage e layout responsivo com CSS manual.

## Tecnologias

- React 18 + Vite
- Axios
- Vitest + Testing Library (BDD)
- ESLint + Prettier
- Docker multi-stage (Nginx)

## Estrutura de pastas

```text
frontend/
├── src/
│   ├── components/       # UI (BuscaCep, CrudNoticias)
│   ├── services/         # Camada HTTP centralizada
│   ├── App.jsx           # Layout e navegação por abas
│   ├── App.css           # Estilos da aplicação
│   └── main.jsx          # Bootstrap React
├── index.html
├── vite.config.js
├── Dockerfile
└── docker-compose.yml
```

### Justificativa da estrutura

- **`components/`**: concentra UI e estado local de cada feature.
- **`services/api.js`**: único ponto de integração HTTP — facilita trocar URLs, mocks e tratamento global de erros.
- **CSS manual em `App.css`**: atende ao requisito de estilização própria, sem framework CSS, com media queries para responsividade.
- **ESLint + Prettier**: padronizam estilo e evitam erros comuns antes do commit.

## GitFlow

| Branch | Uso |
|--------|-----|
| `main` | Produção |
| `develop` | Integração |
| `feature/*` | Features (ex.: `feature/busca-cep`) |

### Publicar no GitHub

```powershell
cd frontend
git init
git add .
git commit -m "feat: estrutura inicial do frontend"
git branch -M main
git checkout -b develop
git remote add origin https://github.com/SEU_USUARIO/prova-tecnica-frontend.git
git push -u origin main develop
```

## Configuração local

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Acesse `http://localhost:5173`.

> **Importante:** inicie o backend antes de usar o CRUD de notícias (`http://localhost:3333`).

## Docker

```powershell
cd frontend
docker compose up --build
```

Frontend em `http://localhost:8081`.

Para apontar para outra API no build:

```powershell
docker build --build-arg VITE_API_URL=http://host.docker.internal:3333 -t prova-tecnica-frontend .
```

## Testes e lint

```powershell
npm test
npm run lint
npm run format
```

## Integração com backend

O frontend consome:

- `GET/POST/PUT/DELETE /noticias`
- Paginação via `page` e `limit`
- Filtros `titulo` e `descricao`
- Resposta `{ data, meta }`

Configure a URL da API em `.env`:

```env
VITE_API_URL=http://127.0.0.1:3333
```

## Teste BDD — Busca de CEP

Arquivo: `src/components/BuscaCep.test.jsx`

Cenários:

1. CEP válido → exibe endereço
2. CEP incompleto → exibe erro sem chamar a API
