import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  const isAdmin = profile?.role === 'admin' || user.email === 'info@weserbergland-dienstleistungen.de'
  return isAdmin ? user : null
}

// GET: alle User laden
export async function GET() {
  const supabase = await createClient()
  const admin = await checkAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  // Auth-User-Daten (last_sign_in_at)
  const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
  const authMap: Record<string, any> = {}
  authData?.users?.forEach(u => { authMap[u.id] = u })

  // Public users + Protokoll-Counts
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: protocolCounts } = await supabaseAdmin
    .from('protocols')
    .select('owner_id, finalized_at')

  const countMap: Record<string, { total: number; finalized: number }> = {}
  protocolCounts?.forEach(p => {
    if (!countMap[p.owner_id]) countMap[p.owner_id] = { total: 0, finalized: 0 }
    countMap[p.owner_id].total++
    if (p.finalized_at) countMap[p.owner_id].finalized++
  })

  const enriched = (users || []).map(u => ({
    ...u,
    last_sign_in_at: authMap[u.id]?.last_sign_in_at || null,
    protocols_total: countMap[u.id]?.total || 0,
    protocols_finalized: countMap[u.id]?.finalized || 0,
  }))

  return NextResponse.json({ users: enriched })
}

// PATCH: User aktualisieren (role, subscription_status)
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const admin = await checkAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { userId, updates } = await request.json()
  if (!userId || !updates) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // Nur erlaubte Felder
  const allowed = ['role', 'subscription_status']
  const safe = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)))

  const { error } = await supabaseAdmin
    .from('users')
    .update(safe)
    .eq('id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE: User löschen
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const admin = await checkAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { userId } = await request.json()
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  // Verhindere Selbstlöschung
  if (userId === admin.id) return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
