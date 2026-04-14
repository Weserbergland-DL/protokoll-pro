-- Benutzerdefinierte Dokument-Vorlagen: Nutzer können eigene Mietvertrags-
-- Templates speichern und beim Erstellen neuer Dokumente wiederverwenden.

CREATE TABLE IF NOT EXISTS public.document_templates (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id   uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name       text NOT NULL,
  type       text NOT NULL,
  content    text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_document_templates_owner_type
  ON public.document_templates(owner_id, type);

DROP TRIGGER IF EXISTS update_document_templates_updated_at ON public.document_templates;
CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON public.document_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own templates" ON public.document_templates;
CREATE POLICY "Users manage own templates"
  ON public.document_templates FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());
