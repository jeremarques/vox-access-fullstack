# Backend VoxAccess

## Instalação Rápida

```bash
# Criar ambiente virtual
python3 -m venv venv

# Ativar (macOS/Linux)
source venv/bin/activate

# Ativar (Windows)
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt
```

## Executar

```bash
python main.py
```

O servidor estará disponível em `http://localhost:8000`

## Dependências do Sistema

- **Tesseract OCR**: Necessário para extração de texto
- **Poppler**: Necessário para processar PDFs escaneados

### macOS
```bash
brew install tesseract tesseract-lang poppler
```

### Linux
```bash
sudo apt-get install tesseract-ocr tesseract-ocr-por poppler-utils
```

## Notas

- Na primeira execução, o modelo BLIP será baixado automaticamente (~1GB)
- O gTTS requer conexão com internet para funcionar

