import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { DEFAULT_TEMPLATES, DEFAULT_MIETVERTRAG_SECTIONS, fillPlaceholders, type SectionsContent } from '@/lib/document-templates'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const tenancyId = searchParams.get('tenancy_id')
  const protocolId = searchParams.get('protocol_id')
  const propertyId = searchParams.get('property_id')

  let query = supabaseAdmin
    .from('documents')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (tenancyId) query = query.eq('tenancy_id', tenancyId)
  else if (protocolId) query = query.eq('protocol_id', protocolId)
  else if (propertyId) query = query.eq('property_id', propertyId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ documents: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { type, tenancy_id, protocol_id, property_id, name, rental_terms, template_id } = body

  // Get user profile for placeholders
  const { data: profile } = await supabaseAdmin
    .from('users').select('name, company, street, house_number, zip_code, city, phone, email_contact, iban, bank_name').eq('id', user.id).single()

  // Get tenancy/protocol data for placeholder filling
  let tenancyData: any = null
  let propertyData: any = null

  // If rental_terms provided with a tenancy_id, persist them first so future docs can reuse
  if (tenancy_id && rental_terms && typeof rental_terms === 'object') {
    const allowed = [
      'rent_cold', 'utilities', 'deposit', 'sqm', 'rooms', 'floor',
      'contract_duration', 'contract_end_date', 'notice_period_months',
      'rent_due_day', 'start_date',
    ] as const
    const update: Record<string, any> = {}
    for (const key of allowed) {
      if (rental_terms[key] !== undefined && rental_terms[key] !== null && rental_terms[key] !== '') {
        update[key] = rental_terms[key]
      }
    }
    if (Object.keys(update).length > 0) {
      await supabaseAdmin.from('tenancies').update(update).eq('id', tenancy_id).eq('owner_id', user.id)
    }
  }

  if (tenancy_id) {
    const { data: ten } = await supabaseAdmin
      .from('tenancies').select('*, properties(*)').eq('id', tenancy_id).single()
    tenancyData = ten
    propertyData = ten?.properties
  } else if (protocol_id) {
    const { data: proto } = await supabaseAdmin
      .from('protocols').select('*').eq('id', protocol_id).single()
    tenancyData = proto // treat protocol as tenancy-like for backward compat
    if (proto?.property_id) {
      const { data: prop } = await supabaseAdmin
        .from('properties').select('*').eq('id', proto.property_id).single()
      propertyData = prop
    }
  } else if (property_id) {
    const { data: prop } = await supabaseAdmin
      .from('properties').select('*').eq('id', property_id).single()
    propertyData = prop
  }

  // Build placeholder values
  const address = propertyData
    ? (propertyData.address || `${propertyData.street || ''} ${propertyData.house_number || ''}, ${propertyData.zip_code || ''} ${propertyData.city || ''}`.trim())
    : ''

  const landlordStreet = profile ? `${profile.street || ''} ${profile.house_number || ''}`.trim() : ''
  const landlordPlzOrt = profile ? `${profile.zip_code || ''} ${profile.city || ''}`.trim() : ''
  const landlordAddress = landlordStreet && landlordPlzOrt ? `${landlordStreet}, ${landlordPlzOrt}` : (landlordStreet || landlordPlzOrt)

  const fmtMoney = (v: any) =>
    v === null || v === undefined || v === '' ? ''
      : new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v))

  const rentCold  = tenancyData?.rent_cold !== null && tenancyData?.rent_cold !== undefined ? Number(tenancyData.rent_cold) : null
  const utilities = tenancyData?.utilities !== null && tenancyData?.utilities !== undefined ? Number(tenancyData.utilities) : null
  const totalRent = rentCold !== null || utilities !== null ? (rentCold ?? 0) + (utilities ?? 0) : null

  const noticeMonths = tenancyData?.notice_period_months ?? 3
  const kuendigungsfrist = `${noticeMonths} Monate zum Monatsende`

  const duration = tenancyData?.contract_duration || 'unbefristet'
  const vertragsart = duration === 'befristet' ? 'Befristetes Mietverhältnis' : 'Unbefristetes Mietverhältnis'
  const vertragsdauerBlock = duration === 'befristet' && tenancyData?.contract_end_date
    ? ` und endet am <strong>${format(new Date(tenancyData.contract_end_date), 'dd.MM.yyyy', { locale: de })}</strong> (befristetes Mietverhältnis gemäß § 575 BGB).`
    : ' und wird auf unbestimmte Zeit geschlossen.'

  const lageBlock = tenancyData?.floor ? `, gelegen im ${tenancyData.floor}` : ''
  const vermieterFirmaBlock = profile?.company ? `, ${profile.company}` : ''

  const placeholders: Record<string, string> = {
    '{{vermieter_name}}':    profile?.name || '',
    '{{vermieter_firma}}':   profile?.company || '',
    '{{vermieter_firma_block}}': vermieterFirmaBlock,
    '{{vermieter_adresse}}': landlordAddress,
    '{{vermieter_strasse}}': landlordStreet,
    '{{vermieter_plz_ort}}': landlordPlzOrt,
    '{{vermieter_telefon}}': profile?.phone || '',
    '{{vermieter_email}}':   profile?.email_contact || '',
    '{{vermieter_iban}}':    profile?.iban || '',
    '{{vermieter_bank}}':    profile?.bank_name || '',
    '{{mieter_anrede}}':   tenancyData?.tenant_salutation || '',
    '{{mieter_vorname}}':  tenancyData?.tenant_first_name || '',
    '{{mieter_nachname}}': tenancyData?.tenant_last_name || '',
    '{{mieter_name}}':     `${tenancyData?.tenant_first_name || ''} ${tenancyData?.tenant_last_name || ''}`.trim(),
    '{{mieter_strasse}}':  tenancyData?.tenant_street ? `${tenancyData.tenant_street} ${tenancyData.tenant_house_number || ''}`.trim() : '',
    '{{mieter_plz_ort}}':  tenancyData?.tenant_zip_code ? `${tenancyData.tenant_zip_code} ${tenancyData.tenant_city || ''}`.trim() : '',
    '{{mieter_adresse}}':  tenancyData?.tenant_street
      ? `${tenancyData.tenant_street} ${tenancyData.tenant_house_number || ''}, ${tenancyData.tenant_zip_code || ''} ${tenancyData.tenant_city || ''}`.trim()
      : '',
    '{{adresse}}': address,
    '{{strasse}}': propertyData ? `${propertyData.street || ''} ${propertyData.house_number || ''}`.trim() : '',
    '{{plz_ort}}': propertyData ? `${propertyData.zip_code || ''} ${propertyData.city || ''}`.trim() : '',
    '{{einzugsdatum}}': tenancyData?.start_date ? format(new Date(tenancyData.start_date), 'dd.MM.yyyy', { locale: de }) : (tenancyData?.date ? format(new Date(tenancyData.date), 'dd.MM.yyyy', { locale: de }) : ''),
    '{{datum_heute}}': format(new Date(), 'dd.MM.yyyy', { locale: de }),
    '{{mietbeginn}}': tenancyData?.start_date ? format(new Date(tenancyData.start_date), 'dd.MM.yyyy', { locale: de }) : '',
    '{{kaltmiete}}': fmtMoney(rentCold),
    '{{nebenkosten}}': fmtMoney(utilities),
    '{{gesamtmiete}}': fmtMoney(totalRent),
    '{{kaution}}': fmtMoney(tenancyData?.deposit),
    '{{wohnflaeche}}': tenancyData?.sqm ? String(tenancyData.sqm).replace('.', ',') : '____',
    '{{zimmer}}': tenancyData?.rooms ? String(tenancyData.rooms).replace('.', ',') : '___',
    '{{stockwerk}}': tenancyData?.floor || '',
    '{{vertragsart}}': vertragsart,
    '{{vertragsende}}': tenancyData?.contract_end_date ? format(new Date(tenancyData.contract_end_date), 'dd.MM.yyyy', { locale: de }) : '',
    '{{kuendigungsfrist}}': kuendigungsfrist,
    '{{faelligkeitstag}}': String(tenancyData?.rent_due_day ?? 3),
    '{{vertragsdauer_block}}': vertragsdauerBlock,
    '{{lage_block}}': lageBlock,
  }

  // Validate type
  const validTypes = Object.keys(DEFAULT_TEMPLATES)
  if (!type || !validTypes.includes(type)) {
    return NextResponse.json({ error: 'Ungültiger Dokumenttyp' }, { status: 400 })
  }

  // Get template content — prefer custom template if template_id is provided
  let rawContent: string
  let effectiveName: string
  const templateKey = type as keyof typeof DEFAULT_TEMPLATES
  const defaultTemplateDef = DEFAULT_TEMPLATES[templateKey]

  if (template_id) {
    const { data: customTpl } = await supabaseAdmin
      .from('document_templates')
      .select('name, content, type')
      .eq('id', template_id)
      .eq('owner_id', user.id)
      .single()
    if (!customTpl) return NextResponse.json({ error: 'Vorlage nicht gefunden' }, { status: 404 })
    if (customTpl.type !== type) return NextResponse.json({ error: 'Vorlage passt nicht zum Dokumenttyp' }, { status: 400 })
    rawContent = customTpl.content
    effectiveName = customTpl.name
  } else {
    rawContent = defaultTemplateDef?.content || ''
    effectiveName = defaultTemplateDef?.name || 'Neues Dokument'
  }

  let filledContent: string

  if (type === 'mietvertrag' && !template_id) {
    // Build sections-v1 JSON for new mietvertrag documents
    const sections = DEFAULT_MIETVERTRAG_SECTIONS.map(s => ({
      id: crypto.randomUUID(),
      title: s.title,
      content: fillPlaceholders(s.content, placeholders),
    }))

    const sectionsJson: SectionsContent = {
      format: 'sections-v1',
      header: {
        vermieterName: placeholders['{{vermieter_name}}'] || '',
        vermieterFirma: placeholders['{{vermieter_firma}}'] || '',
        vermieterAdresse: placeholders['{{vermieter_adresse}}'] || '',
        vermieterTelefon: placeholders['{{vermieter_telefon}}'] || '',
        vermieterEmail: placeholders['{{vermieter_email}}'] || '',
        mieterAnrede: placeholders['{{mieter_anrede}}'] || '',
        mieterName: `${placeholders['{{mieter_vorname}}'] || ''} ${placeholders['{{mieter_nachname}}'] || ''}`.trim(),
        mieterAdresse: placeholders['{{mieter_adresse}}'] || '',
        datum: placeholders['{{datum_heute}}'] || '',
      },
      sections,
    }
    filledContent = JSON.stringify(sectionsJson)
  } else {
    filledContent = fillPlaceholders(rawContent, placeholders)
  }

  const docName = name || effectiveName

  const { data, error } = await supabaseAdmin.from('documents').insert({
    owner_id: user.id,
    tenancy_id: tenancy_id || null,
    protocol_id: protocol_id || null,
    property_id: property_id || propertyData?.id || null,
    name: docName,
    type,
    content: filledContent,
    status: 'draft',
    tenant_salutation: tenancyData?.tenant_salutation || null,
    tenant_first_name: tenancyData?.tenant_first_name || null,
    tenant_last_name: tenancyData?.tenant_last_name || null,
    tenant_email: tenancyData?.tenant_email || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ document: data })
}
