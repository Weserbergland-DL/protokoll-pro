'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { ArrowLeft, Users, FileText, ShieldCheck, TrendingUp, Search, Trash2, Crown, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface AdminUser {
  id: string
  email: string
  name?: string
  company?: string
  role?: string
  subscription_status?: string
  created_at: string
  last_sign_in_at?: string
  protocols_total: number
  protocols_finalized: number
}

const safeFormat = (d: string | null | undefined, fmt: string) => {
  if (!d) return '—'
  try { return format(new Date(d), fmt, { locale: de }) } catch { return '—' }
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace('/dashboard')
  }, [user, isAdmin, loading])

  const fetchUsers = async () => {
    setLoadingData(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.users) setUsers(data.users)
    } catch {
      toast.error('Fehler beim Laden der Nutzerdaten')
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (user && isAdmin) fetchUsers()
  }, [user, isAdmin])

  const updateUser = async (userId: string, updates: Record<string, string>) => {
    setActionLoading(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates }),
      })
      if (!res.ok) throw new Error()
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u))
      toast.success('Gespeichert')
    } catch {
      toast.error('Fehler beim Speichern')
    } finally {
      setActionLoading(null)
    }
  }

  const deleteUser = async () => {
    if (!deleteTarget) return
    setActionLoading(deleteTarget.id)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: deleteTarget.id }),
      })
      if (!res.ok) throw new Error()
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
      toast.success('Nutzer gelöscht')
    } catch {
      toast.error('Fehler beim Löschen')
    } finally {
      setActionLoading(null)
      setDeleteTarget(null)
    }
  }

  if (loading || !user || !isAdmin) return null

  const filtered = users.filter(u =>
    (u.email?.toLowerCase().includes(search.toLowerCase())) ||
    (u.name?.toLowerCase().includes(search.toLowerCase())) ||
    (u.company?.toLowerCase().includes(search.toLowerCase()))
  )

  const totalProtocols = users.reduce((s, u) => s + u.protocols_total, 0)
  const finalizedProtocols = users.reduce((s, u) => s + u.protocols_finalized, 0)
  const proUsers = users.filter(u => u.subscription_status === 'active').length
  const today = new Date().toDateString()
  const newToday = users.filter(u => u.created_at && new Date(u.created_at).toDateString() === today).length

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h1 className="text-base font-bold">Admin-Panel</h1>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={fetchUsers} title="Aktualisieren">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-6xl px-4 space-y-6">
        {/* KPI-Kacheln */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2"><Users className="h-5 w-5 text-blue-500" /></div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-xs text-muted-foreground">Nutzer gesamt</p>
                </div>
              </div>
              {newToday > 0 && <p className="mt-2 text-xs text-green-600 font-medium">+{newToday} heute</p>}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-50 p-2"><Crown className="h-5 w-5 text-purple-500" /></div>
                <div>
                  <p className="text-2xl font-bold">{proUsers}</p>
                  <p className="text-xs text-muted-foreground">Pro-Nutzer</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2"><FileText className="h-5 w-5 text-slate-500" /></div>
                <div>
                  <p className="text-2xl font-bold">{totalProtocols}</p>
                  <p className="text-xs text-muted-foreground">Protokolle gesamt</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-50 p-2"><TrendingUp className="h-5 w-5 text-green-500" /></div>
                <div>
                  <p className="text-2xl font-bold">{finalizedProtocols}</p>
                  <p className="text-xs text-muted-foreground">Abgeschlossen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nutzertabelle */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CardTitle className="text-base">Alle Nutzer</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Name, E-Mail, Firma..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-8 text-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loadingData ? (
              <div className="flex justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50 text-xs text-muted-foreground">
                      <th className="text-left px-4 py-2 font-medium">Nutzer</th>
                      <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">Registriert</th>
                      <th className="text-left px-4 py-2 font-medium hidden md:table-cell">Letzter Login</th>
                      <th className="text-center px-4 py-2 font-medium">Protokolle</th>
                      <th className="text-left px-4 py-2 font-medium">Abo</th>
                      <th className="text-left px-4 py-2 font-medium">Rolle</th>
                      <th className="px-4 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(u => (
                      <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium">{u.name || '—'}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                          {u.company && <p className="text-xs text-muted-foreground">{u.company}</p>}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                          {safeFormat(u.created_at, 'dd.MM.yy')}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                          {safeFormat(u.last_sign_in_at, 'dd.MM.yy HH:mm')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-medium">{u.protocols_total}</span>
                          <span className="text-muted-foreground text-xs"> / {u.protocols_finalized} ✓</span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={u.subscription_status || 'free'}
                            onChange={e => updateUser(u.id, { subscription_status: e.target.value })}
                            disabled={actionLoading === u.id}
                            className="text-xs border rounded px-2 py-1 bg-white cursor-pointer"
                          >
                            <option value="free">Free</option>
                            <option value="active">Pro</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={u.role || 'user'}
                            onChange={e => updateUser(u.id, { role: e.target.value })}
                            disabled={actionLoading === u.id}
                            className="text-xs border rounded px-2 py-1 bg-white cursor-pointer"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost" size="icon"
                            className="text-destructive h-7 w-7"
                            onClick={() => setDeleteTarget(u)}
                            disabled={actionLoading === u.id}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">
                          Keine Nutzer gefunden
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nutzer löschen</DialogTitle>
            <DialogDescription>
              Möchten Sie <strong>{deleteTarget?.name || deleteTarget?.email}</strong> wirklich unwiderruflich löschen? Alle Daten dieses Nutzers werden entfernt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Abbrechen</Button>
            <Button variant="destructive" onClick={deleteUser}>Löschen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
