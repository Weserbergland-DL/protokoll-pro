'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ClipboardCheck, ShieldCheck, Zap, Smartphone, Camera, FileSignature, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Landing() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  if (user) return null

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-24 sm:py-32 text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
          <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="mx-auto max-w-3xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
              <ClipboardCheck className="h-3.5 w-3.5" /> 1. Protokoll kostenlos – kein Risiko
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
              Professionelle Übergabe&shy;protokolle –{' '}
              <span className="text-primary">in wenigen Minuten.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 leading-relaxed">
              Mängel fotografieren, Zählerstände erfassen, digital unterschreiben.
              Fertig als rechtssicheres PDF – direkt auf dem Smartphone.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login?mode=signup">
                <Button size="lg" className="px-8 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all">
                  Kostenlos starten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="text-slate-600">Preise ansehen</Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">Keine Kreditkarte. Kein Abo. Sofort starten.</p>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-slate-100 bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold text-slate-900 mb-12">So einfach geht's</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { step: '1', icon: ClipboardCheck, title: 'Daten erfassen', desc: 'Mieter, Wohnung und Räume in wenigen Klicks anlegen.' },
                { step: '2', icon: Camera, title: 'Mängel dokumentieren', desc: 'Fotos aufnehmen, Zählerstände eintragen, Schlüssel notieren.' },
                { step: '3', icon: FileSignature, title: 'Unterschreiben & fertig', desc: 'Beide Parteien unterschreiben digital. PDF sofort verfügbar.' },
              ].map((item) => (
                <div key={item.step} className="relative flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 sm:right-auto sm:-top-2 sm:left-12 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold text-slate-900 mb-12">Alles, was Sie brauchen</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { icon: Smartphone, title: 'Mobil optimiert', desc: 'Designed für die Nutzung vor Ort – ohne Laptop, ohne Papier.', color: 'bg-blue-50 text-blue-600' },
                { icon: ShieldCheck, title: 'Rechtssicher', desc: 'Digitale Signaturen und lückenlose Dokumentation für den Streitfall.', color: 'bg-emerald-50 text-emerald-600' },
                { icon: Zap, title: 'Sofort einsatzbereit', desc: 'Kein Download, kein Setup. Einfach anmelden und loslegen.', color: 'bg-amber-50 text-amber-600' },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-start rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-1.5 text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mx-6 mb-16 rounded-3xl bg-gradient-to-br from-primary to-blue-700 px-8 py-14 text-center text-white shadow-xl shadow-primary/20">
          <h2 className="text-2xl sm:text-3xl font-bold">Ihr erstes Protokoll ist kostenlos.</h2>
          <p className="mt-3 text-white/80 max-w-md mx-auto text-sm sm:text-base">
            Registrieren Sie sich jetzt und überzeugen Sie sich selbst – ohne Kreditkarte, ohne Risiko.
          </p>
          <div className="mt-8">
            <Link href="/login?mode=signup">
              <Button size="lg" variant="secondary" className="px-8 bg-white text-primary hover:bg-slate-50 shadow-sm font-semibold">
                Jetzt kostenlos testen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
