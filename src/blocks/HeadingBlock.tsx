import React from 'react';
import { useStore } from '../store/editorStore';

interface Props {
  id: string;
  content: string;
  level?: 1 | 2 | 3 | 4;
  isEditing?: boolean;
}

export const HeadingBlock = ({ id, content, level = 2, isEditing }: Props) => {
  const updateBlock = useStore((state) => state.updateBlock);
  const saveHistory = useStore((state) => state.saveHistory);

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const handleChange = (e: React.FormEvent<HTMLHeadingElement>) => {
    updateBlock(id, e.currentTarget.innerText);
  };

  const handleBlur = () => {
    saveHistory();
  };

  return (
    <Tag
      contentEditable={isEditing}
      suppressContentEditableWarning
      onInput={handleChange}
      onBlur={handleBlur}
      className={`font-bold tracking-tight outline-none focus:ring-0
        ${level === 1 ? 'text-4xl' : ''}
        ${level === 2 ? 'text-3xl' : ''}
        ${level === 3 ? 'text-2xl' : ''}
        ${level === 4 ? 'text-xl' : ''}
        ${!content && isEditing ? 'text-muted-foreground opacity-50 before:content-["Heading"]' : ''}
      `}
    >
      {content}
    </Tag>
  );
};
