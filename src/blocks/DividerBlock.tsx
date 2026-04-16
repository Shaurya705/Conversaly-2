
import { cn } from '../utils/cn';

interface Props {
  id: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const DividerBlock = ({ padding = 'medium' }: Props) => {
  const paddings = {
    none: "py-0",
    small: "py-4",
    medium: "py-8",
    large: "py-16",
  };

  return (
    <div className={cn("w-full transition-all", paddings[padding])}>
      <div className="w-full h-px bg-border group-hover:bg-primary/30 transition-colors" />
    </div>
  );
};
