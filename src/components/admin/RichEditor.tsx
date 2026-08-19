"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Undo2,
  Redo2,
  RemoveFormatting,
} from "lucide-react";

type ToolbarItem =
  | {
      type: "button";
      icon: React.ElementType;
      title: string;
      command: string;
      value?: string;
    }
  | { type: "separator" };

const toolbarItems: ToolbarItem[] = [
  { type: "button", icon: Bold, title: "Negrita (Ctrl+B)", command: "bold" },
  { type: "button", icon: Italic, title: "Cursiva (Ctrl+I)", command: "italic" },
  { type: "button", icon: Underline, title: "Subrayado (Ctrl+U)", command: "underline" },
  { type: "separator" },
  { type: "button", icon: Heading2, title: "Título H2", command: "formatBlock", value: "h2" },
  { type: "button", icon: Heading3, title: "Título H3", command: "formatBlock", value: "h3" },
  { type: "separator" },
  { type: "button", icon: List, title: "Lista con viñetas", command: "insertUnorderedList" },
  { type: "button", icon: ListOrdered, title: "Lista numerada", command: "insertOrderedList" },
  { type: "button", icon: Quote, title: "Cita", command: "formatBlock", value: "blockquote" },
  { type: "separator" },
  { type: "button", icon: Link, title: "Insertar enlace", command: "link" },
  { type: "separator" },
  { type: "button", icon: Undo2, title: "Deshacer (Ctrl+Z)", command: "undo" },
  { type: "button", icon: Redo2, title: "Rehacer (Ctrl+Y)", command: "redo" },
  { type: "separator" },
  { type: "button", icon: RemoveFormatting, title: "Quitar formato", command: "removeFormat" },
];

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichEditor({
  value,
  onChange,
  placeholder = "Escribí el contenido aquí...",
  minHeight = 320,
}: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isProgrammaticUpdate = useRef(false);
  const savedSelectionRef = useRef<Range | null>(null);
  const [linkEditorOpen, setLinkEditorOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");

  // Initial value hydration
  useEffect(() => {
    if (editorRef.current && !isProgrammaticUpdate.current) {
      const current = editorRef.current.innerHTML;
      if (current !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const exec = useCallback((command: string, val?: string) => {
    editorRef.current?.focus();
    // Se aísla esta API para preservar el HTML histórico mientras se evalúa un editor mantenido.
    document.execCommand(command, false, val);
    // Dispatch input to trigger onChange
    editorRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
  }, []);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    isProgrammaticUpdate.current = true;
    const html = editorRef.current.innerHTML;
    onChange(html === "<br>" ? "" : html);
    requestAnimationFrame(() => { isProgrammaticUpdate.current = false; });
  }, [onChange]);

  const openLinkEditor = useCallback(() => {
    const selection = window.getSelection();
    savedSelectionRef.current = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    setLinkError("");
    setLinkEditorOpen(true);
  }, []);

  const handleInsertLink = useCallback(() => {
    const candidate = linkUrl.trim();
    if (!candidate) {
      setLinkError("Ingresá una URL");
      return;
    }

    let normalized: string;
    try {
      const parsed = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error("Protocolo no permitido");
      normalized = parsed.toString();
    } catch {
      setLinkError("Ingresá una dirección web válida");
      return;
    }

    const selection = window.getSelection();
    if (savedSelectionRef.current && selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelectionRef.current);
    }
    if (selection?.toString()) {
      exec("createLink", normalized);
    } else {
      const anchor = document.createElement("a");
      anchor.href = normalized;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = normalized;
      exec("insertHTML", anchor.outerHTML);
    }
    setLinkUrl("");
    setLinkEditorOpen(false);
  }, [exec, linkUrl]);

  const handleToolbarAction = useCallback(
    (item: Extract<ToolbarItem, { type: "button" }>) => {
      if (item.command === "link") {
        openLinkEditor();
        return;
      }

      exec(item.command, item.value);
    },
    [exec, openLinkEditor]
  );

  return (
    <div className="rich-editor overflow-hidden border border-gray-300 transition-all focus-within:border-[var(--verde-hoja)] focus-within:ring-1 focus-within:ring-[var(--verde-hoja)]">
      <div role="toolbar" aria-label="Formato del contenido" className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50 px-2 py-2">
        {toolbarItems.map((item, i) =>
          item.type === "separator" ? (
            <div key={i} className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0" />
          ) : (
            <button
              key={i}
              type="button"
              title={item.title}
              aria-label={item.title}
              onMouseDown={(e) => {
                e.preventDefault();
                handleToolbarAction(item);
              }}
              className="flex-shrink-0 p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
            >
              <item.icon className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>

      {linkEditorOpen && <div className="border-b border-gray-200 bg-white p-3"><label htmlFor="editor-link-url" className="mb-1.5 block text-xs font-semibold text-gray-700">Dirección del enlace</label><div className="flex flex-col gap-2 sm:flex-row"><input id="editor-link-url" type="url" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); handleInsertLink(); } }} className="min-h-10 flex-1 border border-gray-300 px-3 text-sm focus:border-[var(--verde-hoja)] focus:outline-none" placeholder="https://sitio.org" autoFocus /><button type="button" onClick={handleInsertLink} className="bg-[var(--verde-profundo)] px-4 text-sm font-semibold text-white">Insertar</button><button type="button" onClick={() => { setLinkEditorOpen(false); setLinkError(""); }} className="border-b border-gray-400 px-2 text-sm font-semibold text-gray-600">Cancelar</button></div>{linkError && <p role="alert" className="mt-2 text-xs text-red-700">{linkError}</p>}</div>}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="rich-editor__content focus:outline-none px-4 py-3 text-sm text-gray-800 leading-relaxed"
        style={{ minHeight, fontFamily: "var(--font-body)" }}
        data-placeholder={placeholder}
        spellCheck
        role="textbox"
        aria-multiline="true"
        aria-label="Contenido de la noticia"
      />
    </div>
  );
}
