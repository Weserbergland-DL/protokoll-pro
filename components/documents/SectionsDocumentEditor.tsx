'use client'

import { useState } from 'react'
import { ContractHeaderDisplay } from './ContractHeaderDisplay'
import { DocumentEditor } from '@/components/DocumentEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, ChevronDown, ChevronUp, Lock } from 'lucide-react'
import { type SectionsContent, type ContractSection } from '@/lib/document-templates'
import { cn } from '@/lib/utils'

interface Props {
  parsed: SectionsContent
  isFinalized: boolean
  onChange: (updated: SectionsContent) => void
}

export function SectionsDocumentEditor({ parsed, isFinalized, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(parsed.sections[0]?.id ?? null)
  const [addingSection, setAddingSection] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const updateSection = (id: string, content: string) =>
    onChange({ ...parsed, sections: parsed.sections.map(s => s.id === id ? { ...s, content } : s) })

  const deleteSection = (id: string) =>
    onChange({ ...parsed, sections: parsed.sections.filter(s => s.id !== id) })

  const addSection = () => {
    const trimmed = newTitle.trim()
    if (!trimmed) return
    const sec: ContractSection = { id: crypto.randomUUID(), title: trimmed, content: '<p></p>' }
    onChange({ ...parsed, sections: [...parsed.sections, sec] })
    setNewTitle('')
    setAddingSection(false)
    setExpandedId(sec.id)
  }

  return (
    <div className="space-y-3">
      {/* Fixed header block */}
      <div className="rounded-xl border border-border bg-stone-50 dark:bg-stone-900/40 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-stone-100/80 dark:bg-stone-800/50">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex-1">
            Kopfbereich
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Lock className="h-2.5 w-2.5" /> Automatisch
          </span>
        </div>
        <div className="px-6 py-6">
          <ContractHeaderDisplay header={parsed.header} />
        </div>
      </div>

      {/* Sections */}
      {parsed.sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          isExpanded={expandedId === section.id}
          isFinalized={isFinalized}
          onToggle={() => setExpandedId(expandedId === section.id ? null : section.id)}
          onChange={(c) => updateSection(section.id, c)}
          onDelete={() => deleteSection(section.id)}
        />
      ))}

      {/* Add section */}
      {!isFinalized && (
        <div className="pt-1">
          {addingSection ? (
            <div className="flex gap-2 p-3 border border-dashed border-border rounded-xl bg-muted/20">
              <Input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="z.B. § 12  Sondervereinbarung Stellplatz"
                className="flex-1 h-9 text-sm"
                onKeyDown={e => {
                  if (e.key === 'Enter') addSection()
                  if (e.key === 'Escape') { setAddingSection(false); setNewTitle('') }
                }}
                autoFocus
              />
              <Button onClick={addSection} size="sm" className="h-9">Hinzufügen</Button>
              <Button variant="ghost" size="sm" className="h-9" onClick={() => { setAddingSection(false); setNewTitle('') }}>
                Abbrechen
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full border-dashed text-muted-foreground hover:text-foreground"
              onClick={() => setAddingSection(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Abschnitt hinzufügen
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function SectionCard({
  section, isExpanded, isFinalized, onToggle, onChange, onDelete,
}: {
  section: ContractSection
  isExpanded: boolean
  isFinalized: boolean
  onToggle: () => void
  onChange: (content: string) => void
  onDelete: () => void
}) {
  return (
    <div className={cn(
      'rounded-xl border border-border overflow-hidden transition-shadow',
      isExpanded && 'shadow-sm'
    )}>
      {/* Card header */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors select-none"
        onClick={onToggle}
      >
        <span className="font-heading text-sm font-medium text-foreground flex-1 leading-snug">
          {section.title}
        </span>
        {!isFinalized && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground/60 hover:text-destructive"
            onClick={e => { e.stopPropagation(); onDelete() }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
        {isExpanded
          ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        }
      </div>

      {/* Card body */}
      {isExpanded && (
        <div className="border-t border-border">
          {isFinalized ? (
            <div
              className="prose prose-stone prose-sm max-w-none px-5 py-4"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          ) : (
            <DocumentEditor
              content={section.content}
              onChange={onChange}
            />
          )}
        </div>
      )}
    </div>
  )
}
