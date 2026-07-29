import { motion } from "motion/react";

/** Deterministic pseudo-QR. Decorative only — nothing here encodes data. */
function modules(seed: string, n: number) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const cells: boolean[] = [];
  for (let i = 0; i < n * n; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    cells.push(((h >>> 0) % 100) > 52);
  }
  return cells;
}

const N = 25;

export function QrCode({
  value,
  size = 220,
  className,
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const cells = modules(value, N);
  const unit = 100 / N;

  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-label="Event QR code"
      role="img"
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <rect width="100" height="100" rx="6" fill="white" />
        {cells.map((on, i) => {
          const x = i % N;
          const y = Math.floor(i / N);
          if (!on || inFinder(x, y)) return null;
          return (
            <rect
              key={i}
              x={x * unit + unit * 0.12}
              y={y * unit + unit * 0.12}
              width={unit * 0.76}
              height={unit * 0.76}
              rx={unit * 0.22}
              fill="#090909"
            />
          );
        })}
        {[
          [0, 0],
          [N - 7, 0],
          [0, N - 7],
        ].map(([fx, fy], i) => (
          <g key={i}>
            <rect
              x={fx * unit + unit * 0.1}
              y={fy * unit + unit * 0.1}
              width={unit * 6.8}
              height={unit * 6.8}
              rx={unit * 1.9}
              fill="none"
              stroke="#090909"
              strokeWidth={unit * 0.95}
            />
            <rect
              x={(fx + 2) * unit + unit * 0.1}
              y={(fy + 2) * unit + unit * 0.1}
              width={unit * 2.8}
              height={unit * 2.8}
              rx={unit * 0.9}
              fill="#090909"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function AnimatedQr({ value, size = 220 }: { value: string; size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl bg-white p-3"
      style={{ width: size + 24 }}
    >
      <QrCode value={value} size={size} />
    </motion.div>
  );
}
