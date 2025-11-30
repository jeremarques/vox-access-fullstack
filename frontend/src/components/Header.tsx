import logo from '../assets/logo-voxaccess.svg'

export default function Header() {
  return (
    <header className="text-center mb-16 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-primary-200/15 rounded-full blur-2xl"></div>
        <div className="absolute top-20 left-1/4 w-48 h-48 bg-primary-300/10 rounded-full blur-xl"></div>
      </div>

      {/* Logo */}
      <div className="inline-flex items-center justify-center w-72 mb-10 relative">
        <div className="absolute inset-0 bg-primary-50/50 rounded-full blur-2xl -z-10"></div>
        <img src={logo} alt="VoxAccess Logo" className="drop-shadow-sm" />
      </div>

      {/* Title */}
      <p className="text-md text-primary-700 max-w-xl mx-auto leading-relaxed">
        Transforme imagens, PDFs e documentos em áudio com inteligência artificial
      </p>

      {/* Feature badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
        <span className="px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100">
          OCR Inteligente
        </span>
        <span className="px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100">
          IA Descritiva
        </span>
        <span className="px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100">
          Texto para Voz
        </span>
      </div>
    </header>
  )
}

