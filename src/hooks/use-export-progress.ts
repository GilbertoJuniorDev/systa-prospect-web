import { useEffect, useState } from 'react';

export interface ExportProgressState {
  progress: number;
  message: string;
}

const MIN_ESTIMATE_MS = 3000;
const MAX_ESTIMATE_MS = 20000;
const MS_PER_ROW = 0.08;
const MAX_SIMULATED_PROGRESS = 88;
const TICK_MS = 150;

function clamp(min: number, value: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getMessage(elapsedMs: number): string {
  if (elapsedMs < 4000) return 'Preparando sua exportação…';
  if (elapsedMs < 15000) return 'Isso pode levar alguns segundos…';
  if (elapsedMs < 40000) {
    return 'Consultas grandes podem levar um pouco mais — continue aguardando…';
  }
  return 'Isso está demorando mais do que o esperado. Por favor, aguarde…';
}

function computeProgress(elapsedMs: number, estimateMs: number): number {
  return Math.min(
    MAX_SIMULATED_PROGRESS,
    (1 - Math.exp((-3 * elapsedMs) / estimateMs)) * MAX_SIMULATED_PROGRESS,
  );
}

/**
 * Simulates export progress by elapsed time, since the XLSX export endpoint is
 * fully synchronous (no real job/queue progress is available from the backend).
 * The curve is asymptotic and capped below 100% so it never implies false completion.
 */
export function useExportProgress(active: boolean, total: number): ExportProgressState {
  const [state, setState] = useState<ExportProgressState>({
    progress: 0,
    message: getMessage(0),
  });

  // Reset to the initial state during render (not inside the effect below) whenever
  // `active` flips — this is React's documented pattern for adjusting state in
  // response to a prop change, and it avoids a stale-progress flash for the ~150ms
  // before the interval below fires its first tick.
  const [prevActive, setPrevActive] = useState(active);
  if (active !== prevActive) {
    setPrevActive(active);
    if (active) {
      setState({ progress: 0, message: getMessage(0) });
    }
  }

  useEffect(() => {
    if (!active) {
      return;
    }

    const startTime = Date.now();
    const estimateMs = clamp(MIN_ESTIMATE_MS, MIN_ESTIMATE_MS + total * MS_PER_ROW, MAX_ESTIMATE_MS);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setState({
        progress: computeProgress(elapsed, estimateMs),
        message: getMessage(elapsed),
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [active, total]);

  return state;
}
