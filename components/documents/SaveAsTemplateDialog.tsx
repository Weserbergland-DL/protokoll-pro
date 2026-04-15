'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookmarkPlus } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pre-filled name suggestion shown when the dialog opens. */
  defaultName: string
  /** Called with the trimmed name. Should throw on failure; dialog stays open. */
  onSave: (name: string) => Promise<void>
}

/** Save-as-template modal. Owns its own name + in-flight state; the parent
 *  only controls open/close and supplies the persistence callback. */
export function SaveAsTemplateDialog({ open, onOpenChange, defaultName, onSave }: Props) {
  const [name, setName] = useState(defaultName)
  const [saving, setSaving] = useState(false)

  // Reset name whenever the dialog is reopened — parent may change defaultName
  // between opens (different document types suggest different starter names).
  useEffect(() => {
    if (open) setName(defaultName)
  }, [open, defaultName])

  const handleSave = async () => {
    const trimmed = name.trim()
    if (!trimmed) { toast.error('Bitte Namen angeben'); return }
    setSaving(true)
    try {
      await onSave(trimmed)
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookmarkPlus className="h-4 w-4 text-brass-600" />
            Als eigene Vorlage speichern
          </DialogTitle>
          <DialogDescription>
            Der aktuelle Inhalt wird als wiederverwendbare Vorlage gespeichert. Platzhalter wie{' '}
            <code className="text-[11px] bg-muted px-1 rounded">{'{{mieter_name}}'}</code>{' '}
            bleiben erhalten und werden beim nächsten Einsatz automatisch ausgefüllt.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="tpl-name" className="text-xs">Name der Vorlage</Label>
          <Input
            id="tpl-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="z.B. Standard-WG-Mietvertrag"
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter' && !saving) handleSave() }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Abbrechen</Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()} className="gap-1.5">
            <BookmarkPlus className="h-4 w-4" />
            {saving ? 'Speichert…' : 'Speichern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
