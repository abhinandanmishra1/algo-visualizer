import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App';

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<p>Nested route content</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('App shell', () => {
  it('renders the application brand and description', () => {
    renderApp();

    expect(screen.getByRole('heading', { name: 'AlgoVisualizer' })).toBeInTheDocument();
    expect(screen.getByText('Config-driven canvas visualizer platform')).toBeInTheDocument();
  });

  it('renders nested page content through the router outlet', () => {
    renderApp();

    expect(screen.getByText('Nested route content')).toBeInTheDocument();
  });

  it('keeps the application header visible with nested route content', () => {
    renderApp();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toContainElement(screen.getByText('Nested route content'));
  });
});
