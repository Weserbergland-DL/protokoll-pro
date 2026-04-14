import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  let query = supabase
    .from('document_templates')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ templates: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, type, content } = await request.json()

  if (!name?.trim() || !type?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Name, Typ und Inhalt sind erforderlich' }, { status: 400 })
  }
  if (name.length > 120) {
    return NextResponse.json({ error: 'Name zu lang (max. 120 Zeichen)' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('document_templates')
    .insert({ owner_id: user.id, name: name.trim(), type, content })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ template: data })
}
