# LMS Tech - Portfolio e Sistema de Peças

Sistema completo de portfolio e gerenciamento de peças para a LMS Tech, com frontend React e backend API.

## Estrutura do Projeto

```
siterender/
├── backend/          # API Node.js + SQLite
├── src/             # Frontend React
├── public/          # Assets estáticos
└── package.json     # Dependências frontend
```

## Tecnologias

### Frontend
- **React 18** - Framework JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Ícones
- **React Router** - Roteamento

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados
- **Multer** - Upload de arquivos
- **CORS** - Compartilhamento de recursos

## Instalação e Execução

### Backend
```bash
cd backend
npm install
npm run dev  # Desenvolvimento
npm start    # Produção
```

### Frontend
```bash
npm install
npm run dev  # Desenvolvimento
npm run build  # Produção
```

## Configuração

### Variáveis de Ambiente

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=./portfolio.db
```

## Funcionalidades

### Sistema de Peças
- ✅ Cadastro de produtos
- ✅ Categorias organizadas
- ✅ Controle de estoque
- ✅ Links de compra
- ✅ Imagens de produtos

### Portfólio
- ✅ Projetos em destaque
- ✅ Tecnologias utilizadas
- ✅ Capturas de tela
- ✅ Sistema de avaliações
- ✅ Modal ampliado de imagens

### Sistema de Avaliações
- ✅ Avaliação por estrelas (1-5)
- ✅ Comentários dos usuários
- ✅ Estatísticas em tempo real
- ✅ Votos "útil" nas avaliações
- ✅ Interface similar ao Google Play

## Deploy no Render

### Backend
1. **Criar Web Service** no Render
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `NODE_ENV=production`
   - `DATABASE_URL=./portfolio.db` (ou usar PostgreSQL)

### Frontend
1. **Criar Static Site** no Render
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL=https://your-backend-url.onrender.com/api`

## API Endpoints

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Remover produto

### Portfólio
- `GET /api/portfolio` - Listar projetos
- `POST /api/portfolio` - Criar projeto
- `PUT /api/portfolio/:id` - Atualizar projeto
- `DELETE /api/portfolio/:id` - Remover projeto

### Avaliações
- `GET /api/reviews/:portfolioId` - Avaliações do projeto
- `POST /api/reviews` - Criar avaliação
- `PUT /api/reviews/:id/helpful` - Marcar como útil

### Upload
- `POST /api/upload` - Upload imagem única
- `POST /api/upload-multiple` - Upload múltiplas imagens

## Desenvolvimento

### Comandos Úteis
```bash
# Backend
cd backend && npm run dev

# Frontend
npm run dev

# Build completo
npm run build && cd backend && npm run build
```

### Estrutura do Banco
- **products**: Informações dos produtos
- **portfolio**: Projetos do portfólio
- **reviews**: Avaliações dos projetos

## Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.