import { useStore } from '../store/editorStore';
import { cn } from '../utils/cn';

interface Props {
  id: string;
  content: string;
  isEditing?: boolean;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  align?: 'left' | 'center' | 'right';
}

export const ButtonBlock = ({ 
  id, 
  content, 
  isEditing, 
  href = '#', 
  variant = 'primary',
  align = 'center'
}: Props) => {
  const updateBlock = useStore((state) => state.updateBlock);
  const saveHistory = useStore((state) => state.saveHistory);

  const handleEdit = (e: React.FormEvent<HTMLSpanElement>) => {
    updateBlock(id, e.currentTarget.innerText);
  };

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const alignments = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  const buttonContent = (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all shadow-md active:scale-95",
        variants[variant]
      )}
    >
      <span
        contentEditable={isEditing}
        suppressContentEditableWarning
        onInput={handleEdit}
        onBlur={() => saveHistory()}
        className="outline-none focus:ring-0 min-w-[20px]"
      >
        {content}
      </span>
    </div>
  );

  return (
    <div className={cn("flex w-full py-4", alignments[align])}>
      {isEditing ? (
        buttonContent
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {buttonContent}
        </a>
      )}
    </div>
  );
};
