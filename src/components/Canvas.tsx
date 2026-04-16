
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { useStore } from '../store/editorStore';
import { BlockWrapper } from './BlockWrapper';
import { Plus, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

export const Canvas = () => {
  const { blocks, addBlock, isPreviewMode } = useStore();
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  return (
    <div 
      ref={setNodeRef}
      className={`min-h-[calc(100vh-80px)] w-full max-w-4xl mx-auto py-20 px-4 transition-all duration-300 relative
        ${isOver ? 'bg-primary/[0.02]' : ''}
      `}
    >
      <SortableContext 
        items={blocks.map(b => b.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {blocks.length > 0 ? (
            blocks.map((block) => (
              <BlockWrapper key={block.id} block={block} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-border rounded-3xl bg-muted/20 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
                <Layout className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Build your page</h2>
              <p className="text-muted-foreground mb-8 max-w-xs">
                Drag blocks from the left sidebar or use the button below to start creating your content.
              </p>
              <button
                onClick={() => addBlock('RICH_TEXT')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                <Plus className="w-5 h-5" />
                Add First Block
              </button>
            </motion.div>
          )}
        </div>
      </SortableContext>
      
      {/* End-of-page Add Button */}
      {blocks.length > 0 && !isPreviewMode && (
        <div className="mt-12 flex justify-center opacity-0 hover:opacity-100 transition-opacity">
           <button
            onClick={() => addBlock('RICH_TEXT')}
            className="flex items-center gap-2 px-6 py-3 bg-card border border-border text-muted-foreground hover:text-foreground font-semibold rounded-xl transition-all hover:border-primary/50 hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Content
          </button>
        </div>
      )}
    </div>
  );
};
