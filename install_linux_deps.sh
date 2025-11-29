#!/bin/bash

# Script de instalação de dependências do sistema para Linux Mint/Ubuntu/Debian

echo "🔧 Instalando dependências do sistema para VoxAccess..."
echo ""

# Verificar se está rodando como root ou com sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Este script precisa de privilégios de administrador."
    echo "Execute com: sudo ./install_linux_deps.sh"
    exit 1
fi

# Atualizar lista de pacotes
echo "📦 Atualizando lista de pacotes..."
apt-get update

# Instalar dependências
echo "📥 Instalando dependências..."
apt-get install -y \
    build-essential \
    cmake \
    pkg-config \
    tesseract-ocr \
    tesseract-ocr-por \
    poppler-utils \
    python3-dev \
    python3-pip \
    python3-venv \
    nodejs \
    npm

echo ""
echo "✅ Dependências do sistema instaladas com sucesso!"
echo ""
echo "Próximos passos:"
echo "1. cd backend"
echo "2. python3 -m venv venv"
echo "3. source venv/bin/activate"
echo "4. pip install --upgrade pip setuptools wheel"
echo "5. pip install -r requirements.txt"
echo ""

