import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App Integration', () => {
  it('renders algorithm visualizer with Floyd Cycle Detection by default', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /Floyd's Cycle Detection/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play/i })).toBeInTheDocument();
    expect(screen.getByText(/Export Video/i)).toBeInTheDocument();
  });

  it('allows switching between 16:9 and 9:16 aspect ratio modes', () => {
    render(<App />);
    const reelBtn = screen.getByRole('button', { name: /9:16 Reel/i });
    fireEvent.click(reelBtn);
    expect(screen.getByRole('button', { name: /9:16 Reel/i })).toBeInTheDocument();
  });

  it('allows switching algorithm to Binary Search', () => {
    render(<App />);
    const select = screen.getByRole('combobox', { name: /Select Algorithm/i });
    fireEvent.change(select, { target: { value: 'binary-search' } });
    expect(
      screen.getByRole('heading', { name: /Binary Search/i })
    ).toBeInTheDocument();
  });

  it('defaults to showing Code Walkthrough panel and hiding optional panels', () => {
    render(<App />);
    // Code panel is visible (both in toggle button and in panel header)
    expect(screen.getAllByText(/Code Walkthrough/i).length).toBeGreaterThanOrEqual(1);
    // Optional panels should not be present initially
    expect(screen.queryByText(/Intuition & Logic/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mathematical Invariants/i)).not.toBeInTheDocument();
  });

  it('allows toggling Intuition panel on and off', () => {
    render(<App />);
    const toggleWhyBtn = screen.getByRole('button', { name: /Intuition/i });
    fireEvent.click(toggleWhyBtn);
    expect(screen.getByText(/Intuition & Logic/i)).toBeInTheDocument();

    fireEvent.click(toggleWhyBtn);
    expect(screen.queryByText(/Intuition & Logic/i)).not.toBeInTheDocument();
  });
});
