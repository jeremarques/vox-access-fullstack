from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch

class ImageDescriptionService:
    def __init__(self):
        # Carregar modelo BLIP para descrição de imagens
        # Modelo gratuito e open-source
        self.processor = None
        self.model = None
        self._model_loaded = False
    
    def _load_model(self):
        """Carrega o modelo BLIP (lazy loading)"""
        if not self._model_loaded:
            try:
                print("Carregando modelo BLIP...")
                self.processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
                self.model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
                # Usar CPU se GPU não estiver disponível
                self.device = "cuda" if torch.cuda.is_available() else "cpu"
                self.model.to(self.device)
                self._model_loaded = True
                print("Modelo BLIP carregado com sucesso!")
            except Exception as e:
                print(f"Erro ao carregar modelo BLIP: {e}")
                self._model_loaded = False
    
    async def describe_image(self, image_path: str) -> str:
        """Gera descrição de uma imagem usando IA"""
        try:
            self._load_model()
            
            if not self._model_loaded:
                return "Descrição de imagem não disponível no momento. Por favor, use apenas OCR."
            
            # Abrir imagem
            image = Image.open(image_path).convert('RGB')
            
            # Processar imagem
            inputs = self.processor(image, return_tensors="pt").to(self.device)
            
            # Gerar descrição
            out = self.model.generate(**inputs, max_length=50, num_beams=3)
            description = self.processor.decode(out[0], skip_special_tokens=True)
            
            return description
        except Exception as e:
            # Se falhar, retornar mensagem genérica
            return f"Erro ao gerar descrição: {str(e)}. Use a função OCR para extrair texto."

