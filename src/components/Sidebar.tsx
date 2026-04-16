import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { BlockType } from '../types';
import { 
  Type, 
  Image as ImageIcon, 
  Heading1, 
  FileText, 
  FileText, 
  GripVertical,
  ExternalLink,
  Minus
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarItemProps {
  type: BlockType;
  label: string;
  icon: React.ElementType;
}

const DraggableItem = ({ type, label, icon: Icon }: SidebarItemProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, fromPalette: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group",
        isDragging && "opacity-50 border-primary"
      )}
    >
      <div className="p-2 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
      </div>
      <span className="text-sm font-medium">{label}</span>
      <GripVertical className="w-4 h-4 ml-auto text-muted-foreground/30 group-hover:text-muted-foreground" />
    </div>
  );
};

export const Sidebar = () => {
  const items: SidebarItemProps[] = [
    { type: 'HEADING', label: 'Heading', icon: Heading1 },
    { type: 'RICH_TEXT', label: 'Rich Text', icon: Type },
    { type: 'MARKDOWN', label: 'Markdown', icon: FileText },
    { type: 'IMAGE', label: 'Image', icon: ImageIcon },
    { type: 'BUTTON', label: 'Button', icon: ExternalLink },
    { type: 'DIVIDER', label: 'Divider', icon: Minus },
  ];

  return (
    <div className="w-72 h-screen fixed left-0 top-0 border-r border-border bg-card/50 backdrop-blur-xl p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 rounded-xl bg-primary text-primary-foreground">
          <Type className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Builder</h1>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Components
          </h2>
          <div className="space-y-3">
            {items.map((item) => (
              <DraggableItem key={item.type} {...item} />
            ))}
          </div>
        </div>
        
        <div className="rounded-xl bg-muted/50 p-4 border border-dashed border-border mt-10">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Drag these blocks into the canvas to build your page. Double click blocks on canvas to select and edit.
          </p>
        </div>
      </div>
    </div>
  );
};
