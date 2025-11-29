#!/bin/bash

# Script para iniciar o VoxAccess

echo "🚀 Iniciando VoxAccess..."
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.9+"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+"
    exit 1
fi

# Verificar se Tesseract está instalado
if ! command -v tesseract &> /dev/null; then
    echo "⚠️  Tesseract OCR não encontrado."
    echo "   macOS: brew install tesseract tesseract-lang"
    echo "   Linux: sudo apt-get install tesseract-ocr tesseract-ocr-por"
    echo ""
fi

# Iniciar backend
echo "📦 Iniciando backend..."
cd backend

# Verificar se venv existe
if [ ! -d "venv" ]; then
    echo "📝 Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativar venv
source venv/bin/activate

# Instalar dependências se necessário
if [ ! -f "venv/.installed" ]; then
    echo "📥 Instalando dependências do backend..."
    pip install -r requirements.txt
    touch venv/.installed
fi

# Iniciar backend em background
echo "🔧 Backend iniciando em http://localhost:8000"
python main.py &
BACKEND_PID=$!

cd ..

# Aguardar backend iniciar
sleep 3

# Iniciar frontend
echo "🎨 Iniciando frontend..."
cd frontend

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências do frontend..."
    npm install
fi

echo "🌐 Frontend iniciando em http://localhost:5173"
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ VoxAccess está rodando!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo ""
echo "Pressione Ctrl+C para parar os servidores"

# Aguardar Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

