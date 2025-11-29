# VoxAccess - Acessibilidade e IA

**VoxAccess** é uma plataforma completa que utiliza Inteligência Artificial para converter qualquer conteúdo visual em informações acessíveis. O sistema transcreve imagens, descreve fotos, lê PDFs escaneados com voz natural e identifica elementos de layout - tudo em segundos.

## 🎯 Características

- ✅ **OCR Inteligente**: Extração de texto de imagens e PDFs escaneados
- ✅ **Descrição de Imagens**: Geração automática de descrições usando IA
- ✅ **Text-to-Speech**: Conversão de texto em áudio natural
- ✅ **Processamento de PDFs**: Suporte para PDFs com texto e escaneados
- ✅ **Exportação Múltipla**: Exporte em TXT, SRT ou ouça diretamente
- ✅ **Interface Moderna**: Design responsivo e acessível

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.9+**
- **FastAPI**: Framework web moderno e rápido
- **Tesseract OCR**: Extração de texto de imagens
- **gTTS (Google Text-to-Speech)**: Conversão de texto em áudio
- **BLIP (Salesforce)**: Modelo de IA para descrição de imagens
- **PyPDF2**: Processamento de PDFs

### Frontend
- **React 18** com **TypeScript**
- **Vite**: Build tool rápida
- **Tailwind CSS**: Estilização moderna
- **Axios**: Cliente HTTP
- **Lucide React**: Ícones

## 📋 Pré-requisitos

### Sistema Operacional
- macOS, Linux ou Windows

### Dependências do Sistema

#### macOS
```bash
# Instalar Tesseract OCR
brew install tesseract tesseract-lang

# Instalar Poppler (para processar PDFs escaneados)
brew install poppler

# Instalar Python 3.9+ (se não tiver)
brew install python3
```

#### Linux (Ubuntu/Debian)
```bash
# Instalar Tesseract OCR
sudo apt-get update
sudo apt-get install tesseract-ocr tesseract-ocr-por poppler-utils python3 python3-pip
```

#### Windows
1. Baixe e instale [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki)
2. Adicione Tesseract ao PATH do sistema
3. Instale [Poppler para Windows](https://github.com/oschwartz10612/poppler-windows/releases/)
4. Instale Python 3.9+ do [python.org](https://www.python.org/downloads/)

### Node.js
Instale Node.js 18+ do [nodejs.org](https://nodejs.org/)

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd vox-access-fullstack
```

### 2. Configurar Backend

```bash
cd backend

# Criar ambiente virtual
python3 -m venv venv

# Ativar ambiente virtual
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt
```

**Nota**: A primeira execução pode demorar alguns minutos para baixar o modelo BLIP (~1GB).

### 3. Configurar Frontend

```bash
cd ../frontend

# Instalar dependências
npm install
```

## ▶️ Executando a Aplicação

### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # macOS/Linux
# ou venv\Scripts\activate  # Windows

python main.py
```

O backend estará rodando em `http://localhost:8000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 📖 Como Usar

1. **Acesse a aplicação**: Abra `http://localhost:5173` no navegador
2. **Faça upload**: Clique para selecionar uma imagem (JPG, PNG) ou PDF
3. **Processe**: Após o upload, clique em "Processar Arquivo"
4. **Visualize resultados**:
   - Texto extraído (OCR)
   - Descrição da imagem (se aplicável)
   - Áudio gerado (player integrado)
5. **Exporte**: Baixe o conteúdo em TXT ou SRT

## 🎓 Casos de Uso

### Para Estudantes com Deficiência Visual
- Digitalizar materiais impressos
- Converter slides e documentos em áudio
- Acessar conteúdo de livros escaneados

### Para Escolas
- Tornar materiais didáticos acessíveis
- Integrar via API em sistemas existentes
- Reduzir barreiras de acesso à informação

### Para Bibliotecas Digitais
- Converter acervos escaneados em formato acessível
- Gerar descrições automáticas de imagens históricas
- Criar versões em áudio de documentos

## 🔧 API Endpoints

### POST `/api/upload`
Faz upload de um arquivo (imagem ou PDF)

**Request**: `multipart/form-data` com campo `file`

**Response**:
```json
{
  "file_id": "uuid",
  "filename": "documento.pdf",
  "content_type": "application/pdf",
  "size": 123456
}
```

### POST `/api/process`
Processa um arquivo enviado

**Query Parameters**:
- `file_id`: ID do arquivo
- `process_type`: `ocr`, `description`, `tts`, ou `all`

**Response**:
```json
{
  "text": "Texto extraído...",
  "description": "Descrição da imagem...",
  "audio_url": "/api/audio/{file_id}",
  "word_count": 150
}
```

### GET `/api/audio/{file_id}`
Retorna arquivo de áudio gerado

### POST `/api/export`
Exporta conteúdo em diferentes formatos

**Body**:
```json
{
  "file_id": "uuid",
  "format": "txt" ou "srt",
  "content": "Texto para exportar"
}
```

## 📁 Estrutura do Projeto

```
vox-access-fullstack/
├── backend/
│   ├── main.py                 # API principal
│   ├── services/
│   │   ├── ocr_service.py      # Serviço de OCR
│   │   ├── tts_service.py      # Serviço de Text-to-Speech
│   │   ├── image_description_service.py  # Descrição de imagens
│   │   └── pdf_service.py      # Processamento de PDFs
│   ├── uploads/                # Arquivos enviados (criado automaticamente)
│   ├── outputs/                # Arquivos gerados (criado automaticamente)
│   └── requirements.txt        # Dependências Python
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Componente principal
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Estilos globais
│   ├── package.json            # Dependências Node
│   └── vite.config.ts          # Configuração Vite
│
└── README.md                   # Este arquivo
```

## ⚠️ Limitações e Notas

1. **gTTS**: Requer conexão com internet para gerar áudio
2. **Modelo BLIP**: Primeira execução baixa ~1GB de dados
3. **Tesseract**: Precisão depende da qualidade da imagem
4. **PDFs Escaneados**: Requer Poppler instalado no sistema

## 🐛 Solução de Problemas

### Erro: "Tesseract not found"
- Certifique-se de que Tesseract está instalado e no PATH
- macOS: `brew install tesseract`
- Linux: `sudo apt-get install tesseract-ocr`

### Erro ao processar PDF escaneado
- Instale Poppler: `brew install poppler` (macOS) ou `sudo apt-get install poppler-utils` (Linux)

### Modelo BLIP não carrega
- Verifique conexão com internet (primeira vez baixa o modelo)
- Espaço em disco suficiente (~1GB)

### Áudio não gera
- Verifique conexão com internet (gTTS requer internet)
- Texto muito longo (>5000 caracteres) será truncado

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais (Feira de Ciências).

## 👥 Créditos

Desenvolvido para a Feira de Ciências 2024
Tema: Acessibilidade e IA

---

**VoxAccess** - Democratizando o acesso à informação através da Inteligência Artificial

