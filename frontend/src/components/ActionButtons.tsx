import { Upload, Zap, Loader2 } from 'lucide-react'

interface ActionButtonsProps {
  file: File | null
  fileId: string | null
  loading: boolean
  processing: boolean
  onUpload: () => void
  onProcess: () => void
}

export default function ActionButtons({
  file,
  fileId,
  loading,
  processing,
  onUpload,
  onProcess,
}: ActionButtonsProps) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <button
        onClick={onUpload}
        disabled={!file || loading}
        className="flex-1 bg-primary-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-800 disabled:bg-primary-800/15 disabled:text-primary-800/50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Fazer Upload
          </>
        )}
      </button>

      {fileId && (
        <button
          onClick={onProcess}
          disabled={processing}
          className="flex-1 bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-900 disabled:bg-primary-800/15 disabled:text-primary-800/50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Processar Arquivo
            </>
          )}
        </button>
      )}
    </div>
  )
}

