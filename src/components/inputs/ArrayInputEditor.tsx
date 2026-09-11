'use client';

import { useState } from 'react';

export interface ArrayInputEditorProps {
  initialValue?: number[];
  onSubmit: (arr: number[]) => void;
  placeholder?: string;
  label?: string;
}

export default function ArrayInputEditor({
  initialValue = [],
  onSubmit,
  placeholder,
  label,
}: ArrayInputEditorProps) {
  const [input, setInput] = useState(initialValue.join(', '));

  const handleSubmit = () => {
    const arr = input
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    if (arr.length === 0) {
      alert('Invalid input');
    } else {
      onSubmit(arr);
    }
  };

  return (
    <div className="p-4">
      <label className="block text-sm font-semibold text-white mb-2">
        {label || 'Array values (comma-separated)'}
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder || '5, 2, 8, 1, 9'}
        className="w-full p-2 bg-slate-800 text-white border border-slate-600 rounded font-mono text-sm mb-3"
        rows={3}
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded"
      >
        Run Algorithm
      </button>
    </div>
  );
}
