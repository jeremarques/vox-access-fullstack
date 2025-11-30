from pydantic import BaseModel

class ExportRequest(BaseModel):
    file_id: str
    format: str
    content: str

