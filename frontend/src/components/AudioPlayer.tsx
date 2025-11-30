import { Mic } from 'lucide-react'

interface AudioPlayerProps {
  audioUrl: string
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const fullUrl = audioUrl?.startsWith('http')
    ? audioUrl
    : `http://localhost:8000${audioUrl}`

  return (
    <div className="bg-primary-50/30 rounded-lg p-5 border border-primary-100">
      <div className="flex items-center gap-3 mb-4">
        <Mic className="w-5 h-5 text-primary-700" />
        <h3 className="font-semibold text-primary-900">Áudio Gerado</h3>
      </div>
      <div className="bg-white rounded border border-primary-100 p-3 shadow-sm">
        <audio controls className="w-full h-10" src={fullUrl}>
          Seu navegador não suporta áudio.
        </audio>
      </div>
    </div>
  )
}

