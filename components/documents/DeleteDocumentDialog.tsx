'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Document name shown in the confirmation copy. */
  documentName: string
  onConfirm: () => void | Promise<void>
}

export function DeleteDocumentDialog({ open, onOpenChange, documentName, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dokument löschen</DialogTitle>
          <DialogDescription>
            Möchten Sie das Dokument „{documentName}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button variant="destructive" onClick={() => onConfirm()}>Löschen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
