# LMS Tech - Guia de Deploy no Render

## 📋 Pré-requisitos

1. **Conta no Render**: [render.com](https://render.com)
2. **Repositório no GitHub**: Projeto deve estar versionado
3. **Node.js**: Ambiente configurado

## 🚀 Passos para Deploy

### 1. Backend (API)

#### Criar Web Service
1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure as seguintes opções:

#### Build & Deploy
```bash
# Build Command
npm install

# Start Command  
npm start

# Root Directory
backend
```

#### Environment Variables
```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:password@host:5432/database  # URL da instância PostgreSQL no Render
```

#### Advanced Settings
- **Runtime**: Node
- **Build Timeout**: 15 minutes
- **Instance Type**: Free/Starter

### 2. Frontend (React)

#### Criar Static Site
1. No Render Dashboard, clique **"New"** → **"Static Site"**
2. Conecte o mesmo repositório GitHub
3. Configure:

#### Build & Deploy
```bash
# Build Command
npm run build

# Publish Directory
dist

# Root Directory
./ (raiz do projeto)
```

#### Environment Variables
```bash
# Substitua pela URL do seu backend
VITE_API_URL=https://your-backend-service.onrender.com/api
```

### 3. Configuração do Banco

O SQLite será criado automaticamente na primeira execução. Para persistência:

- **Free Tier**: Dados são temporários (resetam a cada deploy)
- **Pago**: Dados persistem entre deploys

## 🔧 Arquivos de Configuração

### render.yaml (Opcional - Blueprints)
```yaml
services:
  - type: web
    name: lms-tech-api
    runtime: node
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
       - key: DATABASE_URL
         value: postgresql://user:password@host:5432/database  # URL da instância PostgreSQL no Render

  - type: web
    name: lms-tech-frontend
    runtime: static
    rootDir: ./
    buildCommand: npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_URL
        fromService:
          type: web
          name: lms-tech-api
          property: host
```

### .env.production (Backend)
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=./portfolio.db
```

## 🔄 Processo de Deploy

1. **Push para GitHub**:
   ```bash
   git add .
   git commit -m "Deploy inicial"
   git push origin main
   ```

2. **Deploy Automático**:
   - Render detecta mudanças automaticamente
   - Backend é deployado primeiro
   - Frontend é deployado após
   - URLs são geradas automaticamente

3. **Atualização da URL**:
   - Copie a URL do backend
   - Atualize `VITE_API_URL` no frontend
   - Faça novo commit/push

## 🌐 URLs Após Deploy

- **Backend**: `https://your-app-name.onrender.com`
- **Frontend**: `https://your-app-name-static.onrender.com`

## 🐛 Troubleshooting

### Erro de CORS
```javascript
// backend/server.js - Adicionar origens permitidas
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.onrender.com'
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

### Banco não persiste
- **PostgreSQL no Render**: Dados persistem entre deploys
- **Configurar DATABASE_URL**: Use a URL da instância PostgreSQL criada no Render

### Build falha
```bash
# Verificar logs no Render Dashboard
# Possíveis causas:
# - Dependências não instaladas
# - Variáveis de ambiente faltando
# - Arquivos grandes demais
```

### Imagens não carregam
- Verificar se `uploads/` está sendo criado
- URLs devem usar a URL completa do backend
- Exemplo: `https://your-backend.onrender.com/uploads/imagem.jpg`

## 📊 Monitoramento

### Logs
- Acesse Dashboard → Service → Logs
- Verifique erros em tempo real

### Analytics
- Render fornece métricas básicas
- Para analytics avançado, integre ferramentas externas

## 💡 Dicas

1. **Teste localmente** antes do deploy
2. **Use variáveis de ambiente** para URLs
3. **Configure CORS** corretamente
4. **Monitore logs** após deploy
5. **Faça backups** do banco se necessário

## 🔄 Atualizações

Para atualizar a aplicação:
1. Faça mudanças no código
2. Commit e push para GitHub
3. Render faz deploy automático
4. Verifique se tudo funciona

## 📞 Suporte

- **Render Docs**: [docs.render.com](https://docs.render.com)
- **GitHub Issues**: Para bugs específicos
- **Discord**: Comunidade Render