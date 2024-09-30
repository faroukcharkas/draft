"use client";

import Link from "next/link";
import { Tables } from "@/packages/schema";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { formatDistanceToNow } from 'date-fns';

export default function DocumentCard({ document }: { document: Tables<"document"> }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: document.body as any,
        editable: false,
    });

    return (
      <Link
        href={`/document/${document.id}`}
        target="_blank"
        className="p-4 border gap-2 flex flex-col rounded-lg hover:bg-gray-100 shadow-sm bg-card"
      >
        <div className="w-full h-[120px] bg-white rounded-lg overflow-hidden shadow-sm relative">
          <div className="absolute inset-0 p-2 scale-[0.7] origin-top-left">
            <EditorContent editor={editor} className="prose max-w-none" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mt-2">{document.title}</h2>
          <p className="text-sm text-gray-500">
            {document.updated_at ? 'Updated' : 'Created'} {formatDistanceToNow(new Date(document.updated_at || document.created_at))} ago
          </p>
        </div>
      </Link>
    );
  }