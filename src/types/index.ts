export const BLOCK_TYPES = {
  HEADING: 'HEADING',
  RICH_TEXT: 'RICH_TEXT',
  MARKDOWN: 'MARKDOWN',
  IMAGE: 'IMAGE'
} as const;

export type BlockType = typeof BLOCK_TYPES[keyof typeof BLOCK_TYPES];

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  config?: {
    level?: 1 | 2 | 3 | 4; // For Heading
    alt?: string; // For Image
  };
}

export interface PageState {
  blocks: Block[];
  selectedBlockId: string | null;
  undoStack: Block[][];
  redoStack: Block[][];
}
