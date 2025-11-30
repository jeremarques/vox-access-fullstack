import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="mb-6 animate-fadeIn">
      <div className="bg-red-50 border-l-4 border-red-600 rounded p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-red-800 text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}

