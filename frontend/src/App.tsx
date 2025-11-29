import { useState } from 'react'
import { Upload, FileText, Volume2, Download, Loader2, X } from 'lucide-react'
import axios from 'axios'

interface ProcessResult {
  text?: string
  description?: string
  audio_url?: string
  word_count?: number
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [fileId, setFileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<ProcessResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setFileId(response.data.file_id)
      setLoading(false)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao fazer upload do arquivo')
      setLoading(false)
    }
  }

  const handleProcess = async () => {
    if (!fileId) return

    setProcessing(true)
    setError(null)

    try {
      const response = await axios.post('/api/process', null, {
        params: {
          file_id: fileId,
          process_type: 'all',
        },
      })

      setResult(response.data)
      setProcessing(false)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao processar arquivo')
      setProcessing(false)
    }
  }

  const handleExport = async (format: 'txt' | 'srt') => {
    if (!result || !fileId) return

    const content = result.text || result.description || ''

    try {
      const response = await axios.post(
        '/api/export',
        {
          file_id: fileId,
          format,
          content,
        },
        {
          responseType: 'blob',
        }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `voxaccess_${fileId}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err: any) {
      setError('Erro ao exportar arquivo')
    }
  }

  const handleReset = () => {
    setFile(null)
    setFileId(null)
    setResult(null)
    setError(null)
    const input = document.getElementById('file-input') as HTMLInputElement
    if (input) input.value = ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-800 mb-4">
            VoxAccess
          </h1>
          <p className="text-xl text-primary-600 mb-2">
            Acessibilidade e IA para Todos
          </p>
          <p className="text-primary-500">
            Converta imagens, PDFs e documentos em áudio e texto acessível
          </p>
        </header>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Upload Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">
              Upload de Arquivo
            </h2>
            <div className="border-2 border-dashed border-primary-300 rounded-lg p-8 text-center">
              <input
                id="file-input"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-16 h-16 text-primary-500 mb-4" />
                <span className="text-primary-700 font-medium">
                  Clique para selecionar ou arraste um arquivo
                </span>
                <span className="text-sm text-primary-500 mt-2">
                  Suporta: JPG, PNG, PDF
                </span>
              </label>
            </div>

            {file && (
              <div className="mt-4 p-4 bg-primary-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span className="text-primary-800 font-medium">
                    {file.name}
                  </span>
                  <span className="text-sm text-primary-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-primary-600 hover:text-primary-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Fazendo Upload...
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
                  onClick={handleProcess}
                  disabled={processing}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Processar Arquivo
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-primary-800">
                Resultados
              </h2>

              {/* Text/OCR Result */}
              {result.text && (
                <div className="bg-primary-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-primary-800 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Texto Extraído (OCR)
                  </h3>
                  <div className="bg-white rounded p-4 max-h-64 overflow-y-auto">
                    <p className="text-primary-700 whitespace-pre-wrap">
                      {result.text}
                    </p>
                  </div>
                  {result.word_count && (
                    <p className="text-sm text-primary-600 mt-2">
                      {result.word_count} palavras encontradas
                    </p>
                  )}
                </div>
              )}

              {/* Image Description */}
              {result.description && (
                <div className="bg-primary-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-primary-800 mb-3">
                    Descrição da Imagem (IA)
                  </h3>
                  <div className="bg-white rounded p-4">
                    <p className="text-primary-700">{result.description}</p>
                  </div>
                </div>
              )}

              {/* Audio Player */}
              {result.audio_url && (
                <div className="bg-primary-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-primary-800 mb-3 flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Áudio Gerado
                  </h3>
                  <audio
                    controls
                    className="w-full"
                    src={result.audio_url?.startsWith('http') 
                      ? result.audio_url 
                      : `http://localhost:8000${result.audio_url}`}
                  >
                    Seu navegador não suporta áudio.
                  </audio>
                </div>
              )}

              {/* Export Buttons */}
              <div className="flex gap-4 pt-4">
                {(result.text || result.description) && (
                  <>
                    <button
                      onClick={() => handleExport('txt')}
                      className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Exportar como TXT
                    </button>
                    <button
                      onClick={() => handleExport('srt')}
                      className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Exportar como SRT
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <FileText className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-primary-800 mb-2">
              OCR Inteligente
            </h3>
            <p className="text-primary-600">
              Extraia texto de imagens e PDFs escaneados com precisão
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Volume2 className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-primary-800 mb-2">
              Texto para Voz
            </h3>
            <p className="text-primary-600">
              Converta qualquer texto em áudio natural e claro
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Download className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-primary-800 mb-2">
              Múltiplos Formatos
            </h3>
            <p className="text-primary-600">
              Exporte em TXT, SRT ou ouça diretamente no navegador
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-primary-600 text-sm">
          <p>VoxAccess - Feira de Ciências 2024</p>
          <p className="mt-2">Acessibilidade e IA para Todos</p>
        </footer>
      </div>
    </div>
  )
}

export default App

