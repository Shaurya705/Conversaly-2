import { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  type DragEndEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import { 
  sortableKeyboardCoordinates 
} from '@dnd-kit/sortable';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { useStore } from './store/editorStore';
import { 
  Undo2, 
  Redo2, 
  Save, 
  Moon, 
  Sun,
  Laptop
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils/cn';

function App() {
  const { 
    blocks, 
    addBlock, 
    reorderBlocks, 
    undo, 
    redo, 
    undoStack, 
    redoStack,
    selectedBlockId,
    setSelectedBlockId,
    deleteBlock,
    isPreviewMode,
    setPreviewMode
  } = useStore();
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) redo();
        else undo();
      }
      
      // Delete selected block
      if (selectedBlockId && (e.key === 'Delete' || e.key === 'Backspace')) {
        // Prevent if typing in input
        const activeElement = document.activeElement;
        const isTyping = activeElement?.tagName === 'INPUT' || 
                         activeElement?.tagName === 'TEXTAREA' || 
                         (activeElement as HTMLElement)?.isContentEditable;
        
        if (!isTyping) {
          deleteBlock(selectedBlockId);
          toast.success('Block deleted');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedBlockId, deleteBlock]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Handle dropping from palette
    if (active.data.current?.fromPalette) {
      const type = active.data.current.type;
      const overId = over.id;
      const overIndex = blocks.findIndex((b) => b.id === overId);
      
      addBlock(type, overIndex === -1 ? blocks.length : overIndex);
      return;
    }

    // Handle reordering within canvas
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      reorderBlocks(oldIndex, newIndex);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 transition-colors duration-500 overflow-x-hidden">
      <Toaster position="bottom-right" />
      <AnimatePresence mode="wait">
        {!isPreviewMode && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="z-50"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className={cn(
        "flex-1 relative h-screen overflow-y-auto transition-all duration-500",
        !isPreviewMode ? "pl-72" : "pl-0"
      )} onClick={() => setSelectedBlockId(null)}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 w-full px-8 h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">Page Editor</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted/30 p-1 rounded-xl border border-border mr-4">
              <button
                onClick={(e) => { e.stopPropagation(); undo(); }}
                disabled={undoStack.length === 0 || isPreviewMode}
                className="p-2 hover:bg-card rounded-lg disabled:opacity-10 disabled:hover:bg-transparent transition-all"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); redo(); }}
                disabled={redoStack.length === 0 || isPreviewMode}
                className="p-2 hover:bg-card rounded-lg disabled:opacity-10 disabled:hover:bg-transparent transition-all"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-6 bg-border mx-2" />

            <button
               onClick={(e) => { e.stopPropagation(); setIsDarkMode(!isDarkMode); }}
               className="p-2.5 rounded-xl hover:bg-muted transition-colors border border-border bg-card"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); setPreviewMode(!isPreviewMode); }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all shadow-md active:scale-95",
                isPreviewMode ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
              )}
            >
              <Save className="w-4 h-4" />
              {isPreviewMode ? 'Exit Preview' : 'Preview Page'}
            </button>
          </div>
        </header>

        {/* Editor Area */}
        <div className="relative">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <Canvas />
            
            {/* Drag Overlay for smooth preview */}
            <DragOverlay dropAnimation={null}>
              {activeId && !activeId.startsWith('palette-') ? (
                <div className="p-6 bg-card border-2 border-primary rounded-2xl shadow-2xl opacity-90 scale-105 transition-transform duration-200">
                  <div className="flex items-center gap-3">
                     <Laptop className="w-5 h-5 text-primary" />
                     <span className="font-medium">Moving block...</span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>
    </div>
  );
}

export default App;
