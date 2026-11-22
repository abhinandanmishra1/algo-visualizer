export type InputPattern = 'random' | 'sorted' | 'reversed';

export interface SortingMetrics {
  id: string;
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  comparisons: number;
  writes: number;
  swaps: number;
  sorted: number[];
}

function createInput(size: number, pattern: InputPattern): number[] {
  if (pattern === 'sorted') return Array.from({ length: size }, (_, i) => i + 1);
  if (pattern === 'reversed') return Array.from({ length: size }, (_, i) => size - i);

  // Seeded pseudo-random values keep comparisons reproducible between runs.
  let seed = size * 9301 + 49297;
  return Array.from({ length: size }, () => {
    seed = (seed * 233280 + 12345) % 2147483647;
    return seed % 1000;
  });
}

export function runSortingBenchmarks(size: number, pattern: InputPattern): SortingMetrics[] {
  const input = createInput(Math.max(2, Math.min(100, Math.floor(size))), pattern);

  const bubble = [...input];
  let comparisons = 0, writes = 0, swaps = 0;
  for (let end = bubble.length - 1; end > 0; end--) {
    let changed = false;
    for (let i = 0; i < end; i++) {
      comparisons++;
      if (bubble[i] > bubble[i + 1]) {
        [bubble[i], bubble[i + 1]] = [bubble[i + 1], bubble[i]];
        swaps++; writes += 2; changed = true;
      }
    }
    if (!changed) break;
  }
  const bubbleMetrics: SortingMetrics = {
    id: 'bubble', name: 'Bubble Sort', timeComplexity: 'O(n²) average / O(n) best',
    spaceComplexity: 'O(1)', comparisons, writes, swaps, sorted: bubble,
  };

  const insertion = [...input];
  comparisons = 0; writes = 0; swaps = 0;
  for (let i = 1; i < insertion.length; i++) {
    const key = insertion[i];
    let j = i - 1;
    while (j >= 0) {
      comparisons++;
      if (insertion[j] <= key) break;
      insertion[j + 1] = insertion[j]; writes++; j--;
    }
    insertion[j + 1] = key; writes++;
  }
  const insertionMetrics: SortingMetrics = {
    id: 'insertion', name: 'Insertion Sort', timeComplexity: 'O(n²) average / O(n) best',
    spaceComplexity: 'O(1)', comparisons, writes, swaps, sorted: insertion,
  };

  const merged = [...input];
  comparisons = 0; writes = 0; swaps = 0;
  const merge = (left: number, mid: number, right: number) => {
    const a = merged.slice(left, mid + 1), b = merged.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < a.length && j < b.length) {
      comparisons++;
      merged[k++] = a[i] <= b[j] ? a[i++] : b[j++];
      writes++;
    }
    while (i < a.length) { merged[k++] = a[i++]; writes++; }
    while (j < b.length) { merged[k++] = b[j++]; writes++; }
  };
  const mergeSort = (left: number, right: number) => {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(left, mid); mergeSort(mid + 1, right); merge(left, mid, right);
  };
  mergeSort(0, merged.length - 1);
  const mergeMetrics: SortingMetrics = {
    id: 'merge', name: 'Merge Sort', timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)', comparisons, writes, swaps, sorted: merged,
  };

  const quick = [...input];
  comparisons = 0; writes = 0; swaps = 0;
  const quickSort = (low: number, high: number) => {
    if (low >= high) return;
    const pivot = quick[high];
    let boundary = low;
    for (let current = low; current < high; current++) {
      comparisons++;
      if (quick[current] < pivot) {
        if (boundary !== current) {
          [quick[boundary], quick[current]] = [quick[current], quick[boundary]];
          swaps++; writes += 2;
        }
        boundary++;
      }
    }
    if (boundary !== high) {
      [quick[boundary], quick[high]] = [quick[high], quick[boundary]];
      swaps++; writes += 2;
    }
    quickSort(low, boundary - 1); quickSort(boundary + 1, high);
  };
  quickSort(0, quick.length - 1);
  const quickMetrics: SortingMetrics = {
    id: 'quick', name: 'Quick Sort', timeComplexity: 'O(n log n) average / O(n²) worst',
    spaceComplexity: 'O(log n) average recursion', comparisons, writes, swaps, sorted: quick,
  };

  return [bubbleMetrics, insertionMetrics, mergeMetrics, quickMetrics];
}
