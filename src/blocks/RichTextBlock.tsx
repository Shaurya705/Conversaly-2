
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useStore } from '../store/editorStore';
import { cn } from '../utils/cn';

interface Props {
  id: string;
  content: string;
  isEditing?: boolean;
  align?: 'left' | 'center' | 'right';
}

export const RichTextBlock = ({ id, content, isEditing, align = 'left' }: Props) => {
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

  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={cn(
      "prose prose-slate dark:prose-invert max-w-none w-full transition-all",
      alignments[align]
    )}>
      <EditorContent editor={editor} />
    </div>
  );
};
