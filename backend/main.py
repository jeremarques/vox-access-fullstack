from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from typing import Optional
from pydantic import BaseModel
import os
import uuid
import aiofiles
from pathlib import Path

from services.ocr_service import OCRService
from services.tts_service import TTSService
from services.image_description_service import ImageDescriptionService
from services.pdf_service import PDFService

app = FastAPI(title="VoxAccess API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar diretórios necessários
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Inicializar serviços
ocr_service = OCRService()
tts_service = TTSService()
image_desc_service = ImageDescriptionService()
pdf_service = PDFService()

# Modelos Pydantic
class ExportRequest(BaseModel):
    file_id: str
    format: str
    content: str

@app.get("/")
async def root():
    return {"message": "VoxAccess API está funcionando!"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload de arquivo (imagem ou PDF)"""
    try:
        # Validar tipo de arquivo
        allowed_types = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Tipo de arquivo não suportado. Use: {', '.join(allowed_types)}"
            )
        
        # Salvar arquivo
        file_id = str(uuid.uuid4())
        file_ext = os.path.splitext(file.filename)[1]
        file_path = UPLOAD_DIR / f"{file_id}{file_ext}"
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(content)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process")
async def process_file(file_id: str, process_type: str = "all"):
    """
    Processa arquivo: OCR, descrição de imagem, TTS
    process_type: 'ocr', 'description', 'tts', 'all'
    """
    try:
        # Encontrar arquivo
        file_path = None
        for ext in ['.jpg', '.jpeg', '.png', '.pdf']:
            candidate = UPLOAD_DIR / f"{file_id}{ext}"
            if candidate.exists():
                file_path = candidate
                break
        
        if not file_path:
            raise HTTPException(status_code=404, detail="Arquivo não encontrado")
        
        results = {}
        
        # Processar PDF
        if file_path.suffix.lower() == '.pdf':
            if process_type in ['ocr', 'all']:
                text = await pdf_service.extract_text_from_pdf(str(file_path))
                results['text'] = text
                results['word_count'] = len(text.split())
            
            if process_type in ['tts', 'all']:
                if 'text' in results:
                    audio_path = await tts_service.text_to_speech(
                        results['text'],
                        file_id
                    )
                    results['audio_url'] = f"/api/audio/{file_id}"
        else:
            # Processar imagem
            text_for_tts = ""
            
            if process_type in ['ocr', 'all']:
                text = await ocr_service.extract_text(str(file_path))
                results['text'] = text
                results['word_count'] = len(text.split()) if text else 0
                if text and text.strip() and text != "Nenhum texto foi detectado na imagem.":
                    text_for_tts = text
            
            if process_type in ['description', 'all']:
                description = await image_desc_service.describe_image(str(file_path))
                results['description'] = description
                # Usar descrição se não houver texto do OCR
                if not text_for_tts and description:
                    text_for_tts = description
            
            if process_type in ['tts', 'all']:
                if text_for_tts:
                    audio_path = await tts_service.text_to_speech(
                        text_for_tts,
                        file_id
                    )
                    results['audio_url'] = f"/api/audio/{file_id}"
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/audio/{file_id}")
async def get_audio(file_id: str):
    """Retorna arquivo de áudio gerado"""
    audio_path = OUTPUT_DIR / f"{file_id}.mp3"
    if not audio_path.exists():
        raise HTTPException(status_code=404, detail="Áudio não encontrado")
    return FileResponse(audio_path, media_type="audio/mpeg")

@app.post("/api/export")
async def export_content(export_request: ExportRequest):
    """
    Exporta conteúdo em diferentes formatos
    format: 'txt', 'srt' (legendas)
    """
    try:
        file_id = export_request.file_id
        format_type = export_request.format
        content = export_request.content
        
        if format_type == 'txt':
            output_path = OUTPUT_DIR / f"{file_id}_export.txt"
            async with aiofiles.open(output_path, 'w', encoding='utf-8') as f:
                await f.write(content)
            return FileResponse(
                str(output_path),
                media_type="text/plain; charset=utf-8",
                filename=f"voxaccess_{file_id}.txt",
                headers={"Content-Disposition": f'attachment; filename="voxaccess_{file_id}.txt"'}
            )
        elif format_type == 'srt':
            # Converter para formato SRT simples
            output_path = OUTPUT_DIR / f"{file_id}_export.srt"
            srt_content = f"1\n00:00:00,000 --> 00:00:10,000\n{content}\n"
            async with aiofiles.open(output_path, 'w', encoding='utf-8') as f:
                await f.write(srt_content)
            return FileResponse(
                str(output_path),
                media_type="text/plain; charset=utf-8",
                filename=f"voxaccess_{file_id}.srt",
                headers={"Content-Disposition": f'attachment; filename="voxaccess_{file_id}.srt"'}
            )
        else:
            raise HTTPException(status_code=400, detail="Formato não suportado. Use 'txt' ou 'srt'")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao exportar: {str(e)}")

@app.delete("/api/files/{file_id}")
async def delete_file(file_id: str):
    """Remove arquivos temporários"""
    try:
        # Remover arquivo original
        for ext in ['.jpg', '.jpeg', '.png', '.pdf']:
            file_path = UPLOAD_DIR / f"{file_id}{ext}"
            if file_path.exists():
                file_path.unlink()
        
        # Remover arquivos de saída
        for ext in ['.mp3', '_export.txt', '_export.srt']:
            output_path = OUTPUT_DIR / f"{file_id}{ext}"
            if output_path.exists():
                output_path.unlink()
        
        return {"message": "Arquivos removidos com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

