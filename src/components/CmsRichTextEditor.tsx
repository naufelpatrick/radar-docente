import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { EditorDoc } from '../types/cms'

type Props = { value: EditorDoc; onChange: (value: EditorDoc) => void }

export function CmsRichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Highlight,
      Table.configure({ resizable: false }), TableRow, TableHeader, TableCell,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: { attributes: { class: 'cms-editor__content', 'aria-label': 'Texto do artigo' } },
    onUpdate: ({ editor: current }) => onChange(current.getJSON() as EditorDoc),
  })

  if (!editor) return <div className="cms-editor__loading">Preparando editor…</div>
  const currentEditor = editor
  function link() {
    const previous = currentEditor.getAttributes('link').href || ''
    const href = window.prompt('Endereço do link', previous)
    if (href === null) return
    if (!href) currentEditor.chain().focus().extendMarkRange('link').unsetLink().run()
    else currentEditor.chain().focus().extendMarkRange('link').setLink({ href }).run()
  }

  return <div className="cms-editor">
    <div className="cms-editor__toolbar" role="toolbar" aria-label="Formatação do texto">
      <button type="button" className={editor.isActive('bold') ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleBold().run()}><strong>N</strong><span className="sr-only">Negrito</span></button>
      <button type="button" className={editor.isActive('italic') ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em><span className="sr-only">Itálico</span></button>
      <button type="button" className={editor.isActive('highlight') ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleHighlight().run()}>Destaque</button>
      <button type="button" className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button type="button" className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <button type="button" className={editor.isActive('bulletList') ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleBulletList().run()}>Lista</button>
      <button type="button" className={editor.isActive('orderedList') ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numerada</button>
      <button type="button" className={editor.isActive('blockquote') ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Citação</button>
      <button type="button" className={editor.isActive('link') ? 'is-active' : ''} onClick={link}>Link</button>
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>Separador</button>
      <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Tabela</button>
      {editor.isActive('table') && <><button type="button" onClick={() => editor.chain().focus().addRowAfter().run()}>+ linha</button><button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ coluna</button><button type="button" onClick={() => editor.chain().focus().deleteTable().run()}>Excluir tabela</button></>}
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>Desfazer</button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>Refazer</button>
    </div>
    <EditorContent editor={editor} />
  </div>
}
