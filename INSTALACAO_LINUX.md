# 🐧 Instalação no Linux Mint/Ubuntu/Debian

## Dependências do Sistema

Antes de instalar as dependências Python, você precisa instalar as ferramentas de compilação e bibliotecas necessárias:

```bash
sudo apt-get update
sudo apt-get install -y \
    build-essential \
    cmake \
    pkg-config \
    tesseract-ocr \
    tesseract-ocr-por \
    poppler-utils \
    python3-dev \
    python3-pip \
    python3-venv
```

### Explicação das Dependências

- **build-essential**: Compilador GCC e ferramentas de build
- **cmake**: Sistema de build necessário para sentencepiece
- **pkg-config**: Ferramenta para encontrar bibliotecas instaladas
- **tesseract-ocr**: Motor de OCR
- **tesseract-ocr-por**: Idioma português para Tesseract
- **poppler-utils**: Utilitários para processar PDFs escaneados
- **python3-dev**: Cabeçalhos de desenvolvimento Python (necessário para compilar pacotes)
- **python3-pip**: Gerenciador de pacotes Python
- **python3-venv**: Ferramenta para criar ambientes virtuais

## Instalação do Backend

Após instalar as dependências do sistema:

```bash
cd backend

# Criar ambiente virtual
python3 -m venv venv

# Ativar ambiente virtual
source venv/bin/activate

# Atualizar pip
pip install --upgrade pip setuptools wheel

# Instalar dependências
pip install -r requirements.txt
```

## Se Ainda Tiver Problemas

### Problema: sentencepiece não compila

Se ainda tiver problemas com sentencepiece, você pode:

**Opção 1: Instalar sentencepiece do sistema (se disponível)**
```bash
sudo apt-get install python3-sentencepiece
```

**Opção 2: Usar versão pré-compilada**
```bash
pip install --upgrade pip
pip install sentencepiece --no-build-isolation
```

**Opção 3: Tornar descrição de imagens opcional**

Se você não precisa da funcionalidade de descrição de imagens (apenas OCR e TTS), pode comentar a linha do transformers no requirements.txt:

```bash
# transformers==4.35.0  # Comentar se não precisar de descrição de imagens
```

E atualizar o código para tornar a descrição opcional (já está implementado com tratamento de erro).

## Verificação

Após a instalação, verifique se tudo está funcionando:

```bash
# Verificar Tesseract
tesseract --version

# Verificar Python
python3 --version

# Verificar pip
pip list | grep -E "(fastapi|tesseract|gtts)"
```

## Executar

```bash
# No diretório backend, com venv ativado
python main.py
```

O servidor estará disponível em `http://localhost:8000`

## Notas Importantes

1. **Primeira execução**: O modelo BLIP será baixado automaticamente (~1GB) na primeira vez que a descrição de imagens for usada
2. **Internet**: Necessária para gTTS e download do modelo BLIP
3. **Espaço em disco**: Reserve pelo menos 2GB para modelos e dependências

