from PyPDF2 import PdfReader
from pdf2image import convert_from_path
import pytesseract
from PIL import Image
import os

class PDFService:
    def __init__(self):
        pass
    
    async def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extrai texto de um PDF"""
        try:
            text_content = []
            
            # Tentar extrair texto diretamente (PDF com texto)
            try:
                reader = PdfReader(pdf_path)
                for page_num, page in enumerate(reader.pages):
                    text = page.extract_text()
                    if text.strip():
                        text_content.append(text)
                
                if text_content:
                    return "\n\n".join(text_content)
            except Exception as e:
                print(f"Erro ao extrair texto direto: {e}")
            
            # Se não houver texto, usar OCR nas páginas
            try:
                # Converter PDF para imagens
                images = convert_from_path(pdf_path, dpi=200)
                
                for i, image in enumerate(images):
                    # Aplicar OCR na imagem
                    custom_config = r'--oem 3 --psm 6'
                    text = pytesseract.image_to_string(image, config=custom_config, lang='por')
                    if text.strip():
                        text_content.append(f"--- Página {i+1} ---\n{text}")
                
                if text_content:
                    return "\n\n".join(text_content)
                else:
                    return "Não foi possível extrair texto do PDF."
            except Exception as e:
                # Se pdf2image não estiver disponível, retornar erro
                if "pdf2image" in str(e).lower():
                    return "Para processar PDFs escaneados, instale poppler: brew install poppler (macOS) ou sudo apt-get install poppler-utils (Linux)"
                raise Exception(f"Erro ao processar PDF: {str(e)}")
                
        except Exception as e:
            raise Exception(f"Erro ao extrair texto do PDF: {str(e)}")

