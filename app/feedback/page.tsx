'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bug, AlertTriangle, Lightbulb, CheckCircle2, Clock, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { toast } from 'sonner'

interface Feedback {
  id: string
  type: 'bug' | 'feature' | 'error'
  message: string
  error_details?: string
  status: 'new' | 'resolved'
  created_at: string
  url?: string
  image_url?: string
}

export default function FeedbackList() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchFeedbacks = async () => {
      let query = supabase.from('feedback').select('*').order('created_at', { ascending: false })
      if (!isAdmin) {
        query = query.eq('user_id', user.id)
      }
      const { data, error } = await query
      if (error) console.error(error)
      else setFeedbacks((data || []) as Feedback[])
      setLoading(false)
    }

    fetchFeedbacks()
  }, [user, isAdmin])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="h-5 w-5 text-orange-500" />
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'feature': return <Lightbulb className="h-5 w-5 text-blue-500" />
      default: return <Bug className="h-5 w-5 text-slate-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bug': return 'Fehler / Bug'
      case 'error': return 'Systemfehler'
      case 'feature': return 'Verbesserungsvorschlag'
      default: return type
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    if (!isAdmin) return
    const newStatus = currentStatus === 'resolved' ? 'new' : 'resolved'
    const { error } = await supabase.from('feedback').update({ status: newStatus }).eq('id', id)
    if (!error) setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: newStatus as 'new' | 'resolved' } : f))
  }

  const copyToClipboard = (item: Feedback) => {
    const textToCopy = `Typ: ${getTypeLabel(item.type)}
Datum: ${item.created_at ? format(new Date(item.created_at), 'dd.MM.yyyy HH:mm', { locale: de }) : 'Unbekannt'}
URL: ${item.url || 'Unbekannt'}

Nachricht:
${item.message}

Fehlerdetails:
${item.error_details || 'Keine Details'}`

    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success('In die Zwischenablage kopiert')
    }).catch(() => {
      toast.error('Kopieren fehlgeschlagen')
    })
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass-600">Admin</p>
            <h1 className="font-heading text-lg text-foreground leading-tight">Feedback & Fehler</h1>
          </div>
          {!loading && (
            <span className="text-xs text-muted-foreground">{feedbacks.length} Einträge</span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-4 motion-page-in">
        {loading ? (
          <div className="text-center py-16 text-muted-foreground text-sm">Lade Einträge…</div>
        ) : feedbacks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-emerald-500 opacity-60" />
            <p className="text-muted-foreground text-sm">Keine Einträge vorhanden.</p>
          </div>
        ) : (
          feedbacks.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(item.type)}
                  <span className="text-sm font-medium text-foreground">{getTypeLabel(item.type)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {item.created_at ? format(new Date(item.created_at), 'dd.MM.yyyy HH:mm', { locale: de }) : '—'}
                  <span className={`ml-1 px-2 py-0.5 rounded-full font-semibold ${
                    item.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-brass-50 text-brass-700'
                  }`}>
                    {item.status === 'resolved' ? 'Erledigt' : 'Neu'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-foreground text-sm whitespace-pre-wrap">{item.message}</p>

                {item.image_url && (
                  <div className="mt-4">
                    <a href={item.image_url} target="_blank" rel="noopener noreferrer" className="block group relative">
                      <img src={item.image_url} alt="Feedback Screenshot" className="max-h-[300px] rounded-xl border border-border object-contain bg-muted" />
                    </a>
                  </div>
                )}

                {item.error_details && (
                  <div className="mt-4 p-3 bg-ink-900 rounded-xl overflow-x-auto relative group">
                    <Button variant="secondary" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(item)} title="Kopieren">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <p className="text-xs text-background/70 font-mono whitespace-pre-wrap pr-8">{item.error_details}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between gap-3">
                  {item.url ? (
                    <p className="text-xs text-muted-foreground truncate">
                      <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{item.url}</span>
                    </p>
                  ) : <div />}
                  <div className="flex items-center gap-2 shrink-0">
                    {!item.error_details && (
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => copyToClipboard(item)}>
                        <Copy className="h-3.5 w-3.5" />
                        Kopieren
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        variant={item.status === 'resolved' ? 'outline' : 'default'}
                        size="sm"
                        className={`h-8 text-xs gap-1.5 ${item.status !== 'resolved' ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-0' : ''}`}
                        onClick={() => toggleStatus(item.id, item.status)}
                      >
                        {item.status === 'resolved' ? 'Wieder öffnen' : (
                          <><CheckCircle2 className="h-3.5 w-3.5" />Als erledigt</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
