import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useStore } from '../store/editorStore';

interface Props {
  id: string;
  content: string;
  isEditing?: boolean;
}

export const RichTextBlock = ({ id, content, isEditing }: Props) => {
  const updateBlock = useStore((state) => state.updateBlock);
  const saveHistory = useStore((state) => state.saveHistory);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Type something beautiful...',
      }),
    ],
    content,
    editable: isEditing,
    onUpdate: ({ editor }) => {
      updateBlock(id, editor.getHTML());
    },
    onBlur: () => {
      saveHistory(); // Save to undo stack when done editing
    },
  }, [id, isEditing]);

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none w-full">
      <EditorContent editor={editor} />
    </div>
  );
};
