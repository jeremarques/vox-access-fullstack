from gtts import gTTS
from pathlib import Path
import asyncio
import os

class TTSService:
    def __init__(self):
        self.output_dir = Path("outputs")
        self.output_dir.mkdir(exist_ok=True)
    
    async def text_to_speech(self, text: str, file_id: str) -> str:
        """Converte texto em áudio usando gTTS"""
        try:
            # Limitar tamanho do texto (gTTS tem limite)
            if len(text) > 5000:
                text = text[:5000] + "..."
            
            # Criar objeto gTTS
            tts = gTTS(text=text, lang='pt-br', slow=False)
            
            # Salvar áudio
            audio_path = self.output_dir / f"{file_id}.mp3"
            
            # Executar em thread separada (gTTS não é async)
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: tts.save(str(audio_path))
            )
            
            return str(audio_path)
        except Exception as e:
            raise Exception(f"Erro ao gerar áudio: {str(e)}")

