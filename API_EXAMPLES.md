# Exemplos de Uso da API VoxAccess

## Endpoints Disponíveis

### 1. Upload de Arquivo

**POST** `/api/upload`

```bash
curl -X POST "http://localhost:8000/api/upload" \
  -F "file=@documento.pdf"
```

**Resposta:**
```json
{
  "file_id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "documento.pdf",
  "content_type": "application/pdf",
  "size": 123456
}
```

### 2. Processar Arquivo

**POST** `/api/process?file_id={file_id}&process_type=all`

```bash
curl -X POST "http://localhost:8000/api/process?file_id=550e8400-e29b-41d4-a716-446655440000&process_type=all"
```

**Tipos de processamento:**
- `ocr`: Apenas extração de texto
- `description`: Apenas descrição de imagem (apenas imagens)
- `tts`: Apenas conversão para áudio
- `all`: Todos os processamentos disponíveis

**Resposta:**
```json
{
  "text": "Texto extraído do documento...",
  "description": "Uma imagem mostrando...",
  "audio_url": "/api/audio/550e8400-e29b-41d4-a716-446655440000",
  "word_count": 150
}
```

### 3. Baixar Áudio

**GET** `/api/audio/{file_id}`

```bash
curl -O "http://localhost:8000/api/audio/550e8400-e29b-41d4-a716-446655440000"
```

### 4. Exportar Conteúdo

**POST** `/api/export`

```bash
curl -X POST "http://localhost:8000/api/export" \
  -H "Content-Type: application/json" \
  -d '{
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "format": "txt",
    "content": "Texto para exportar..."
  }'
```

**Formatos disponíveis:**
- `txt`: Arquivo de texto simples
- `srt`: Arquivo de legendas (SubRip)

## Exemplo Completo em Python

```python
import requests

# 1. Upload
with open('documento.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/upload',
        files={'file': f}
    )
    file_data = response.json()
    file_id = file_data['file_id']

# 2. Processar
response = requests.post(
    'http://localhost:8000/api/process',
    params={'file_id': file_id, 'process_type': 'all'}
)
result = response.json()

# 3. Baixar áudio
if 'audio_url' in result:
    audio_response = requests.get(
        f"http://localhost:8000/api/audio/{file_id}"
    )
    with open('audio.mp3', 'wb') as f:
        f.write(audio_response.content)

# 4. Exportar texto
if 'text' in result:
    export_response = requests.post(
        'http://localhost:8000/api/export',
        json={
            'file_id': file_id,
            'format': 'txt',
            'content': result['text']
        }
    )
    with open('exportado.txt', 'wb') as f:
        f.write(export_response.content)
```

## Exemplo em JavaScript/Node.js

```javascript
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function processFile(filePath) {
  // 1. Upload
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  
  const uploadResponse = await axios.post(
    'http://localhost:8000/api/upload',
    form,
    { headers: form.getHeaders() }
  );
  
  const fileId = uploadResponse.data.file_id;
  
  // 2. Processar
  const processResponse = await axios.post(
    'http://localhost:8000/api/process',
    null,
    { params: { file_id: fileId, process_type: 'all' } }
  );
  
  const result = processResponse.data;
  
  // 3. Baixar áudio
  if (result.audio_url) {
    const audioResponse = await axios.get(
      `http://localhost:8000/api/audio/${fileId}`,
      { responseType: 'stream' }
    );
    audioResponse.data.pipe(fs.createWriteStream('audio.mp3'));
  }
  
  return result;
}

// Uso
processFile('documento.pdf').then(console.log);
```

