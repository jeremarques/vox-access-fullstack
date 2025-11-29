# 🚀 Instalação Rápida - VoxAccess

## Passo a Passo Simplificado

### 1️⃣ Instalar Dependências do Sistema

#### macOS
```bash
brew install tesseract tesseract-lang poppler python3 node
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr tesseract-ocr-por poppler-utils python3 python3-pip nodejs npm
```

#### Windows
1. Instale [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki)
2. Instale [Poppler](https://github.com/oschwartz10612/poppler-windows/releases/)
3. Instale [Python 3.9+](https://www.python.org/downloads/)
4. Instale [Node.js 18+](https://nodejs.org/)

### 2️⃣ Configurar Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3️⃣ Configurar Frontend

```bash
cd ../frontend
npm install
```

### 4️⃣ Executar Aplicação

#### Opção A: Script Automático (Recomendado)

**macOS/Linux:**
```bash
./start.sh
```

**Windows:**
```bash
start.bat
```

#### Opção B: Manual

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5️⃣ Acessar

Abra seu navegador em: **http://localhost:5173**

## ⚠️ Problemas Comuns

### "Tesseract not found"
- **macOS**: `brew install tesseract`
- **Linux**: `sudo apt-get install tesseract-ocr`
- **Windows**: Adicione Tesseract ao PATH do sistema

### "Poppler not found" (apenas para PDFs escaneados)
- **macOS**: `brew install poppler`
- **Linux**: `sudo apt-get install poppler-utils`

### Modelo BLIP demora para carregar
- Normal na primeira execução (baixa ~1GB)
- Requer conexão com internet

### Áudio não gera
- Verifique conexão com internet (gTTS requer internet)
- Texto muito longo (>5000 caracteres) será truncado

## ✅ Verificação Rápida

1. Backend rodando? → http://localhost:8000
2. Frontend rodando? → http://localhost:5173
3. Tesseract instalado? → `tesseract --version`

## 📞 Pronto para Usar!

Agora você pode:
- Fazer upload de imagens ou PDFs
- Processar e extrair texto
- Gerar descrições de imagens
- Converter texto em áudio
- Exportar em diferentes formatos

