'use client'

import { memo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, Save, Download, CheckCircle2, FileText,
  Tag, Trash2, Lock, BookmarkPlus,
} from 'lucide-react'

export const DOC_TYPE_LABELS: Record<string, string> = {
  wohnungsgeberbestaetigung: 'Wohnungsgeberbestätigung',
  mietvertrag: 'Mietvertrag',
  kautionsbescheinigung: 'Kautionsbescheinigung',
  sonstiges: 'Leeres Dokument',
}

interface Props {
  /** Display name; editable when not finalized. */
  name: string
  onNameChange: (name: string) => void
  /** Document type key — used for the type badge under the name. */
  docType: string | undefined
  /** When set, back-button routes to `/tenancy/{id}` instead of `/dashboard`. */
  tenancyId: string | undefined
  isFinalized: boolean
  isDirty: boolean
  saving: boolean
  /** Whether the placeholder side panel is currently open. */
  placeholdersOpen: boolean
  onTogglePlaceholders: () => void
  onSave: () => void
  onSaveAsTemplate: () => void
  onFinalize: () => void
  onDownloadPdf: () => void
  onRequestDelete: () => void
}

/** Sticky top-bar with title + action buttons. Stateless; receives all
 *  state and callbacks from the parent so it can be reused across views. */
export const DocumentToolbar = memo(function DocumentToolbar({
  name, onNameChange, docType, tenancyId,
  isFinalized, isDirty, saving, placeholdersOpen,
  onTogglePlaceholders, onSave, onSaveAsTemplate, onFinalize, onDownloadPdf, onRequestDelete,
}: Props) {
  const router = useRouter()
  const typeLabel = (docType && DOC_TYPE_LABELS[docType]) || docType

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(tenancyId ? `/tenancy/${tenancyId}` : '/dashboard')}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 min-w-0 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-brass-50 text-brass-700 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            {isFinalized ? (
              <p className="font-medium text-foreground text-sm truncate">{name}</p>
            ) : (
              <Input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="h-7 text-sm font-medium border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent w-full"
              />
            )}
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.12em] font-semibold">
              {typeLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isFinalized ? (
            <Badge variant="final" size="sm" className="hidden sm:inline-flex">
              <Lock className="h-3 w-3" />Abgeschlossen
            </Badge>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onTogglePlaceholders}
                className={`hidden sm:inline-flex ${placeholdersOpen ? 'bg-brass-50 text-brass-700' : ''}`}
                title="Platzhalter"
              >
                <Tag className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSaveAsTemplate}
                title="Als eigene Vorlage speichern"
                className="hidden sm:inline-flex"
              >
                <BookmarkPlus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onSave}
                disabled={saving || !isDirty}
                title="Speichern"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={onFinalize}
                disabled={saving}
                className="gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{saving ? 'Speichert…' : 'Abschließen'}</span>
              </Button>
            </>
          )}
          <Button variant="outline" size="icon" onClick={onDownloadPdf} title="PDF herunterladen">
            <Download className="h-4 w-4" />
          </Button>
          {!isFinalized && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRequestDelete}
              className="hidden sm:inline-flex text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
})
