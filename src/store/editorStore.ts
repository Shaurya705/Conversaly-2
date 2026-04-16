import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Block, BlockType } from '../types';
import { nanoid } from 'nanoid';
import { toast } from 'react-hot-toast';

interface EditorStore {
  blocks: Block[];
  selectedBlockId: string | null;
  undoStack: Block[][];
  redoStack: Block[][];
  isPreviewMode: boolean;
  
  // Actions
  setBlocks: (blocks: Block[]) => void;
  setPreviewMode: (isPreview: boolean) => void;
  addBlock: (type: BlockType, index?: number) => void;
  updateBlock: (id: string, content: string, config?: any) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  setSelectedBlockId: (id: string | null) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
}

const DEFAULT_BLOCKS: Block[] = [
  { id: nanoid(), type: 'HEADING', content: 'Welcome to My Page', config: { level: 1 } },
  { id: nanoid(), type: 'RICH_TEXT', content: 'Start building your beautiful page by dragging blocks from the sidebar.' },
];

export const useStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      blocks: DEFAULT_BLOCKS,
      selectedBlockId: null,
      isPreviewMode: false,
      undoStack: [],
      redoStack: [],

      saveHistory: () => {
        const { blocks, undoStack } = get();
        set({
          undoStack: [...undoStack.slice(-49), blocks], // Max 50 undos
          redoStack: [],
        });
      },

      setBlocks: (blocks) => set({ blocks }),
      setPreviewMode: (isPreviewMode) => set({ isPreviewMode, selectedBlockId: isPreviewMode ? null : get().selectedBlockId }),

      addBlock: (type, index) => {
        get().saveHistory();
        const newBlock: Block = {
          id: nanoid(),
          type,
          content: 
            type === 'IMAGE' ? 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000' : 
            type === 'BUTTON' ? 'Click Me' : 
            '',
          config: 
            type === 'HEADING' ? { level: 2, align: 'left' } : 
            type === 'BUTTON' ? { variant: 'primary', align: 'center', href: '#' } :
            type === 'DIVIDER' ? { padding: 'medium' } :
            { align: 'left' },
        };

        const currentBlocks = [...get().blocks];
        if (typeof index === 'number') {
          currentBlocks.splice(index, 0, newBlock);
        } else {
          currentBlocks.push(newBlock);
        }

        set({ blocks: currentBlocks, selectedBlockId: newBlock.id });
        toast.success(`${type.toLowerCase().replace('_', ' ')} block added`);
      },

      updateBlock: (id, content, config) => {
        // We don't save history on every keystroke, but we'll call it manually when needed
        const newBlocks = get().blocks.map((block) =>
          block.id === id ? { ...block, content, config: { ...block.config, ...config } } : block
        );
        set({ blocks: newBlocks });
      },

      deleteBlock: (id) => {
        get().saveHistory();
        set({ 
          blocks: get().blocks.filter((b) => b.id !== id),
          selectedBlockId: get().selectedBlockId === id ? null : get().selectedBlockId,
        });
        toast.success('Block deleted');
      },

      duplicateBlock: (id) => {
        get().saveHistory();
        const { blocks } = get();
        const index = blocks.findIndex((b) => b.id === id);
        if (index === -1) return;

        const original = blocks[index];
        const copy: Block = { ...original, id: nanoid() };
        
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, copy);
        set({ blocks: newBlocks, selectedBlockId: copy.id });
      },

      reorderBlocks: (startIndex, endIndex) => {
        get().saveHistory();
        const result = Array.from(get().blocks);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        set({ blocks: result });
        // No toast for reorder to keep it clean
      },

      setSelectedBlockId: (id) => set({ selectedBlockId: id }),

      undo: () => {
        const { undoStack, redoStack, blocks } = get();
        if (undoStack.length === 0) return;

        const previousBlocks = undoStack[undoStack.length - 1];
        set({
          blocks: previousBlocks,
          undoStack: undoStack.slice(0, -1),
          redoStack: [blocks, ...redoStack],
        });
        toast.success('Undo');
      },

      redo: () => {
        const { undoStack, redoStack, blocks } = get();
        if (redoStack.length === 0) return;

        const nextBlocks = redoStack[0];
        set({
          blocks: nextBlocks,
          undoStack: [...undoStack, blocks],
          redoStack: redoStack.slice(1),
        });
        toast.success('Redo');
      },
    }),
    {
      name: 'page-builder-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ blocks: state.blocks }), // Only persist blocks
    }
  )
);
