
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripHorizontal, 
  Trash2, 
  Copy, 
  Plus, 
  Check, 
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { useStore } from '../store/editorStore';
import type { Block } from '../types';
import { cn } from '../utils/cn';
import { HeadingBlock } from '../blocks/HeadingBlock';
import { RichTextBlock } from '../blocks/RichTextBlock';
import { MarkdownBlock } from '../blocks/MarkdownBlock';
import { ImageBlock } from '../blocks/ImageBlock';
import { ButtonBlock } from '../blocks/ButtonBlock';
import { DividerBlock } from '../blocks/DividerBlock';


interface BlockWrapperProps {
  block: Block;
}

export const BlockWrapper = ({ block }: BlockWrapperProps) => {
  const {
    selectedBlockId,
    setSelectedBlockId,
    deleteBlock,
    duplicateBlock,
    addBlock,
    updateBlock,
    blocks,
    isPreviewMode
  } = useStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const isSelected = selectedBlockId === block.id;
  const index = blocks.findIndex((b) => b.id === block.id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderBlock = () => {
    const props = {
      id: block.id,
      content: block.content,
      isEditing: isSelected,
      ...block.config,
    };

    switch (block.type) {
      case 'HEADING':
        return <HeadingBlock {...props} level={block.config?.level as any} />;
      case 'RICH_TEXT':
        return <RichTextBlock {...props} />;
      case 'MARKDOWN':
        return <MarkdownBlock {...props} />;
      case 'IMAGE':
        return <ImageBlock {...props} />;
      case 'BUTTON':
        return <ButtonBlock {...props} />;
      case 'DIVIDER':
        return <DividerBlock {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="group/wrapper relative -mx-8 px-8 py-2">
      {/* Inline Insert Button Above */}
      {!isPreviewMode && (
        <div className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/wrapper:opacity-100 transition-all duration-300",
          isDragging && "hidden"
        )}>
          <button
            onClick={() => addBlock('RICH_TEXT', index)}
            className="p-1.5 rounded-full bg-white dark:bg-zinc-800 border border-border shadow-sm hover:scale-110 active:scale-95 transition-all text-primary hover:bg-muted"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      <div
        ref={setNodeRef}
        style={style}
        onClick={(e) => {
          if (isPreviewMode) return;
          e.stopPropagation();
          setSelectedBlockId(block.id);
        }}
        className={cn(
          "relative group rounded-2xl transition-all duration-300 ring-offset-background",
          !isPreviewMode && isSelected && "ring-2 ring-primary bg-card shadow-xl z-20",
          !isPreviewMode && !isSelected && "hover:bg-muted/30",
          isDragging && "opacity-30 grayscale blur-[2px]"
        )}
      >
        {/* Block Controls - Only visible when selected or hovering */}
        {!isPreviewMode && (
          <div className={cn(
            "absolute right-2 top-2 flex flex-col items-end gap-1 opacity-0 transition-opacity duration-200 z-30",
            (isSelected || !isDragging) && "group-hover:opacity-100",
            isSelected && "opacity-100"
          )}>
            <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
              {/* Alignment Controls */}
              {['HEADING', 'IMAGE', 'BUTTON'].includes(block.type) && isSelected && (
                <div className="flex bg-card border border-border rounded-lg p-1 mr-1 shadow-sm">
                  {[
                    { val: 'left', icon: AlignLeft },
                    { val: 'center', icon: AlignCenter },
                    { val: 'right', icon: AlignRight }
                  ].map(({ val, icon: Icon }) => (
                    <button
                      key={val}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateBlock(block.id, block.content, { align: val });
                      }}
                      className={cn(
                        "p-1 rounded-md transition-colors",
                        block.config?.align === val ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              )}

              {/* Heading Level */}
              {block.type === 'HEADING' && isSelected && (
                <div className="flex bg-card border border-border rounded-lg p-1 mr-1 shadow-sm">
                  {[1, 2, 3, 4].map((level) => (
                    <button
                      key={level}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateBlock(block.id, block.content, { level });
                      }}
                      className={cn(
                        "w-7 h-7 flex items-center justify-center text-xs font-bold rounded-md transition-colors",
                        block.config?.level === level ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      )}
                    >
                      H{level}
                    </button>
                  ))}
                </div>
              )}

              {/* Button Variant */}
              {block.type === 'BUTTON' && isSelected && (
                <div className="flex bg-card border border-border rounded-lg p-1 mr-1 shadow-sm">
                  {['primary', 'secondary', 'outline'].map((variant) => (
                    <button
                      key={variant}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateBlock(block.id, block.content, { variant });
                      }}
                      className={cn(
                        "px-2 h-7 text-[10px] font-bold uppercase rounded-md transition-colors",
                        block.config?.variant === variant ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      )}
                    >
                      {variant.charAt(0)}
                    </button>
                  ))}
                </div>
              )}

              {/* Divider Padding */}
              {block.type === 'DIVIDER' && isSelected && (
                <div className="flex bg-card border border-border rounded-lg p-1 mr-1 shadow-sm">
                  {['none', 'small', 'medium', 'large'].map((p) => (
                    <button
                      key={p}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateBlock(block.id, block.content, { padding: p });
                      }}
                      className={cn(
                        "px-2 h-7 text-[10px] font-bold uppercase rounded-md transition-colors",
                        block.config?.padding === p ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      )}
                    >
                      {p.charAt(0)}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1 shadow-sm">
                <button
                  {...listeners}
                  {...attributes}
                  className="p-1.5 hover:bg-muted rounded-md cursor-grab active:cursor-grabbing text-muted-foreground transition-colors"
                >
                  <GripHorizontal className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-border mx-1" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateBlock(block.id);
                  }}
                  className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBlock(block.id);
                  }}
                  className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md text-muted-foreground transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {isSelected && (
                  <>
                    <div className="w-px h-4 bg-border mx-1" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBlockId(null);
                      }}
                      className="p-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Link Edit for Button */}
            {block.type === 'BUTTON' && isSelected && (
              <div className="mt-1 bg-card border border-border rounded-lg p-1 shadow-lg animate-in fade-in slide-in-from-top-1">
                <input 
                  type="text"
                  placeholder="Button Link (URL)"
                  value={block.config?.href || ''}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateBlock(block.id, block.content, { href: e.target.value });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-transparent border-none outline-none text-xs px-2 py-1 w-48 font-medium"
                />
              </div>
            )}
          </div>
        )}

        {/* Content Area */}
        <div className={cn(
          "p-6 transition-all",
          !isPreviewMode && isSelected ? "pt-12" : "py-4"
        )}>
          {renderBlock()}
        </div>
      </div>
    </div>
  );
};
