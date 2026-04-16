import React from 'react';
import { useStore } from '../store/editorStore';
import { cn } from '../utils/cn';

interface Props {
  id: string;
  content: string;
  level?: 1 | 2 | 3 | 4;
  isEditing?: boolean;
  align?: 'left' | 'center' | 'right';
}

export const HeadingBlock = ({ id, content, level = 2, isEditing, align = 'left' }: Props) => {
  const updateBlock = useStore((state) => state.updateBlock);
  const saveHistory = useStore((state) => state.saveHistory);

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const handleChange = (e: React.FormEvent<HTMLHeadingElement>) => {
    updateBlock(id, e.currentTarget.innerText);
  };

  const handleBlur = () => {
    saveHistory();
  };

  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <Tag
      contentEditable={isEditing}
      suppressContentEditableWarning
      onInput={handleChange}
      onBlur={handleBlur}
      className={cn(
        "font-bold tracking-tight outline-none focus:ring-0 transition-all",
        level === 1 && "text-5xl mb-4",
        level === 2 && "text-4xl mb-3",
        level === 3 && "text-3xl mb-2",
        level === 4 && "text-2xl mb-2",
        alignments[align],
        !content && isEditing && "text-muted-foreground opacity-50 before:content-['Heading']"
      )}
    >
      {content}
    </Tag>
  );
};
