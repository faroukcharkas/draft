"use client";
import { Tables } from "@/packages/schema";
import Link from "next/link";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function SampleCard({ sample }: { sample: Tables<"writing_sample"> }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: sample.text,
        editable: false,
    });

    return (
      <Link
        href={`/sample/${sample.id}`}
        className="p-4 border gap-2 flex flex-col rounded-lg hover:bg-gray-100 shadow-sm"
      >
        <div className="w-full h-[120px] bg-white rounded-lg overflow-hidden shadow-sm relative">
          <div className="absolute inset-0 p-2 scale-[0.7] origin-top-left">
            <EditorContent editor={editor} className="prose max-w-none" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
        </div>
      </Link>
    );
  }