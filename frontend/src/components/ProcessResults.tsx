import { CheckCircle2 } from 'lucide-react'
import { ProcessResult } from '../types'
import TextResult from './TextResult'
import ImageDescription from './ImageDescription'
import AudioPlayer from './AudioPlayer'
import ExportButtons from './ExportButtons'

interface ProcessResultsProps {
  result: ProcessResult
  fileId: string | null
  onExport: (format: 'txt' | 'srt') => void
}

export default function ProcessResults({
  result,
  fileId,
  onExport,
}: ProcessResultsProps) {
  return (
    <div className="space-y-6 animate-fadeIn border-t border-primary-100 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-semibold text-primary-900">
          Resultados do Processamento
        </h2>
      </div>

      {result.text && (
        <TextResult text={result.text} wordCount={result.word_count} />
      )}

      {result.description && (
        <ImageDescription description={result.description} />
      )}

      {result.audio_url && <AudioPlayer audioUrl={result.audio_url} />}

      {(result.text || result.description) && fileId && (
        <ExportButtons onExport={onExport} />
      )}
    </div>
  )
}

