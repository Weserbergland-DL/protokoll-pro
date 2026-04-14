'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, MessageSquare, Bug, Lightbulb, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Logo } from '@/components/brand/Logo'

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
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-lg px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Logo size={20} />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-10 motion-page-in space-y-4">
        {/* Info card */}
        <div className="relative overflow-hidden bg-card rounded-3xl border border-border shadow-ink p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brass-400 via-brass-500 to-brass-400" />
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-brass-50 flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5 text-brass-700" />
            </div>
            <div>
              <h1 className="font-heading text-lg text-foreground">Beta-Phase — kostenlose Nutzung</h1>
              <p className="text-xs text-muted-foreground">Aktuell kein Zahlungsvorgang notwendig</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ImmoAkte befindet sich aktuell in der Beta-Phase. Wir nehmen in dieser Zeit <strong className="text-foreground font-medium">kein Geld</strong> für die Nutzung — Sie können alle Funktionen vollständig und kostenlos nutzen.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            Im Gegenzug würden wir uns sehr über Ihr ehrliches Feedback freuen: Was funktioniert gut? Was fehlt? Jede Rückmeldung hilft uns weiter.
          </p>
        </div>

        {/* Feedback form / success */}
        {!sent ? (
          <div className="bg-card rounded-3xl border border-border shadow-xs p-6">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Feedback geben (optional)</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
                <Label htmlFor="message">Ihre Nachricht</Label>
                <Textarea
                  id="message"
                  placeholder="Was ist Ihnen aufgefallen? Was gefällt Ihnen, was nicht?"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={loading || !message.trim()} className="flex-1">
                  {loading ? 'Wird gesendet…' : 'Feedback senden'}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Zurück
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-card rounded-3xl border border-border shadow-xs p-8 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Heart className="h-7 w-7 text-emerald-500" />
            </div>
            <h2 className="font-heading text-xl text-foreground mb-2">Vielen Dank!</h2>
            <p className="text-sm text-muted-foreground mb-6">Ihr Feedback wurde übermittelt. Wir schätzen jede Rückmeldung sehr.</p>
            <Link href="/dashboard">
              <Button className="w-full">Zurück zum Dashboard</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
