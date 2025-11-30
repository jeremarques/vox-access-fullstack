import { FileText, Brain, Volume2 } from 'lucide-react'
import FeatureCard from './FeatureCard'

export default function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: 'OCR Inteligente',
      description:
        'Extraia texto de imagens e PDFs escaneados com alta precisão usando tecnologia de reconhecimento óptico de caracteres',
    },
    {
      icon: Brain,
      title: 'IA Descritiva',
      description:
        'Gere descrições automáticas de imagens usando inteligência artificial avançada para tornar conteúdo visual acessível',
    },
    {
      icon: Volume2,
      title: 'Texto para Voz',
      description:
        'Converta qualquer texto em áudio natural e claro, permitindo acesso auditivo ao conteúdo escrito',
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  )
}

