import { cn } from 'cn';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RendererType } from '../types/algo';
import ArrayInputEditor from './inputs/ArrayInputEditor';
import TreeInputEditor from './inputs/TreeInputEditor';
import GraphInputEditor from './inputs/GraphInputEditor';

interface InputModalProps {
  isOpen: boolean;
  renderer: RendererType;
  onSubmit: (input: any) => void;
  onClose: () => void;
  initialValue?: any;
}

export function InputModal({ isOpen, renderer, onSubmit, onClose, initialValue }: InputModalProps) {
  const isLargeEditor = renderer === 'tree' || renderer === 'graph';

  const renderEditor = () => {
    switch (renderer) {
      case 'array':
        return (
          <ArrayInputEditor
            initialValue={initialValue?.array || []}
            onSubmit={(arr) => {
              onSubmit({ array: arr });
              onClose();
            }}
            label="Array values (comma-separated)"
            placeholder="5, 2, 8, 1, 9"
          />
        );
      case 'tree':
        return (
          <TreeInputEditor
            initialTree={initialValue}
            onSubmit={(tree) => {
              if (!tree) return;
              onSubmit(tree);
              onClose();
            }}
          />
        );
      case 'graph':
        return (
          <GraphInputEditor
            onSubmit={(graph) => {
              onSubmit(graph);
              onClose();
            }}
          />
        );
      case 'linked-list':
      case 'matrix':
      case 'stack-queue':
      case 'heap':
      case 'hash-table':
      case 'diagram':
      default:
        return (
          <div className="p-4">
            <p className="text-slate-400 text-sm">Input editing not available for this renderer type</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          'bg-slate-900 border border-slate-800 text-slate-100',
          isLargeEditor
            ? 'max-w-4xl sm:max-w-4xl h-[85vh] grid-rows-[auto_1fr] overflow-hidden'
            : 'max-w-md sm:max-w-md'
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-slate-100">Edit Input</DialogTitle>
          <DialogDescription className="text-slate-400">
            Modify the algorithm input and run again
          </DialogDescription>
        </DialogHeader>

        <div className={isLargeEditor ? 'h-full min-h-0' : undefined}>{renderEditor()}</div>
      </DialogContent>
    </Dialog>
  );
}
