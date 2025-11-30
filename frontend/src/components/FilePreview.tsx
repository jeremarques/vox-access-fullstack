import { X, FileText, Image as ImageIcon, File } from 'lucide-react'
import { formatFileSize } from '../utils'

interface FilePreviewProps {
  file: File
  imagePreview: string | null
  onRemove: () => void
}

export default function FilePreview({
  file,
  imagePreview,
  onRemove,
}: FilePreviewProps) {
  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-6 h-6" />
    }
    return <File className="w-6 h-6" />
  }

  return (
    <div className="mt-6 animate-fadeIn">
      <div className="bg-primary-50/30 rounded-lg p-4 border border-primary-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {imagePreview ? (
              <div className="relative w-20 h-20 rounded border border-primary-100 overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-primary-100 rounded border border-primary-100 flex items-center justify-center flex-shrink-0">
                <div className="text-primary-700">{getFileIcon()}</div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <span className="font-medium text-primary-900 truncate">
                  {file.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-600">
                <span>
                  {file.type === 'application/pdf'
                    ? 'PDF'
                    : file.type.split('/')[1].toUpperCase()}
                </span>
                <span>•</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-2 text-primary-400 hover:text-primary-700 hover:bg-primary-100 rounded transition-colors flex-shrink-0"
            title="Remover arquivo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

