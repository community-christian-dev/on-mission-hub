"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading2,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const RichTextEditor = ({
    value,
    onChange,
    placeholder = "Start typing...",
}: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Sync the external value with the editor ONLY if they are different
    // This prevents the cursor from jumping around during typing
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const execCommand = (command: string, value: string | undefined = undefined) => {
        // Apply the command
        document.execCommand(command, false, value);

        // Force focus back to editor so typing continues smoothly
        if (editorRef.current) {
            editorRef.current.focus();
        }

        // Trigger the update manually so React knows the content changed
        handleInput();
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    // PREVENT DEFAULT is crucial here. 
    // It stops the button from "stealing" focus from the text selection.
    const onToolbarButtonClick = (e: React.MouseEvent, command: string, value?: string) => {
        e.preventDefault();
        execCommand(command, value);
    };

    const toolbarButtons = [
        { icon: Bold, command: "bold", label: "Bold", key: "bold" },
        { icon: Italic, command: "italic", label: "Italic", key: "italic" },
        { icon: Heading2, command: "formatBlock", value: "h2", label: "Heading", key: "heading" },
        { icon: List, command: "insertUnorderedList", label: "Bullet List", key: "ul" },
        { icon: ListOrdered, command: "insertOrderedList", label: "Numbered List", key: "ol" },
        { icon: Quote, command: "formatBlock", value: "blockquote", label: "Quote", key: "quote" },
    ];

    return (
        <div
            className={`border rounded-xl overflow-hidden bg-zinc-900 transition-colors ${isFocused ? "border-sky-500" : "border-zinc-700"
                }`}
        >
            {/* Toolbar */}
            <div className="bg-zinc-800 border-b border-zinc-700 p-2 flex gap-1">
                {toolbarButtons.map(({ icon: Icon, command, value, label, key }) => (
                    <button
                        key={key}
                        // We use onMouseDown instead of onClick to prevent focus loss
                        onMouseDown={(e) => onToolbarButtonClick(e, command, value)}
                        className="p-2 hover:bg-zinc-700 rounded transition-colors text-zinc-400 hover:text-white"
                        title={label}
                        type="button"
                    >
                        <Icon size={18} />
                    </button>
                ))}
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="editor-content p-4 min-h-[300px] max-h-[500px] overflow-y-auto text-zinc-200 focus:outline-none"
                data-placeholder={placeholder}
            />

            {/* UNIVERSAL STYLES
         These override Tailwind's resets to ensure Headings/Lists/Quotes are visible.
      */}
            <style>{`
        /* Placeholder */
        .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #52525b;
          pointer-events: none;
          display: block;
        }

        /* ----------------------------------------------------
           FORCE STYLES (Overrides Tailwind Reset)
           ---------------------------------------------------- */
        
        /* 1. HEADINGS (H2) */
        .editor-content h2 {
          display: block;
          font-size: 1.5em !important;
          font-weight: 700 !important;
          margin-top: 0.75em !important;
          margin-bottom: 0.5em !important;
          color: #f4f4f5 !important; /* zinc-100 */
        }

        /* 2. BLOCKQUOTES (Your custom request) */
        .editor-content blockquote {
          display: block;
          margin-top: 1em !important;
          margin-bottom: 1em !important;
          margin-left: 0 !important; /* Reset browser default */
          margin-right: 0 !important;
          
          /* Custom Styling */
          padding-left: 1.5rem !important;
          border-left: 4px solid #6a4cb3ff !important; /* Violet Accent */
          color: #a1a1aa !important;                 /* Light Gray Text */
          font-style: italic !important;
          background: rgba(255,255,255,0.05);        /* Subtle bg */
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-radius: 0 4px 4px 0;
        }

        /* 3. BULLET LISTS (UL) */
        .editor-content ul {
          display: block;
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-top: 0.5em !important;
          margin-bottom: 0.5em !important;
        }

        /* 4. NUMBERED LISTS (OL) */
        .editor-content ol {
          display: block;
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-top: 0.5em !important;
          margin-bottom: 0.5em !important;
        }

        /* List Items */
        .editor-content li {
          display: list-item !important;
        }

        /* Inline Formatting */
        .editor-content b, .editor-content strong {
            font-weight: bold !important;
            color: #fff !important;
        }
        .editor-content i, .editor-content em {
            font-style: italic !important;
        }
      `}</style>
        </div>
    );
};

export default RichTextEditor;