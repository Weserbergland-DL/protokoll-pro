-- =============================================
-- Protokoll-Pro: Documents System
-- Run this in your Supabase SQL Editor
-- =============================================

-- Document templates (reusable, with {{placeholders}})
create table if not exists public.document_templates (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('wohnungsgeberbestaetigung', 'mietvertrag', 'kautionsbescheinigung', 'sonstiges')),
  content text not null default '',
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Documents (instances linked to a tenancy via protocol_id)
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.users(id) on delete cascade not null,
  protocol_id uuid references public.protocols(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  template_id uuid references public.document_templates(id) on delete set null,
  name text not null,
  type text not null check (type in ('wohnungsgeberbestaetigung', 'mietvertrag', 'kautionsbescheinigung', 'sonstiges')),
  content text not null default '',
  status text not null default 'draft' check (status in ('draft', 'final')),
  tenant_salutation text,
  tenant_first_name text,
  tenant_last_name text,
  tenant_email text,
  finalized_at timestamptz,
  pdf_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_document_templates_owner on public.document_templates(owner_id);
create index if not exists idx_documents_owner on public.documents(owner_id);
create index if not exists idx_documents_protocol on public.documents(protocol_id);
create index if not exists idx_documents_property on public.documents(property_id);

-- Updated_at triggers
drop trigger if exists update_document_templates_updated_at on public.document_templates;
create trigger update_document_templates_updated_at
  before update on public.document_templates
  for each row execute function public.update_updated_at();

drop trigger if exists update_documents_updated_at on public.documents;
create trigger update_documents_updated_at
  before update on public.documents
  for each row execute function public.update_updated_at();

-- RLS
alter table public.document_templates enable row level security;
alter table public.documents enable row level security;

drop policy if exists "Users manage own templates" on public.document_templates;
create policy "Users manage own templates"
  on public.document_templates for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "Users manage own documents" on public.documents;
create policy "Users manage own documents"
  on public.documents for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
