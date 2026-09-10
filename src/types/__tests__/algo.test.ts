import { describe, it, expect } from 'vitest';
import { validateAlgoConfig, AlgoConfig } from '../algo';

describe('validateAlgoConfig', () => {
  it('validates a valid algorithm config', () => {
    const validConfig: AlgoConfig = {
      id: 'test-algo',
      title: 'Test Algorithm',
      category: 'linked-list',
      renderer: 'linked-list',
      aspectRatio: '16:9',
      data: {
        nodes: [{ id: '1', label: '1' }, { id: '2', label: '2' }],
        edges: [{ from: '1', to: '2' }]
      },
      code: {
        language: 'python',
        lines: ['def algo():', '    pass']
      },
      panels: {
        why: true,
        formula: true,
        distanceMap: true,
        code: true
      },
      steps: [
        {
          stepIndex: 0,
          title: 'Start',
          state: { slow: 1, fast: 1 },
          codeLines: [1],
          why: 'Initialize pointers'
        }
      ]
    };

    const result = validateAlgoConfig(validConfig);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects invalid configs missing required fields', () => {
    const invalidConfig = {
      id: 'invalid'
    } as unknown as AlgoConfig;

    const result = validateAlgoConfig(invalidConfig);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
