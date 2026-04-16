
import { useStore } from '../store/editorStore';
import { cn } from '../utils/cn';

interface Props {
  id: string;
  content: string;
  isEditing?: boolean;
  align?: 'left' | 'center' | 'right';
}

export const ImageBlock = ({ id, content, isEditing, align = 'center' }: Props) => {
  const updateBlock = useStore((state) => state.updateBlock);
  const saveHistory = useStore((state) => state.saveHistory);

  if (isEditing) {
    return (
      <div className="space-y-4 p-6 bg-muted/20 rounded-2xl border border-dashed border-border transition-all">
        <div className="group relative rounded-xl overflow-hidden aspect-video bg-muted flex items-center justify-center">
          {content ? (
            <img 
              src={content} 
              alt="Preview" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="text-muted-foreground text-sm">Image Preview</span>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image URL</label>
          <input
            type="text"
            value={content}
            onBlur={saveHistory}
            onChange={(e) => updateBlock(id, e.target.value)}
            placeholder="Paste Unsplash image URL..."
            className="w-full h-11 px-4 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-mono"
          />
        </div>
      </div>
    );
  }

  const alignments = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div className={cn("flex w-full py-4", alignments[align])}>
      <div className={cn(
        "relative group overflow-hidden rounded-2xl bg-muted/10 transition-all duration-300",
        align === 'center' ? "max-w-full" : "max-w-[80%]"
      )}>
        <img
          src={content || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000'}
          className="w-full h-auto max-h-[600px] object-cover rounded-xl transition-all duration-700"
          alt="Content"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};
