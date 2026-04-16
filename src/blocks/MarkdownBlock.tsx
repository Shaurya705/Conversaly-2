
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore } from '../store/editorStore';

interface Props {
  id: string;
  content: string;
  isEditing?: boolean;
}

export const MarkdownBlock = ({ id, content, isEditing }: Props) => {
  const updateBlock = useStore((state) => state.updateBlock);
  const saveHistory = useStore((state) => state.saveHistory);

  if (isEditing) {
    return (
      <textarea
        value={content}
        onChange={(e) => updateBlock(id, e.target.value)}
        onBlur={saveHistory}
        placeholder="# Markdown Title\n\nStart writing markdown..."
        className="w-full min-h-[150px] p-4 font-mono text-sm bg-muted/30 rounded-lg border-none focus:ring-1 focus:ring-primary h-auto resize-none outline-none"
      />
    );
  }

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-sm">
      {content ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      ) : (
        <p className="text-muted-foreground italic">No content. Edit this block to add markdown.</p>
      )}
    </div>
  );
};
