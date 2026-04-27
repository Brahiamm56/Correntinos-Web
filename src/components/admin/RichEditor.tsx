"use client";

import { useRef, useEffect, useCallback } from "react";
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

  const handleInsertLink = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString();
    const url = prompt("URL del enlace:");
    if (!url) return;
    if (text) {
      exec("createLink", url);
    } else {
      const anchor = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      exec("insertHTML", anchor);
    }
  }, [exec]);

  const handleToolbarAction = useCallback(
    (item: Extract<ToolbarItem, { type: "button" }>) => {
      if (item.command === "link") {
        handleInsertLink();
        return;
      }

      exec(item.command, item.value);
    },
    [exec, handleInsertLink]
  );

  return (
    <div className="rich-editor border border-gray-200 rounded-lg overflow-hidden focus-within:border-[var(--verde-hoja)] focus-within:ring-1 focus-within:ring-[var(--verde-hoja)] transition-all">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-0.5 px-2 py-2 bg-gray-50 border-b border-gray-100">
        {toolbarItems.map((item, i) =>
          item.type === "separator" ? (
            <div key={i} className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0" />
          ) : (
            <button
              key={i}
              type="button"
              title={item.title}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevents editor from losing focus
                handleToolbarAction(item);
              }}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors flex-shrink-0"
            >
              <item.icon className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="rich-editor__content focus:outline-none px-4 py-3 text-sm text-gray-800 leading-relaxed"
        style={{ minHeight, fontFamily: "var(--font-body)" }}
        data-placeholder={placeholder}
        spellCheck
      />
    </div>
  );
}
