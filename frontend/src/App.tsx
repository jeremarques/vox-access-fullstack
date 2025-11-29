import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, Volume2, Download, Loader2, X, Image as ImageIcon, File, Sparkles, CheckCircle2, AlertCircle, Copy, Zap, Brain, Mic } from 'lucide-react'
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
  const [isDragging, setIsDragging] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const handleFileChange = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    setError(null)
    
    // Criar preview se for imagem
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setImagePreview(null)
    }
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith('image/') || droppedFile.type === 'application/pdf') {
        handleFileChange(droppedFile)
      } else {
        setError('Por favor, selecione apenas imagens (JPG, PNG) ou PDFs')
      }
    }
  }, [handleFileChange])

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
    if (!result || !fileId) {
      setError('Nenhum conteúdo disponível para exportar')
      return
    }

    const content = result.text || result.description || ''
    
    if (!content || content.trim() === '') {
      setError('Nenhum conteúdo disponível para exportar')
      return
    }

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
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      // Criar URL do blob e fazer download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `voxaccess_${fileId}.${format}`)
      document.body.appendChild(link)
      link.click()
      
      // Limpar
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (err: any) {
      console.error('Erro ao exportar:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Erro ao exportar arquivo'
      setError(`Erro ao exportar: ${errorMessage}`)
    }
  }

  const handleReset = () => {
    setFile(null)
    setFileId(null)
    setResult(null)
    setError(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getFileIcon = () => {
    if (!file) return null
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-6 h-6" />
    }
    return <File className="w-6 h-6" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-lg mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            VoxAccess
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Acessibilidade e IA para Todos
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            Transforme imagens, PDFs e documentos em conteúdo acessível com inteligência artificial
          </p>
        </header>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          {/* Upload Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Enviar Arquivo
              </h2>
            </div>

            {/* Drag and Drop Area */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  isDragging ? 'bg-primary-500' : 'bg-gray-200'
                }`}>
                  <Upload className={`w-8 h-8 ${isDragging ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <span className="text-base font-medium text-gray-700 mb-2">
                  {isDragging ? 'Solte o arquivo aqui' : 'Arraste e solte ou clique para selecionar'}
                </span>
                <span className="text-sm text-gray-500">
                  Suporta: JPG, PNG, PDF (máx. 10MB)
                </span>
              </label>
            </div>

            {/* File Preview */}
            {file && (
              <div className="mt-6 animate-fadeIn">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {imagePreview ? (
                        <div className="relative w-20 h-20 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded border border-gray-300 flex items-center justify-center flex-shrink-0">
                          {getFileIcon() && (
                            <div className="text-gray-500">
                              {getFileIcon()}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="font-medium text-gray-900 truncate">
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{file.type === 'application/pdf' ? 'PDF' : file.type.split('/')[1].toUpperCase()}</span>
                          <span>•</span>
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleReset}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                      title="Remover arquivo"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
                  onClick={handleProcess}
                  disabled={processing}
                  className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 animate-fadeIn">
              <div className="bg-red-50 border-l-4 border-red-500 rounded p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="space-y-6 animate-fadeIn border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Resultados do Processamento
                </h2>
              </div>

              {/* Text/OCR Result */}
              {result.text && (
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">
                        Texto Extraído (OCR)
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => copyToClipboard(result.text || '')}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        title="Copiar texto"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {result.word_count && (
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium">
                          {result.word_count} palavras
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-4 max-h-96 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                      {result.text}
                    </p>
                  </div>
                  {copied && (
                    <div className="mt-3 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Texto copiado para a área de transferência!
                    </div>
                  )}
                </div>
              )}

              {/* Image Description */}
              {result.description && (
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Descrição da Imagem (IA)
                    </h3>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-4">
                    <p className="text-gray-700 leading-relaxed text-sm">{result.description}</p>
                  </div>
                </div>
              )}

              {/* Audio Player */}
              {result.audio_url && (
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Mic className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Áudio Gerado
                    </h3>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-3">
                    <audio
                      controls
                      className="w-full h-10"
                      src={result.audio_url?.startsWith('http') 
                        ? result.audio_url 
                        : `http://localhost:8000${result.audio_url}`}
                    >
                      Seu navegador não suporta áudio.
                    </audio>
                  </div>
                </div>
              )}

              {/* Export Buttons */}
              {(result.text || result.description) && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleExport('txt')}
                    className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exportar como TXT
                  </button>
                  <button
                    onClick={() => handleExport('srt')}
                    className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exportar como SRT
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              OCR Inteligente
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Extraia texto de imagens e PDFs escaneados com alta precisão usando tecnologia de reconhecimento óptico de caracteres
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              IA Descritiva
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Gere descrições automáticas de imagens usando inteligência artificial avançada para tornar conteúdo visual acessível
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Texto para Voz
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Converta qualquer texto em áudio natural e claro, permitindo acesso auditivo ao conteúdo escrito
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm">
          <p className="font-medium">VoxAccess - Feira de Ciências 2024</p>
          <p className="mt-1">Acessibilidade e IA para Todos</p>
        </footer>
      </div>
    </div>
  )
}

export default App
