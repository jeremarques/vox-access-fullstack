# 📁 Estrutura do Projeto VoxAccess

```
vox-access-fullstack/
│
├── 📄 README.md                    # Documentação principal
├── 📄 PROJETO.md                   # Informações do projeto para apresentação
├── 📄 INSTALACAO_RAPIDA.md         # Guia rápido de instalação
├── 📄 API_EXAMPLES.md              # Exemplos de uso da API
├── 📄 EXEMPLO_USO.md               # Cenários de uso práticos
├── 📄 ESTRUTURA_PROJETO.md         # Este arquivo
│
├── 🚀 start.sh                     # Script de inicialização (macOS/Linux)
├── 🚀 start.bat                    # Script de inicialização (Windows)
│
├── 🐍 backend/                     # Backend Python
│   ├── main.py                     # API FastAPI principal
│   ├── requirements.txt            # Dependências Python
│   ├── README.md                   # Documentação do backend
│   │
│   └── services/                   # Serviços de processamento
│       ├── __init__.py
│       ├── ocr_service.py          # OCR (Tesseract)
│       ├── tts_service.py          # Text-to-Speech (gTTS)
│       ├── image_description_service.py  # Descrição de imagens (BLIP)
│       └── pdf_service.py          # Processamento de PDFs
│
└── ⚛️ frontend/                     # Frontend React
    ├── package.json                # Dependências Node.js
    ├── vite.config.ts              # Configuração Vite
    ├── tsconfig.json               # Configuração TypeScript
    ├── tailwind.config.js          # Configuração Tailwind CSS
    ├── index.html                  # HTML principal
    │
    └── src/                        # Código fonte
        ├── main.tsx                # Entry point React
        ├── App.tsx                 # Componente principal
        └── index.css               # Estilos globais
```

## 🔄 Fluxo de Dados

```
Usuário (Frontend)
    ↓
Upload de arquivo (imagem/PDF)
    ↓
Backend recebe arquivo
    ↓
┌─────────────────────────────────┐
│  Processamento Paralelo:        │
│  • OCR Service                  │
│  • Image Description Service    │
│  • PDF Service                  │
│  • TTS Service                  │
└─────────────────────────────────┘
    ↓
Resultados retornados
    ↓
Frontend exibe:
• Texto extraído
• Descrição da imagem
• Player de áudio
• Opções de exportação
```

## 🛠️ Tecnologias por Camada

### Frontend
- **React 18**: Framework UI
- **TypeScript**: Tipagem estática
- **Vite**: Build tool
- **Tailwind CSS**: Estilização
- **Axios**: HTTP client
- **Lucide React**: Ícones

### Backend
- **FastAPI**: Framework web
- **Python 3.9+**: Linguagem
- **Tesseract OCR**: Extração de texto
- **gTTS**: Text-to-Speech
- **BLIP (Salesforce)**: Descrição de imagens
- **PyPDF2**: Processamento PDFs
- **Pillow**: Processamento de imagens

## 📦 Dependências Externas

### Sistema
- **Tesseract OCR**: OCR engine
- **Poppler**: Processamento de PDFs escaneados
- **Python 3.9+**: Runtime Python
- **Node.js 18+**: Runtime Node.js

### Python (requirements.txt)
- fastapi
- uvicorn
- pytesseract
- gtts
- pypdf2
- pdf2image
- transformers (BLIP)
- torch
- pillow
- aiofiles

### Node.js (package.json)
- react
- react-dom
- typescript
- vite
- tailwindcss
- axios
- lucide-react

## 🎯 Pontos de Entrada

### Desenvolvimento
1. **Backend**: `backend/main.py`
2. **Frontend**: `frontend/src/App.tsx`

### Execução
1. **Automático**: `./start.sh` ou `start.bat`
2. **Manual**: 
   - Backend: `python backend/main.py`
   - Frontend: `npm run dev` (em `frontend/`)

### Documentação
1. **Principal**: `README.md`
2. **Instalação**: `INSTALACAO_RAPIDA.md`
3. **API**: `API_EXAMPLES.md`
4. **Uso**: `EXEMPLO_USO.md`

## 📊 Arquivos Gerados (Runtime)

```
backend/
├── uploads/          # Arquivos enviados (criado automaticamente)
└── outputs/          # Arquivos gerados (criado automaticamente)
    ├── *.mp3         # Áudios gerados
    ├── *_export.txt  # Textos exportados
    └── *_export.srt  # Legendas exportadas
```

## 🔐 Segurança

- Arquivos temporários são armazenados localmente
- Sem autenticação (projeto escolar)
- CORS configurado para desenvolvimento local
- Validação de tipos de arquivo no upload

## 🚀 Performance

- Processamento assíncrono
- Modelo BLIP carregado sob demanda
- Cache de modelos após primeira carga
- Limite de texto para TTS (5000 caracteres)

## 📝 Notas Importantes

1. **Primeira execução**: Modelo BLIP será baixado (~1GB)
2. **Internet**: Necessária para gTTS funcionar
3. **Tesseract**: Deve estar instalado no sistema
4. **Poppler**: Necessário apenas para PDFs escaneados

