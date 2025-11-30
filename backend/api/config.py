from pathlib import Path

# Diretórios
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")

# Criar diretórios se não existirem
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Tipos de arquivo permitidos
ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]

# CORS origins
CORS_ORIGINS = ["http://localhost:5173", "http://localhost:3000"]

