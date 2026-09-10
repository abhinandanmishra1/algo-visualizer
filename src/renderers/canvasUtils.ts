export function setupCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  dpr: number = window.devicePixelRatio || 1
): CanvasRenderingContext2D {
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d')!;
  ctx.resetTransform();
  ctx.scale(dpr, dpr);
  return ctx;
}

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string = '#94a3b8',
  arrowSize: number = 10,
  lineWidth: number = 3
) {
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - arrowSize * Math.cos(angle - Math.PI / 6),
    toY - arrowSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - arrowSize * Math.cos(angle + Math.PI / 6),
    toY - arrowSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawCurvedArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  ctrlX: number,
  ctrlY: number,
  color: string = '#38bdf8',
  arrowSize: number = 10,
  lineWidth: number = 3
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.quadraticCurveTo(ctrlX, ctrlY, toX, toY);
  ctx.stroke();

  // Tangent angle at the endpoint
  const angle = Math.atan2(toY - ctrlY, toX - ctrlX);

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - arrowSize * Math.cos(angle - Math.PI / 6),
    toY - arrowSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - arrowSize * Math.cos(angle + Math.PI / 6),
    toY - arrowSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawPointerBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  bgColor: string,
  textColor: string = '#ffffff',
  icon: string = ''
) {
  ctx.save();
  ctx.font = 'bold 12px Inter, sans-serif';
  const label = icon ? `${icon} ${text}` : text;
  const metrics = ctx.measureText(label);
  const padX = 10;
  const padY = 5;
  const badgeWidth = metrics.width + padX * 2;
  const badgeHeight = 24;

  const bx = x - badgeWidth / 2;
  const by = y - badgeHeight / 2;

  // Background pill
  ctx.fillStyle = bgColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.roundRect(bx, by, badgeWidth, badgeHeight, 12);
  ctx.fill();

  // Reset shadow for text
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y);
  ctx.restore();
}

export function drawBurnInCaption(
  ctx: CanvasRenderingContext2D,
  caption: string,
  width: number,
  height: number
) {
  if (!caption) return;
  ctx.save();
  const pad = 24;
  const boxHeight = 64;
  const boxY = height - boxHeight - pad;
  const boxX = pad;
  const boxW = width - pad * 2;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxHeight, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(caption, width / 2, boxY + boxHeight / 2);
  ctx.restore();
}
