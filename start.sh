#!/bin/bash

# Script para iniciar backend e frontend simultaneamente

echo "🚀 Iniciando LMS Tech - Backend + Frontend"
echo ""

# Verificar se estamos em produção
if [ "$NODE_ENV" = "production" ]; then
  echo "🏭 Ambiente de produção detectado"
  echo "📡 Iniciando apenas backend..."
  cd backend && npm start
  exit 0
fi

# Função para iniciar backend
start_backend() {
  echo "📡 Iniciando backend..."
  cd backend && npm run dev &
  BACKEND_PID=$!
  echo "Backend PID: $BACKEND_PID"
}

# Função para iniciar frontend
start_frontend() {
  echo "🌐 Iniciando frontend..."
  sleep 2  # Aguardar backend iniciar
  npm run dev &
  FRONTEND_PID=$!
  echo "Frontend PID: $FRONTEND_PID"
}

# Verificar se as dependências estão instaladas
check_dependencies() {
  if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
  fi

  if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    cd backend && npm install && cd ..
  fi
}

# Iniciar serviços
check_dependencies
start_backend
start_frontend

echo ""
echo "✅ Serviços iniciados!"
echo "📡 Backend: http://localhost:5000"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Para parar os serviços: Ctrl+C"

# Aguardar interrupção
trap "echo 'Parando serviços...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Manter script rodando
wait