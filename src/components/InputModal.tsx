import React from 'react';
import { X } from 'lucide-react';
import { RendererType } from '../types/algo';
import ArrayInputEditor from './inputs/ArrayInputEditor';

interface InputModalProps {
  isOpen: boolean;
  renderer: RendererType;
  onSubmit: (input: any) => void;
  onClose: () => void;
  initialValue?: any;
}

export const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  renderer,
  onSubmit,
  onClose,
  initialValue,
}) => {
  if (!isOpen) return null;

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
          <div className="p-4">
            <p className="text-slate-400 text-sm">Tree input editor coming soon</p>
          </div>
        );
      case 'graph':
        return (
          <div className="p-4">
            <p className="text-slate-400 text-sm">Graph input editor coming soon</p>
          </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="font-bold text-slate-100 text-lg">Edit Input</h3>
          <p className="text-xs text-slate-400 mt-1">
            Modify the algorithm input and run again
          </p>
        </div>

        {renderEditor()}
      </div>
    </div>
  );
};
