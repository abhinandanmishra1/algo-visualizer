import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WhyPanel } from '../WhyPanel';
import { FormulaPanel } from '../FormulaPanel';
import { DistanceMapPanel } from '../DistanceMapPanel';

describe('WhyPanel', () => {
  it('renders step why explanation and step number', () => {
    render(<WhyPanel why="Fast advances two steps while slow advances one." stepIndex={2} />);
    expect(screen.getByText(/Fast advances two steps/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 3/i)).toBeInTheDocument();
  });
});

describe('FormulaPanel', () => {
  it('renders active formulas', () => {
    const formulas = [
      { label: 'Speed Ratio', math: 'v = 2x', active: true, explanation: 'Double speed' },
    ];
    render(<FormulaPanel formulas={formulas} />);
    expect(screen.getByText(/Speed Ratio/i)).toBeInTheDocument();
    expect(screen.getByText(/Double speed/i)).toBeInTheDocument();
  });
});

describe('DistanceMapPanel', () => {
  it('renders metric badges', () => {
    const items = [
      { label: 'Slow Traveled', value: 3, highlight: true },
      { label: 'Cycle Length', value: 'C=3' },
    ];
    render(<DistanceMapPanel items={items} />);
    expect(screen.getByText(/Slow Traveled/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/Cycle Length/i)).toBeInTheDocument();
  });
});
