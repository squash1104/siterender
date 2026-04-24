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

### Favicon
Para personalizar o favicon do site, adicione os seguintes arquivos na pasta `public/`:

#### Arquivos Necessários:
- `favicon.ico` - Ícone principal (16x16, 32x32, 48x48 em um arquivo ICO)
- `favicon-16x16.png` - Versão PNG 16x16px
- `favicon-32x32.png` - Versão PNG 32x32px
- `apple-touch-icon.png` - Ícone para iOS 180x180px

#### Como Gerar:
1. **Online**: Use ferramentas como [favicon.io](https://favicon.io) ou [realfavicongenerator.net](https://realfavicongenerator.net)
2. **Do zero**: Crie um logo SVG e converta usando ferramentas online
3. **De imagem**: Use uma imagem PNG/JPG quadrada e gere os tamanhos necessários

#### Recomendações:
- **Formato**: PNG com fundo transparente
- **Tamanho base**: 512x512px (será redimensionado automaticamente)
- **Cores**: Use as cores da sua marca
- **Simples**: Mantenha o design limpo e legível em tamanhos pequenos

## Funcionalidades

### Sistema de Peças
- ✅ Cadastro de produtos
- ✅ Categorias organizadas
- ✅ Controle de estoque
- ✅ Links de compra
- ✅ Imagens de produtos
- ✅ Contador de cliques nos links
- ✅ Status ativo/inativo

### Portfólio
- ✅ Projetos em destaque
- ✅ Tecnologias utilizadas
- ✅ Capturas de tela
- ✅ Sistema de avaliações
- ✅ Página pública de listagem (/portfolio)

### Painel Administrativo
- ✅ Acesso restrito com senha dinâmica diária
- ✅ Abas separadas para produtos e portfólio
- ✅ Interface moderna com Cards
- ✅ Paginação automática (10 itens por página)
- ✅ Upload de imagens múltiplas
- ✅ Edição e exclusão de registros

### Sistema de Avaliações
- ✅ Avaliação por estrelas (1-5)
- ✅ Comentários dos usuários
- ✅ Estatísticas em tempo real
- ✅ Votos "útil" nas avaliações
- ✅ Interface similar ao Google Play

## Administração

### Acesso ao Painel Admin
1. Acesse `/admin` no seu site
2. **Usuário**: `admin`
3. **Senha**: `admin123`
4. A senha é fixa para facilitar o acesso

### Gerenciando Peças
- **Cadastrar**: Use o botão "Nova Peça" para adicionar produtos
- **Editar**: Clique no ícone de lápis para modificar
- **Status**: Use o ícone de olho para ativar/desativar produtos
- **Excluir**: Clique na lixeira para remover (permanente)

### Gerenciando Portfólio
- **Cadastrar**: Use o botão "Novo Projeto" para adicionar trabalhos
- **Editar**: Clique no ícone de lápis para modificar
- **Excluir**: Clique na lixeira para remover projetos

### Upload de Imagens
- **Produtos**: Campo "Imagem Principal" (URL ou arquivo)
- **Portfólio**: "Imagem Principal" + múltiplas capturas de tela
- **Formatos**: JPG, PNG, WebP (máx. 5MB por imagem)
- **Otimização**: Imagens são comprimidas automaticamente

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