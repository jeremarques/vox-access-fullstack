import pytesseract
from PIL import Image
import os

class OCRService:
    def __init__(self):
        # Configurar caminho do Tesseract se necessário
        pass
    
    async def extract_text(self, image_path: str) -> str:
        """Extrai texto de uma imagem usando OCR"""
        try:
            # Abrir imagem
            image = Image.open(image_path)
            
            # Aplicar OCR
            # Configuração para melhorar precisão
            custom_config = r'--oem 3 --psm 6'
            text = pytesseract.image_to_string(image, config=custom_config, lang='por')
            
            # Limpar texto
            text = text.strip()
            
            if not text:
                return "Nenhum texto foi detectado na imagem."
            
            return text
        except Exception as e:
            raise Exception(f"Erro ao processar OCR: {str(e)}")

