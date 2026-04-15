'use client'

import { memo } from 'react'
import type { SectionsContent } from '@/lib/document-templates'

interface Props {
  header: SectionsContent['header']
  footer?: SectionsContent['footer']
  className?: string
}

/** Renders the signature block exactly as it appears in the final PDF.
 *  Empty "ort" / "datum" render as a blank underline so the field can be
 *  completed by hand after printing. */
export const ContractFooterDisplay = memo(function ContractFooterDisplay({ header: h, footer: f, className }: Props) {
  const ort = f?.ort?.trim() ?? ''
  const datum = (f?.datum ?? h.datum ?? '').trim()

  return (
    <div className={className}>
      {/* Ort, Datum line */}
      <p className="text-sm text-foreground mb-10">
        <span>Ort, Datum:&nbsp;&nbsp;</span>
        <FillOrLine value={ort} minWidth="10rem" />
        <span className="mx-1">,</span>
        <FillOrLine value={datum} minWidth="6rem" />
      </p>

      {/* Signature pair */}
      <div className="grid grid-cols-2 gap-x-6">
        <SignatureSlot role="Vermieter" name={h.vermieterName} />
        <SignatureSlot role="Mieter" name={`${h.mieterAnrede ? h.mieterAnrede + ' ' : ''}${h.mieterName}`.trim()} />
      </div>
    </div>
  )
})

function FillOrLine({ value, minWidth }: { value: string; minWidth: string }) {
  if (value) return <strong className="font-semibold">{value}</strong>
  return (
    <span
      aria-hidden
      className="inline-block align-baseline border-b border-foreground/70 relative -mb-[1px]"
      style={{ minWidth, height: '1em' }}
    />
  )
}

function SignatureSlot({ role, name }: { role: string; name: string }) {
  return (
    <div>
      <div className="h-12" />
      <div className="border-t border-foreground/70 pt-1.5">
        <p className="text-sm font-semibold text-foreground leading-tight">{role}</p>
        {name && <p className="text-xs text-muted-foreground leading-tight">{name}</p>}
      </div>
    </div>
  )
}
