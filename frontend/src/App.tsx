import { useState, useRef, useCallback } from 'react'
import { Upload } from 'lucide-react'
import axios from 'axios'
import { ProcessResult } from './types'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import FilePreview from './components/FilePreview'
import ActionButtons from './components/ActionButtons'
import ErrorMessage from './components/ErrorMessage'
import ProcessResults from './components/ProcessResults'
import FeaturesSection from './components/FeaturesSection'
import Footer from './components/Footer'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [fileId, setFileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<ProcessResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      dragCounter.current = 0

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFile = e.dataTransfer.files[0]
        if (
          droppedFile.type.startsWith('image/') ||
          droppedFile.type === 'application/pdf'
        ) {
          handleFileChange(droppedFile)
        } else {
          setError('Por favor, selecione apenas imagens (JPG, PNG) ou PDFs')
        }
      }
    },
    [handleFileChange]
  )

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
      const errorMessage =
        err.response?.data?.detail || err.message || 'Erro ao exportar arquivo'
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Header />

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-md border border-primary-100 p-8 mb-8">
          {/* Upload Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-5 h-5 text-primary-700" />
              <h2 className="text-xl font-semibold text-primary-900">
                Enviar Arquivo
              </h2>
            </div>

            <FileUpload
              isDragging={isDragging}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onFileSelect={handleFileInputChange}
              fileInputRef={fileInputRef}
            />

            {file && (
              <FilePreview
                file={file}
                imagePreview={imagePreview}
                onRemove={handleReset}
              />
            )}

            <ActionButtons
              file={file}
              fileId={fileId}
              loading={loading}
              processing={processing}
              onUpload={handleUpload}
              onProcess={handleProcess}
            />
          </div>

          {error && <ErrorMessage message={error} />}

          {result && fileId && (
            <ProcessResults
              result={result}
              fileId={fileId}
              onExport={handleExport}
            />
          )}
        </div>

        <FeaturesSection />
        <Footer />
      </div>
    </div>
  )
}

export default App
