import { FileText, Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface TextResultProps {
  text: string
  wordCount?: number
}

export default function TextResult({ text, wordCount }: TextResultProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-primary-50/30 rounded-lg p-5 border border-primary-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary-700" />
          <h3 className="font-semibold text-primary-900">Texto Extraído (OCR)</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={copyToClipboard}
            className="p-2 text-primary-600 hover:text-primary-800 hover:bg-primary-100 rounded transition-colors"
            title="Copiar texto"
          >
            <Copy className="w-4 h-4" />
          </button>
          {wordCount && (
            <span className="px-3 py-1 bg-primary-200 text-primary-800 rounded text-sm font-medium">
              {wordCount} palavras
            </span>
          )}
        </div>
      </div>
      <div className="bg-white rounded border border-primary-100 p-4 max-h-96 overflow-y-auto shadow-sm">
        <p className="text-primary-800 whitespace-pre-wrap leading-relaxed text-sm">
          {text}
        </p>
      </div>
      {copied && (
        <div className="mt-3 text-sm text-green-600 flex items-center gap-1 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Texto copiado para a área de transferência!
        </div>
      )}
    </div>
  )
}

