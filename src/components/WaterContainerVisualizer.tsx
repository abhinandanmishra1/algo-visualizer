import { useMemo } from 'react';

/**
 * Minimal shape of the per-step state this component needs. It is intentionally
 * a subset/superset-tolerant read of whatever `generateTwoPointerSteps` emits —
 * extra fields on the real step state are simply ignored.
 */
export interface WaterContainerState {
  array?: number[];
  left?: number;
  right?: number;
  currentArea?: number;
  currentMax?: number;
  found?: boolean;
}

interface WaterContainerVisualizerProps {
  elements: number[];
  state: WaterContainerState;
  className?: string;
}

const VIEW_W = 900;
const VIEW_H = 420;
const BASELINE = VIEW_H - 40;
const TOP_PAD = 40;

export function WaterContainerVisualizer({ elements, state, className = '' }: WaterContainerVisualizerProps) {
  const heights = state.array && state.array.length > 0 ? state.array : elements;
  const n = heights.length;
  const left = state.left ?? 0;
  const right = state.right ?? Math.max(0, n - 1);
  const isFound = !!state.found;

  const { barSlots } = useMemo(() => {
    const maxHeight = Math.max(...heights, 1);
    const gap = n > 1 ? (VIEW_W * 0.08) / (n - 1) : 0;
    const usable = VIEW_W - gap * (n - 1);
    const barWidth = usable / n;
    const barSlots = heights.map((h, i) => {
      const x = i * (barWidth + gap);
      const scaledH = (h / maxHeight) * (BASELINE - TOP_PAD);
      return {
        index: i,
        value: h,
        x,
        width: barWidth,
        height: scaledH,
        y: BASELINE - scaledH,
        centerX: x + barWidth / 2,
      };
    });
    return { barSlots };
  }, [heights, n]);

  const leftSlot = barSlots[left];
  const rightSlot = barSlots[right];

  const waterHeight = leftSlot && rightSlot ? Math.min(leftSlot.height, rightSlot.height) : 0;
  const waterX = leftSlot ? leftSlot.x + leftSlot.width : 0;
  const waterWidth = rightSlot && leftSlot ? rightSlot.x - waterX : 0;
  const waterY = BASELINE - waterHeight;
  const width = right - left;
  const heightAtWater = leftSlot && rightSlot ? Math.min(leftSlot.value, rightSlot.value) : 0;
  const area = state.currentArea ?? width * heightAtWater;
  const maxSoFar = state.currentMax;

  const rainDrops = useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: (i * 0.35) % 1.4,
      xJitter: (i * 37) % 100,
    })),
    []
  );

  return (
    <div className={`relative w-full h-full flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden ${className}`}>
      {/* Header readout */}
      <div className="flex items-center justify-between px-5 pt-4 pb-1 flex-wrap gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">Current Area</span>
          <span
            className={`text-2xl font-bold font-mono transition-colors duration-300 ${
              maxSoFar !== undefined && area >= maxSoFar ? 'text-emerald-400' : 'text-sky-300'
            }`}
          >
            {area}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            (min({leftSlot?.value ?? 0}, {rightSlot?.value ?? 0}) × {Math.max(width, 0)})
          </span>
        </div>
        {maxSoFar !== undefined && (
          <div className="flex items-baseline gap-2 bg-slate-900/70 border border-amber-500/30 rounded-lg px-3 py-1">
            <span className="text-xs uppercase tracking-wide text-amber-300/80">Max So Far</span>
            <span className="text-lg font-bold font-mono text-amber-300">{maxSoFar}</span>
          </div>
        )}
      </div>

      {isFound && (
        <div className="px-5 -mt-1 pb-1">
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2.5 py-0.5">
            Optimal container found
          </span>
        </div>
      )}

      {/* Chart */}
      <div className="flex-1 min-h-0 px-4 pb-4">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="water-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.35" />
            </linearGradient>
            <clipPath id="water-clip">
              <rect x={waterX} y={waterY} width={Math.max(waterWidth, 0)} height={Math.max(waterHeight, 0)} />
            </clipPath>
          </defs>

          {/* Baseline */}
          <line x1={0} y1={BASELINE} x2={VIEW_W} y2={BASELINE} stroke="#334155" strokeWidth={2} />

          {/* Water fill, drawn beneath bars so bar outlines read as "container walls" */}
          {waterWidth > 0 && waterHeight > 0 && (
            <g>
              <rect
                x={waterX}
                y={waterY}
                width={waterWidth}
                height={waterHeight}
                fill="url(#water-fill)"
                stroke="#38bdf8"
                strokeOpacity={0.5}
                strokeWidth={1.5}
                className="transition-all duration-300 ease-out"
              />
              {/* subtle water surface line */}
              <line
                x1={waterX}
                y1={waterY}
                x2={waterX + waterWidth}
                y2={waterY}
                stroke="#7dd3fc"
                strokeWidth={2}
                strokeOpacity={0.8}
              />
              {/* raindrops, clipped so they only "land" inside the water body */}
              <g clipPath="url(#water-clip)">
                {rainDrops.map((d) => (
                  <circle
                    key={d.id}
                    r={3}
                    fill="#bae6fd"
                    opacity={0.85}
                    className="water-raindrop"
                    style={{
                      // @ts-expect-error custom CSS vars for keyframe
                      '--drop-x': `${waterX + (waterWidth * d.xJitter) / 100}px`,
                      '--drop-delay': `${d.delay}s`,
                    }}
                  />
                ))}
              </g>
            </g>
          )}

          {/* Bars */}
          {barSlots.map((slot) => {
            const isLeft = slot.index === left;
            const isRight = slot.index === right;
            const isPointer = isLeft || isRight;
            const fill = isFound
              ? '#10b981'
              : isLeft
              ? '#06b6d4'
              : isRight
              ? '#f43f5e'
              : '#334155';
            return (
              <g key={slot.index}>
                <rect
                  x={slot.x}
                  y={slot.y}
                  width={slot.width}
                  height={slot.height}
                  rx={4}
                  fill={fill}
                  fillOpacity={isPointer || isFound ? 0.9 : 0.55}
                  stroke={isPointer ? fill : '#475569'}
                  strokeWidth={isPointer ? 3 : 1}
                  className={`transition-all duration-300 ease-out ${isPointer ? 'drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : ''}`}
                />
                <text
                  x={slot.centerX}
                  y={slot.y - 10}
                  textAnchor="middle"
                  className="fill-slate-200 font-mono font-bold"
                  fontSize={16}
                >
                  {slot.value}
                </text>
                <text
                  x={slot.centerX}
                  y={BASELINE + 20}
                  textAnchor="middle"
                  className="fill-slate-500 font-mono"
                  fontSize={11}
                >
                  {slot.index}
                </text>
                {isLeft && (
                  <text x={slot.centerX} y={BASELINE + 36} textAnchor="middle" fontSize={11} fill="#06b6d4" fontWeight="bold">
                    L
                  </text>
                )}
                {isRight && (
                  <text x={slot.centerX} y={BASELINE + 36} textAnchor="middle" fontSize={11} fill="#f43f5e" fontWeight="bold">
                    R
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <style>{`
        .water-raindrop {
          cx: var(--drop-x);
          animation: water-drop-fall 1.4s linear infinite;
          animation-delay: var(--drop-delay);
        }
        @keyframes water-drop-fall {
          0% {
            cy: ${TOP_PAD}px;
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          85% {
            opacity: 0.9;
          }
          100% {
            cy: ${BASELINE}px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
