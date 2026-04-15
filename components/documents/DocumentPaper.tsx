'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { sectionsToHtml, type SectionsContent } from '@/lib/document-templates'

// Lazy-load editor surfaces — Tiptap (~500KB) + dnd-kit only load when this
// paper actually mounts, not on every route that happens to link here.
const DocumentEditor = dynamic(
  () => import('@/components/DocumentEditor').then(m => ({ default: m.DocumentEditor })),
  { ssr: false, loading: () => <EditorSkeleton /> },
)
const SectionsDocumentEditor = dynamic(
  () => import('@/components/documents/SectionsDocumentEditor').then(m => ({ default: m.SectionsDocumentEditor })),
  { ssr: false, loading: () => <EditorSkeleton /> },
)

function EditorSkeleton() {
  return (
    <div className="min-h-[400px] flex items-center justify-center text-sm text-muted-foreground">
      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
      Editor wird geladen…
    </div>
  )
}

interface Props {
  /** Sections-format payload (mietvertrag) — when set, the sections editor is used. */
  parsedSections: SectionsContent | null
  /** Legacy HTML content (used when parsedSections is null). */
  content: string
  isFinalized: boolean
  isDirty: boolean
  onSectionsChange: (updated: SectionsContent) => void
  onContentChange: (html: string) => void
}

/** The document "paper" surface — switches between four view states based on
 *  format (sections vs legacy) and lifecycle (editing vs finalized). */
export function DocumentPaper({
  parsedSections, content, isFinalized, isDirty,
  onSectionsChange, onContentChange,
}: Props) {
  // Only serialize sections to HTML when finalized (the editing path uses the
  // structured editor directly). Memoized so unrelated parent re-renders
  // don't regenerate the full contract HTML.
  const finalizedSectionsHtml = useMemo(
    () => (isFinalized && parsedSections) ? sectionsToHtml(parsedSections) : '',
    [isFinalized, parsedSections],
  )

  return (
    <div className="relative">
      <div
        className="relative bg-card rounded-sm shadow-[0_30px_60px_-20px_rgba(28,25,23,0.18),0_10px_20px_-12px_rgba(28,25,23,0.1)] border border-border overflow-hidden"
        style={{ minHeight: '60vh' }}
      >
        {/* Subtle paper grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, rgba(28,25,23,0.3) 0, transparent 50%), radial-gradient(circle at 75% 75%, rgba(28,25,23,0.3) 0, transparent 50%)',
            backgroundSize: '40px 40px, 60px 60px',
          }}
        />

        {parsedSections ? (
          isFinalized ? (
            <div className="px-4 sm:px-6 md:px-10 py-8 md:py-12 relative">
              <div
                className="prose prose-stone prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: finalizedSectionsHtml }}
              />
            </div>
          ) : (
            <div className="px-4 sm:px-6 py-6">
              <SectionsDocumentEditor
                parsed={parsedSections}
                isFinalized={isFinalized}
                onChange={onSectionsChange}
              />
            </div>
          )
        ) : (
          isFinalized ? (
            <div
              className="prose prose-stone prose-sm max-w-none px-10 md:px-16 py-12 md:py-14 relative"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="relative">
              <DocumentEditor
                content={content}
                onChange={onContentChange}
              />
            </div>
          )
        )}
      </div>

      {isDirty && !isFinalized && (
        <p className="text-xs text-muted-foreground mt-3 text-center flex items-center justify-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass-500 animate-pulse" />
          Ungespeicherte Änderungen
        </p>
      )}
    </div>
  )
}
