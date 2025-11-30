import { Upload } from 'lucide-react'

interface FileUploadProps {
  isDragging: boolean
  onDragEnter: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export default function FileUpload({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  fileInputRef,
}: FileUploadProps) {
  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
        isDragging
          ? 'border-primary-600 bg-primary-50/50'
          : 'border-primary-200 hover:border-primary-300 bg-primary-50/20'
      }`}
    >
      <input
        ref={fileInputRef}
        id="file-input"
        type="file"
        accept="image/*,.pdf"
        onChange={onFileSelect}
        className="hidden"
      />
      <label
        htmlFor="file-input"
        className="cursor-pointer flex flex-col items-center"
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
            isDragging ? 'bg-primary-700' : 'bg-primary-100'
          }`}
        >
          <Upload
            className={`w-8 h-8 ${isDragging ? 'text-white' : 'text-primary-700'}`}
          />
        </div>
        <span className="text-base font-medium text-primary-900 mb-2">
          {isDragging
            ? 'Solte o arquivo aqui'
            : 'Arraste e solte ou clique para selecionar'}
        </span>
        <span className="text-sm text-primary-600">
          Suporta: JPG, PNG, PDF (máx. 10MB)
        </span>
      </label>
    </div>
  )
}

