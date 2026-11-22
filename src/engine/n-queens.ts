export type QueensAction = 'try' | 'place' | 'backtrack' | 'solution';

export interface QueensStep {
  board: number[];
  row: number;
  col: number;
  action: QueensAction;
  safe: boolean;
  explanation: string;
}

export interface QueensResult {
  steps: QueensStep[];
  solutionCount: number;
}

export function buildQueensTrace(size: number): QueensResult {
  if (!Number.isInteger(size) || size < 1 || size > 8) {
    throw new RangeError('Board size must be an integer between 1 and 8.');
  }

  const board = Array(size).fill(-1) as number[];
  const steps: QueensStep[] = [];
  let solutionCount = 0;

  const isSafe = (row: number, col: number) => {
    for (let previousRow = 0; previousRow < row; previousRow++) {
      const previousCol = board[previousRow];
      if (previousCol === col || Math.abs(previousCol - col) === row - previousRow) return false;
    }
    return true;
  };

  const search = (row: number): void => {
    if (row === size) {
      solutionCount++;
      steps.push({
        board: [...board], row: size - 1, col: board[size - 1],
        action: 'solution', safe: true,
        explanation: `All ${size} queens are placed safely. Solution #${solutionCount} found.`,
      });
      return;
    }

    for (let col = 0; col < size; col++) {
      const safe = isSafe(row, col);
      steps.push({
        board: [...board], row, col, action: 'try', safe,
        explanation: safe
          ? `Try column ${col + 1} in row ${row + 1}. No earlier queen shares this column or diagonal.`
          : `Reject column ${col + 1} in row ${row + 1}. It conflicts with a queen in an earlier row.`,
      });

      if (!safe) continue;

      board[row] = col;
      steps.push({
        board: [...board], row, col, action: 'place', safe: true,
        explanation: `Place a queen at row ${row + 1}, column ${col + 1}. Move on to row ${row + 2}.`,
      });

      search(row + 1);

      board[row] = -1;
      if (row < size - 1) {
        steps.push({
          board: [...board], row, col, action: 'backtrack', safe: true,
          explanation: `Backtrack: remove the queen from row ${row + 1}, column ${col + 1}, then try the next column.`,
        });
      }
    }
  };

  search(0);
  return { steps, solutionCount };
}
