export interface LcsStep {
  i: number;
  j: number;
  value: number;
  table: number[][];
  explanation: string;
}

export interface LcsResult {
  steps: LcsStep[];
  lcs: string;
  table: number[][];
}

export function buildLcsSteps(first: string, second: string): LcsResult {
  const rows = first.length + 1;
  const columns = second.length + 1;
  const table = Array.from({ length: rows }, () => Array(columns).fill(0));
  const steps: LcsStep[] = [{
    i: 0,
    j: 0,
    value: 0,
    table: table.map(row => [...row]),
    explanation: 'Start with an empty prefix. An empty string has an LCS of length 0 with every string.',
  }];

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < columns; j++) {
      if (first[i - 1] === second[j - 1]) {
        table[i][j] = table[i - 1][j - 1] + 1;
        steps.push({
          i, j, value: table[i][j],
          table: table.map(row => [...row]),
          explanation: `Characters match ('${first[i - 1]}'). Extend the diagonal result by 1.`,
        });
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
        steps.push({
          i, j, value: table[i][j],
          table: table.map(row => [...row]),
          explanation: `Characters differ ('${first[i - 1]}' vs '${second[j - 1]}'). Take the larger of the top and left cells.`,
        });
      }
    }
  }

  let i = first.length;
  let j = second.length;
  let lcs = '';
  while (i > 0 && j > 0) {
    if (first[i - 1] === second[j - 1]) {
      lcs = first[i - 1] + lcs;
      i--;
      j--;
    } else if (table[i - 1][j] >= table[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return { steps, lcs, table: table.map(row => [...row]) };
}
