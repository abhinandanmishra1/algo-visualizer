# AlgoVisualizer Platform

A config-driven, canvas-rendered algorithm visualization engine with step-by-step playback, mathematical invariants, dynamic panels, 9:16 vertical reels mode, and in-browser video export via `canvas.captureStream()` and `MediaRecorder`.

## Architecture

1. **Pure `<canvas>` 2D Rendering Engine**:
   - Crisp High-DPI support (`devicePixelRatio` scaling).
   - Fast GPU-accelerated rendering.
   - Direct video stream capture via `canvas.captureStream()`.

2. **Decoupled Playback Engine (`src/engine/engine.ts`)**:
   - Reusable state machine managing `currentStep`, `isPlaying`, `speedMs`, and playback transitions.
   - Zero UI coupling; algorithm authors only write declarative configs.

3. **Config-Driven Algorithms (`src/algorithms/*.ts`)**:
   - **Floyd's Cycle Detection**: 11 fine-grained steps illustrating both Phase 1 (Collision detection between Tortoise 🐢 and Hare 🐇) and Phase 2 (Cycle start discovery), mathematical invariants ($2k - k = nC$), and distance telemetry.
   - **Binary Search**: Logarithmic search visualization with left/right/mid markers, interval halving formulas, and comparison branches.

4. **Dynamic Panels**:
   - **Illustration Canvas**: Top visual diagram with pointer badges and burn-in captions.
   - **Code Walkthrough**: Monospace code view with active line indicators driven by `step.codeLines`.
   - **Intuition (Why)**: Explains the algorithmic reasoning behind each step.
   - **Mathematical Invariants**: Live formula evaluation ($a = nC - b$, $\text{mid} = \lfloor \frac{L+R}{2} \rfloor$).
   - **Telemetry / Distance Map**: Live counter chips tracking pointer traversal.

5. **Reels Mode & Video Export**:
   - Instant toggle between **16:9 widescreen** and **9:16 vertical reel**.
   - Burn-in caption rendering on the canvas.
   - Built-in video recorder producing clean `.webm` video files at 1.4s/step pacing.

## Development

```bash
# Install dependencies
pnpm install

# Start local dev server
pnpm dev

# Run unit tests
pnpm test

# Build for production
pnpm build
```
