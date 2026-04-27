#!/bin/bash

echo "🚀 Configurando LMS Tech - Sistema PostgreSQL"
echo "==============================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Execute este script dentro da pasta do projeto (siterender/)"
    exit 1
fi

echo "📦 Instalando dependências..."
cd backend && npm install
cd ..

echo "🗄️  Configurando PostgreSQL..."
echo "📄 Arquivo .env criado/verificando..."

if [ ! -f ".env" ]; then
    cat > .env << EOF
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api

# Backend Environment Variables
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://lmstech_user:lmstech123@localhost:5432/lmstech_db
EOF
    echo "✅ Arquivo .env criado!"
else
    echo "✅ Arquivo .env já existe!"
fi

echo ""
echo "🔧 Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL instalado"
    if sudo -n service postgresql status &> /dev/null; then
        echo "✅ PostgreSQL rodando"
    else
        echo "⚠️  PostgreSQL pode não estar rodando. Execute:"
        echo "   sudo service postgresql start"
    fi
else
    echo "❌ PostgreSQL não encontrado. Instale com:"
    echo "   sudo apt install postgresql postgresql-contrib"
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
echo "🎉 Configuração concluída!"