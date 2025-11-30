import { Brain } from 'lucide-react'

interface ImageDescriptionProps {
  description: string
}

export default function ImageDescription({
  description,
}: ImageDescriptionProps) {
  return (
    <div className="bg-primary-50/30 rounded-lg p-5 border border-primary-100">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-5 h-5 text-primary-700" />
        <h3 className="font-semibold text-primary-900">Descrição da Imagem (IA)</h3>
      </div>
      <div className="bg-white rounded border border-primary-100 p-4 shadow-sm">
        <p className="text-primary-800 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  )
}

