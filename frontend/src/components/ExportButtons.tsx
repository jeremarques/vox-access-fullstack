import { Download } from 'lucide-react'

interface ExportButtonsProps {
  onExport: (format: 'txt' | 'srt') => void
}

export default function ExportButtons({ onExport }: ExportButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-primary-100">
      <button
        onClick={() => onExport('txt')}
        className="flex-1 bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-900 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
      >
        <Download className="w-4 h-4" />
        Exportar como TXT
      </button>
      <button
        onClick={() => onExport('srt')}
        className="flex-1 bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-900 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
      >
        <Download className="w-4 h-4" />
        Exportar como SRT
      </button>
    </div>
  )
}

