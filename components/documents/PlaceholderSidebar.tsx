'use client'

import { memo } from 'react'
import { X } from 'lucide-react'
import { PLACEHOLDER_LABELS } from '@/lib/document-templates'

interface Props {
  onClose: () => void
  onInsert: (placeholder: string) => void
}

/** Right-side panel listing all available {{placeholders}}. Clicking one
 *  inserts it into the legacy editor's content. */
export const PlaceholderSidebar = memo(function PlaceholderSidebar({ onClose, onInsert }: Props) {
  return (
    <aside className="lg:w-72 bg-card rounded-2xl border border-border shadow-xs p-5 h-fit lg:sticky lg:top-20">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass-600">Einfügen</p>
          <h3 className="font-heading text-lg text-foreground mt-0.5">Platzhalter</h3>
        </div>
        <button
          onClick={onClose}
          className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center"
          aria-label="Schließen"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Diese Felder werden beim nächsten Dokument automatisch befüllt.
      </p>
      <div className="space-y-1.5">
        {Object.entries(PLACEHOLDER_LABELS).map(([ph, label]) => (
          <button
            key={ph}
            onClick={() => onInsert(ph)}
            className="group w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:border-ink-200 hover:bg-muted/40 transition-all text-left"
          >
            <div className="min-w-0 flex-1">
              <code className="text-[11px] font-mono text-brass-700 bg-brass-50 px-1.5 py-0.5 rounded">{ph}</code>
              <p className="text-xs text-muted-foreground mt-1 truncate">{label}</p>
            </div>
            <span className="text-muted-foreground group-hover:text-foreground text-sm shrink-0">+</span>
          </button>
        ))}
      </div>
    </aside>
  )
})
