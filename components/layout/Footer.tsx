import Link from 'next/link'
import { ClipboardCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500">
            <ClipboardCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-slate-700">Protokoll-Pro</span>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <span className="text-xs text-slate-400 hidden sm:inline">© {new Date().getFullYear()} Weserbergland Dienstleistungen</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            <Link href="/impressum" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">Datenschutz</Link>
            <Link href="/agb" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">AGB</Link>
            <a href="mailto:info@weserbergland-dienstleistungen.de" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">Kontakt</a>
          </nav>
        </div>
        <p className="text-xs text-slate-400 text-center sm:text-left mt-3 sm:hidden">© {new Date().getFullYear()} Weserbergland Dienstleistungen</p>
      </div>
    </footer>
  )
}
