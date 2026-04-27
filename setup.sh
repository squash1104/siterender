#!/bin/bash

echo "🚀 Configurando LMS Tech - Sistema de Banco de Dados"
echo "=================================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Execute este script dentro da pasta do projeto (siterender/)"
    exit 1
fi

echo "📦 Instalando dependências..."
cd backend && npm install
cd ..

echo "🗄️  Configurando banco de dados..."
echo "📄 Arquivo .env criado/verificando..."

if [ ! -f ".env" ]; then
    cat > .env << EOF
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api

# Backend Environment Variables
NODE_ENV=development
PORT=5000
DATABASE_URL=portfolio.db

# Database Configuration
USE_SQLITE=true
EOF
    echo "✅ Arquivo .env criado!"
else
    echo "✅ Arquivo .env já existe!"
fi

echo ""
echo "🔧 Iniciando servidores..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Para iniciar manualmente:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: npm run dev"
echo ""
echo "Para configurar PostgreSQL (opcional):"
echo "  1. Instale PostgreSQL localmente"
echo "  2. Atualize DATABASE_URL no .env"
echo "  3. Defina USE_SQLITE=false"
echo ""
echo "🎉 Configuração concluída!"