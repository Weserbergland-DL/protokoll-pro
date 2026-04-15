'use client'

import { memo } from 'react'
import type { SectionsContent } from '@/lib/document-templates'

interface Props {
  header: SectionsContent['header']
  className?: string
}

export const ContractHeaderDisplay = memo(function ContractHeaderDisplay({ header: h, className }: Props) {
  return (
    <div className={className}>
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="font-heading text-xl font-semibold tracking-tight uppercase text-foreground">
          Mietvertrag über Wohnraum
        </h1>
      </div>

      {/* Vermieter */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">Zwischen</p>
        <div className="pl-4 border-l-2 border-border space-y-0.5">
          <p className="font-semibold text-sm text-foreground">
            {h.vermieterName}{h.vermieterFirma ? `, ${h.vermieterFirma}` : ''}
          </p>
          {h.vermieterAdresse && (
            <p className="text-sm text-muted-foreground">{h.vermieterAdresse}</p>
          )}
          {(h.vermieterTelefon || h.vermieterEmail) && (
            <p className="text-xs text-muted-foreground">
              {[
                h.vermieterTelefon ? `Tel: ${h.vermieterTelefon}` : null,
                h.vermieterEmail ? `E-Mail: ${h.vermieterEmail}` : null,
              ].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <p className="text-center text-xs italic text-muted-foreground mt-3">
          — nachstehend „Vermieter" genannt —
        </p>
      </div>

      {/* Mieter */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">und</p>
        <div className="pl-4 border-l-2 border-border space-y-0.5">
          <p className="font-semibold text-sm text-foreground">
            {h.mieterAnrede} {h.mieterName}
          </p>
          {h.mieterAdresse && (
            <p className="text-sm text-muted-foreground">{h.mieterAdresse}</p>
          )}
        </div>
        <p className="text-center text-xs italic text-muted-foreground mt-3">
          — nachstehend „Mieter" genannt —
        </p>
      </div>

      {/* Closing line */}
      <p className="text-center text-sm font-medium border-t border-border pt-4 mt-4 text-foreground">
        wird folgender Mietvertrag geschlossen:
      </p>
    </div>
  )
})
