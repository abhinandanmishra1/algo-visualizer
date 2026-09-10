export type RendererType = 'linked-list' | 'array' | 'tree' | 'graph' | 'component-diagram';

export type AspectRatio = '16:9' | '9:16';

export interface AlgoPanelsConfig {
  why: boolean;
  formula: boolean;
  distanceMap: boolean;
  code: boolean;
  tradeoffs?: boolean;
  metrics?: boolean;
}

export interface FormulaItem {
  label: string;
  math: string;
  active: boolean;
  explanation?: string;
}

export interface DistanceItem {
  label: string;
  value: string | number;
  highlight?: boolean;
  color?: string;
}

export interface AlgoStep {
  stepIndex: number;
  title: string;
  state: Record<string, any>;
  codeLines: number[];
  why: string;
  formulaActive?: FormulaItem[];
  distanceMap?: DistanceItem[];
  caption?: string;
}

export interface AlgoConfig {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  renderer: RendererType;
  aspectRatio?: AspectRatio;
  data: Record<string, any>;
  code: {
    language: string;
    lines: string[];
  };
  panels: AlgoPanelsConfig;
  steps: AlgoStep[];
}

export function validateAlgoConfig(config: AlgoConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['Config must be an object'] };
  }
  if (!config.id) errors.push('Missing config id');
  if (!config.title) errors.push('Missing config title');
  if (!config.renderer) errors.push('Missing config renderer');
  if (!config.steps || !Array.isArray(config.steps) || config.steps.length === 0) {
    errors.push('Config must have at least one step');
  }
  if (!config.code || !Array.isArray(config.code.lines)) {
    errors.push('Config must have code lines array');
  }
  if (!config.panels) {
    errors.push('Config must have panels object');
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}
