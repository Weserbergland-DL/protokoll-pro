'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Check, Zap, ArrowRight, Mail } from 'lucide-react'
import { toast } from 'sonner'
import Header from '@/components/layout/Header'
import Link from 'next/link'

const PLANS = [
  {
    id: 'free',
    name: 'Gratis',
    description: 'Zum Ausprobieren',
    price: 0,
    unit: '',
    count: 1,
    perProtocol: null,
    originalTotal: null,
    savings: null,
    features: [
      '1 Protokoll inklusive',
      'PDF-Export',
      'Digitale Signatur',
      'Fotos & Zählerstände',
    ],
    cta: 'Kostenlos starten',
    ctaVariant: 'outline' as const,
    href: '/login?mode=signup',
    priceKey: null,
    popular: false,
  },
  {
    id: 'single',
    name: 'Einzeln',
    description: 'Für einmaligen Bedarf',
    price: 9.99,
    unit: '/ Protokoll',
    count: 1,
    perProtocol: 9.99,
    originalTotal: null,
    savings: null,
    features: [
      '1 Protokoll',
      'PDF-Export',
      'Digitale Signatur',
      'Fotos & Zählerstände',
      'Einmalzahlung, kein Abo',
    ],
    cta: 'Jetzt kaufen',
    ctaVariant: 'outline' as const,
    href: null,
    priceKey: 'NEXT_PUBLIC_STRIPE_PRICE_ONDEMAND',
    popular: false,
  },
  {
    id: '10pack',
    name: '10er-Paket',
    description: 'Ideal für Privatvermieter',
    price: 19.99,
    unit: '/ 10 Protokolle',
    count: 10,
    perProtocol: 2.00,
    originalTotal: 99.90,
    savings: 80,
    features: [
      '10 Protokolle',
      'PDF-Export',
      'Digitale Signatur',
      'Fotos & Zählerstände',
      'Einmalzahlung, kein Abo',
    ],
    cta: 'Jetzt kaufen',
    ctaVariant: 'default' as const,
    href: null,
    priceKey: 'NEXT_PUBLIC_STRIPE_PRICE_10PACK',
    popular: true,
  },
  {
    id: '50pack',
    name: '50er-Paket',
    description: 'Für Makler & Hausverwaltungen',
    price: 39.99,
    unit: '/ 50 Protokolle',
    count: 50,
    perProtocol: 0.80,
    originalTotal: 499.50,
    savings: 92,
    features: [
      '50 Protokolle',
      'PDF-Export',
      'Digitale Signatur',
      'Fotos & Zählerstände',
      'Einmalzahlung, kein Abo',
    ],
    cta: 'Jetzt kaufen',
    ctaVariant: 'outline' as const,
    href: null,
    priceKey: 'NEXT_PUBLIC_STRIPE_PRICE_50PACK',
    popular: false,
  },
]

export default function Pricing() {
  const { user } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceKey: string) => {
    if (!user) {
      toast.error('Bitte melden Sie sich an, um ein Paket zu buchen.')
      return
    }
    const priceId = process.env[priceKey as keyof typeof process.env] as string
    try {
      setLoading(priceKey)
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, mode: 'payment' }),
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      if (data.url) window.location.href = data.url
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Weiterleiten zu Stripe.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Je mehr, desto günstiger
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Kaufen Sie Protokolle im Paket und sparen Sie bis zu 92 % gegenüber dem Einzelpreis. Kein Abo, keine versteckten Kosten.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto items-start">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`relative flex flex-col rounded-2xl border bg-white shadow-sm transition-all ${plan.popular ? 'border-primary border-2 shadow-lg shadow-primary/10 ring-0' : 'border-slate-200'}`}>

              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow whitespace-nowrap">
                    <Zap className="h-3 w-3" /> Beliebt
                  </span>
                </div>
              )}

              <div className={`p-6 flex flex-col flex-1 ${plan.popular ? 'pt-8' : ''}`}>

                {/* Plan name & desc */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{plan.name}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mt-5 mb-1">
                  {plan.originalTotal && (
                    <p className="text-xs text-slate-400 line-through mb-0.5">
                      Statt {plan.originalTotal.toFixed(2).replace('.', ',')} €
                    </p>
                  )}
                  <div className="flex items-end gap-1.5">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {plan.price === 0 ? '0 €' : `${plan.price.toFixed(2).replace('.', ',')} €`}
                    </span>
                    {plan.unit && <span className="text-slate-400 text-sm mb-0.5">{plan.unit}</span>}
                  </div>
                </div>

                {/* Per-protocol price + savings badge */}
                {plan.perProtocol !== null ? (
                  <div className="flex items-center gap-2 mt-1 mb-5">
                    <span className="text-sm text-slate-500">
                      = <strong className={plan.popular ? 'text-primary' : 'text-slate-700'}>{plan.perProtocol.toFixed(2).replace('.', ',')} €</strong> / Protokoll
                    </span>
                    {plan.savings !== null && (
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        -{plan.savings} %
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="mb-5 mt-1">
                    <span className="text-sm text-slate-400">1 kostenlos enthalten</span>
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-6">
                  {plan.href ? (
                    <Link href={plan.href} className="block">
                      <Button variant={plan.ctaVariant} className="w-full">{plan.cta}</Button>
                    </Link>
                  ) : (
                    <Button
                      variant={plan.ctaVariant}
                      className="w-full"
                      onClick={() => plan.priceKey && handleSubscribe(plan.priceKey)}
                      disabled={loading === plan.priceKey}
                    >
                      {loading === plan.priceKey ? 'Lädt...' : plan.cta}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Savings comparison bar */}
        <div className="mt-10 max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Preisvergleich pro Protokoll</p>
          <div className="space-y-3">
            {[
              { label: 'Einzeln', per: 9.99, pct: 100, color: 'bg-slate-200' },
              { label: '10er-Paket', per: 2.00, pct: 20, color: 'bg-primary', highlight: true },
              { label: '50er-Paket', per: 0.80, pct: 8, color: 'bg-primary/50' },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className={`w-24 text-sm shrink-0 ${row.highlight ? 'font-bold text-primary' : 'text-slate-600'}`}>{row.label}</span>
                <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.color} transition-all`}
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className={`w-20 text-right text-sm font-semibold shrink-0 ${row.highlight ? 'text-primary' : 'text-slate-700'}`}>
                  {row.per.toFixed(2).replace('.', ',')} € / Stk
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise banner */}
        <div className="mt-6 max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Mehr als 50 Protokolle?</p>
            <h3 className="text-xl font-bold text-white">Individuelles Angebot</h3>
            <p className="text-slate-300 text-sm mt-1">
              Für Hausverwaltungen, Immobilienbüros und Agenturen erstellen wir ein maßgeschneidertes Angebot.
            </p>
          </div>
          <a href="mailto:hallo@protokoll-pro.de" className="shrink-0">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold gap-2 shadow-sm">
              <Mail className="h-4 w-4" />
              Angebot anfragen
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Alle Preise zzgl. gesetzl. MwSt. · Einmalzahlung · Kein Abo · Sofort verfügbar
        </p>
      </main>
    </div>
  )
}
