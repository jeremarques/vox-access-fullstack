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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-transform">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent mb-4">
            VoxAccess
          </h1>
          <p className="text-2xl text-slate-700 mb-3 font-medium">
            Acessibilidade e IA para Todos
          </p>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transforme imagens, PDFs e documentos em conteúdo acessível com inteligência artificial
          </p>
        </header>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 mb-8 border border-white/20 relative z-10">
          {/* Upload Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Upload className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">
                Enviar Arquivo
              </h2>
            </div>

            {/* Drag and Drop Area */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-primary-500 bg-primary-50 scale-105 shadow-lg'
                  : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
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
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all ${
                  isDragging ? 'bg-primary-500 scale-110' : 'bg-gradient-to-br from-primary-400 to-primary-600'
                } shadow-lg`}>
                  <Upload className={`w-10 h-10 text-white transition-transform ${isDragging ? 'animate-bounce' : ''}`} />
                </div>
                <span className="text-xl font-semibold text-slate-700 mb-2">
                  {isDragging ? 'Solte o arquivo aqui' : 'Arraste e solte ou clique para selecionar'}
                </span>
                <span className="text-sm text-slate-500">
                  Suporta: JPG, PNG, PDF (máx. 10MB)
                </span>
              </label>
            </div>

            {/* File Preview */}
            {file && (
              <div className="mt-6 animate-fadeIn">
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-200 shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {imagePreview ? (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                          {getFileIcon() && (
                            <div className="text-white">
                              {getFileIcon()}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-5 h-5 text-primary-600 flex-shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <File className="w-4 h-4" />
                            {file.type === 'application/pdf' ? 'PDF' : file.type.split('/')[1].toUpperCase()}
                          </span>
                          <span>•</span>
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleReset}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Remover arquivo"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="flex-1 group relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
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
                </span>
                {!loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                )}
              </button>

              {fileId && (
                <button
                  onClick={handleProcess}
                  disabled={processing}
                  className="flex-1 group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processando com IA...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Processar Arquivo
                      </>
                    )}
                  </span>
                  {!processing && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-800 transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 animate-fadeIn">
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Resultados do Processamento
                </h2>
              </div>

              {/* Text/OCR Result */}
              {result.text && (
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FileText className="w-5 h-5 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">
                        Texto Extraído (OCR)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(result.text || '')}
                        className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Copiar texto"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {result.word_count && (
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                          {result.word_count} palavras
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 max-h-96 overflow-y-auto shadow-inner border border-slate-200">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
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
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Descrição da Imagem (IA)
                    </h3>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-inner border border-purple-200">
                    <p className="text-slate-700 leading-relaxed">{result.description}</p>
                  </div>
                </div>
              )}

              {/* Audio Player */}
              {result.audio_url && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Mic className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Áudio Gerado
                    </h3>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-inner border border-emerald-200">
                    <audio
                      controls
                      className="w-full h-12"
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
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => handleExport('txt')}
                    className="flex-1 group bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-4 rounded-xl font-semibold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Exportar como TXT
                  </button>
                  <button
                    onClick={() => handleExport('srt')}
                    className="flex-1 group bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-4 rounded-xl font-semibold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Exportar como SRT
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 relative z-10">
          <div className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              OCR Inteligente
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Extraia texto de imagens e PDFs escaneados com alta precisão usando tecnologia de reconhecimento óptico de caracteres
            </p>
          </div>
          <div className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              IA Descritiva
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Gere descrições automáticas de imagens usando inteligência artificial avançada para tornar conteúdo visual acessível
            </p>
          </div>
          <div className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              Texto para Voz
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Converta qualquer texto em áudio natural e claro, permitindo acesso auditivo ao conteúdo escrito
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-slate-600 text-sm relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <p className="font-medium">VoxAccess - Feira de Ciências 2024</p>
          </div>
          <p className="mt-3 text-slate-500">Acessibilidade e IA para Todos</p>
        </footer>
      </div>
    </div>
  )
}

export default App
