'use client'

import { memo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { SignatureBlock } from './editor/SignatureBlockNode'
import {
  Bold, Italic, UnderlineIcon, AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, List, ListOrdered, Undo, Redo, Euro
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DocumentEditorProps {
  content: string
  onChange: (html: string) => void
  readOnly?: boolean
  placeholder?: string
}

/** HTML block inserted by the "Miete-Tabelle einfügen" toolbar button.
 *  Uses the same placeholders the server fills at document creation time. */
const MIETE_SNIPPET_HTML = `<table><tbody>
<tr><td>Grundmiete (kalt)</td><td><p><strong>{{kaltmiete}} €</strong></p></td></tr>
<tr><td>Vorauszahlung für Betriebs- und Heizkosten</td><td><p><strong>{{nebenkosten}} €</strong></p></td></tr>
<tr><td><p><strong>Gesamtmiete monatlich</strong></p></td><td><p><strong>{{gesamtmiete}} €</strong></p></td></tr>
</tbody></table><p></p>`

function ToolbarButton({ onClick, active, title, children }: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      className={cn(
        'p-1.5 rounded text-sm transition-colors',
        active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-foreground/80'
      )}
    >
      {children}
    </button>
  )
}

export const DocumentEditor = memo(function DocumentEditor({ content, onChange, readOnly = false, placeholder }: DocumentEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder || 'Dokument bearbeiten...' }),
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: false, HTMLAttributes: { class: 'contract-snippet-table' } }),
      TableRow,
      TableHeader,
      TableCell,
      SignatureBlock,
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  })

  if (!editor) return null

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-2 py-1.5">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Rückgängig">
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Wiederholen">
            <Redo className="h-4 w-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Überschrift 1">
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Überschrift 2">
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Fett">
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Kursiv">
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Unterstrichen">
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Aufzählungsliste">
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Nummerierte Liste">
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Linksbündig">
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Zentriert">
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Rechtsbündig">
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().insertContent(MIETE_SNIPPET_HTML).run()}
            title="Miete-Tabelle einfügen (Kalt / Nebenkosten / Gesamt)"
          >
            <Euro className="h-4 w-4" />
          </ToolbarButton>
        </div>
      )}
      <EditorContent editor={editor} className="document-editor-content bg-card text-foreground" />
    </div>
  )
})
