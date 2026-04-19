# Backend API - Portfolio LMS Tech

API REST para gerenciamento do portfólio e produtos da LMS Tech.

## Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados
- **Multer** - Upload de arquivos
- **CORS** - Compartilhamento de recursos

## Instalação

```bash
cd backend
npm install
```

## Configuração

1. Crie um arquivo `.env` na pasta backend:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=./portfolio.db
```

## Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## Endpoints da API

### Produtos

#### GET /api/products
Retorna todos os produtos.

#### POST /api/products
Cria um novo produto.
```json
{
  "nome": "Produto",
  "descricao": "Descrição",
  "categoria": "Categoria",
  "preco": 99.99,
  "link_compra": "https://...",
  "imagem_url": "/uploads/imagem.jpg",
  "loja": "Mercado Livre",
  "destaque": false,
  "disponivel": true,
  "clicks": 0
}
```

#### PUT /api/products/:id
Atualiza um produto.

#### DELETE /api/products/:id
Remove um produto.

### Portfólio

#### GET /api/portfolio
Retorna todos os projetos do portfólio.

#### POST /api/portfolio
Cria um novo projeto.
```json
{
  "title": "Projeto",
  "description": "Descrição",
  "technologies": "React, Node.js",
  "image": "/uploads/imagem.jpg",
  "images": "/uploads/img1.jpg,/uploads/img2.jpg",
  "link": "/portfolio/1",
  "version": "1.0.0"
}
```

#### PUT /api/portfolio/:id
Atualiza um projeto.

#### DELETE /api/portfolio/:id
Remove um projeto.

### Avaliações

#### GET /api/reviews/:portfolioId
Retorna avaliações de um projeto específico.

#### POST /api/reviews
Cria uma nova avaliação.
```json
{
  "portfolio_id": 1,
  "user": "João Silva",
  "rating": 5,
  "comment": "Excelente projeto!"
}
```

#### PUT /api/reviews/:id/helpful
Incrementa contador de "útil" em uma avaliação.

### Upload de Imagens

#### POST /api/upload
Upload de uma imagem única.

#### POST /api/upload-multiple
Upload de múltiplas imagens (máx. 15).

## Deploy no Render

1. **Criar serviço Web Service** no Render
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `NODE_ENV=production`
   - `PORT` (definido automaticamente pelo Render)

## Migração de Dados

Para migrar dados do localStorage para o banco:

1. Execute o script de migração (criar se necessário)
2. Ou use a interface admin para recriar os dados

## Estrutura do Banco

### products
- id (INTEGER PRIMARY KEY)
- nome (TEXT)
- descricao (TEXT)
- categoria (TEXT)
- preco (REAL)
- link_compra (TEXT)
- imagem_url (TEXT)
- loja (TEXT)
- destaque (BOOLEAN)
- disponivel (BOOLEAN)
- clicks (INTEGER)
- created_at (DATETIME)

### portfolio
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- description (TEXT)
- technologies (TEXT)
- image (TEXT)
- images (TEXT)
- link (TEXT)
- created_at (DATETIME)
- version (TEXT)

### reviews
- id (INTEGER PRIMARY KEY)
- portfolio_id (INTEGER, FOREIGN KEY)
- user (TEXT)
- rating (INTEGER)
- comment (TEXT)
- helpful (INTEGER)
- created_at (DATETIME)