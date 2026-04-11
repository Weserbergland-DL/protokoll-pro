'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ClipboardCheck, Heart, MessageSquare, Bug, Lightbulb, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export default function BetaPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [type, setType] = useState('feedback')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    try {
      await supabase.from('beta_feedback').insert({
        user_id: user?.id ?? null,
        user_email: user?.email ?? null,
        type,
        message: message.trim(),
      })
      setSent(true)
      toast.success('Vielen Dank für Ihr Feedback!')
    } catch {
      toast.error('Fehler beim Senden – bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ClipboardCheck className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-slate-900">Protokoll-Pro</span>
          </Link>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Beta-Phase – kostenlose Nutzung</h1>
              <p className="text-xs text-slate-400">Aktuell kein Zahlungsvorgang notwendig</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            Protokoll-Pro befindet sich aktuell in der Beta-Phase. Wir nehmen in dieser Zeit <strong>kein Geld</strong> für die Nutzung — Sie können alle Funktionen vollständig und kostenlos nutzen.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed mt-3">
            Im Gegenzug würden wir uns sehr über Ihr ehrliches Feedback freuen: Was funktioniert gut? Was fehlt? Was könnte besser sein? Jede Rückmeldung hilft uns, die App weiterzuentwickeln.
          </p>
        </div>

        {/* Feedback Form */}
        {!sent ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700">Feedback geben (optional)</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Art des Feedbacks</Label>
                <Select value={type} onValueChange={(v) => { if (v) setType(v) }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feedback">
                      <div className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" /> Allgemeines Feedback</div>
                    </SelectItem>
                    <SelectItem value="bug">
                      <div className="flex items-center gap-2"><Bug className="h-3.5 w-3.5" /> Fehler melden</div>
                    </SelectItem>
                    <SelectItem value="idea">
                      <div className="flex items-center gap-2"><Lightbulb className="h-3.5 w-3.5" /> Verbesserungsvorschlag</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Ihre Nachricht</Label>
                <Textarea
                  id="message"
                  placeholder="Was ist Ihnen aufgefallen? Was gefällt Ihnen, was nicht?"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={loading || !message.trim()} className="flex-1">
                  {loading ? 'Wird gesendet...' : 'Feedback senden'}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Zurück
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <Heart className="h-7 w-7 text-emerald-500" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Vielen Dank!</h2>
            <p className="text-slate-500 text-sm mb-6">Ihr Feedback wurde erfolgreich übermittelt. Wir schätzen jede Rückmeldung sehr.</p>
            <Link href="/dashboard">
              <Button className="w-full">Zurück zum Dashboard</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
