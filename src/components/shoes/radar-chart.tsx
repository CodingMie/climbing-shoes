import { cn } from "@/lib/utils";

const CENTER_X = 150;
const CENTER_Y = 140;
const RADIUS = 85;

const LABEL_POSITIONS = [
  { x: 150, y: 32, anchor: "middle" },
  { x: 232, y: 95, anchor: "start" },
  { x: 232, y: 188, anchor: "start" },
  { x: 150, y: 250, anchor: "middle" },
  { x: 68, y: 188, anchor: "end" },
  { x: 68, y: 95, anchor: "end" },
] as const;

function point(axis: number, radius: number): string {
  const angle = (Math.PI / 180) * (90 - axis * 60);
  const x = Math.round((CENTER_X + radius * Math.cos(angle)) * 10) / 10;
  const y = Math.round((CENTER_Y - radius * Math.sin(angle)) * 10) / 10;
  return `${x},${y}`;
}

export function RadarChart({
  dimensions,
  ariaLabel = "六维度均分雷达图",
  formatValue = (value) => value.toFixed(1),
  className,
}: {
  dimensions: { label: string; avg: number }[];
  ariaLabel?: string;
  formatValue?: (value: number) => string;
  className?: string;
}) {
  const rings = [1, 2, 3, 4, 5].map((step) =>
    dimensions
      .map((_, axis) => point(axis, (step / 5) * RADIUS))
      .join(" "),
  );
  const axesPath = dimensions
    .map((_, axis) => `M${CENTER_X} ${CENTER_Y} L${point(axis, RADIUS)}`)
    .join(" ");
  const valuePoints = dimensions.map((dimension, axis) =>
    point(axis, (dimension.avg / 5) * RADIUS),
  );

  return (
    <svg
      viewBox="0 0 300 262"
      role="img"
      aria-label={ariaLabel}
      className={cn("mt-2.5 h-auto w-full max-w-[264px]", className)}
    >
      <g fill="none" stroke="var(--hairline)" strokeWidth="1">
        {rings.map((ring) => (
          <polygon key={ring} points={ring} />
        ))}
        <path d={axesPath} />
      </g>
      <polygon
        points={valuePoints.join(" ")}
        fill="var(--trail-tint)"
        stroke="var(--trail)"
        strokeWidth="1.5"
      />
      <g fill="var(--trail)">
        {valuePoints.map((valuePoint, index) => {
          const [x, y] = valuePoint.split(",").map(Number);
          return (
            <circle
              key={dimensions[index].label}
              cx={x}
              cy={y}
              r="2.5"
            />
          );
        })}
      </g>
      <g fontSize="11" fill="var(--granite)">
        {dimensions.map((dimension, axis) => (
          <text
            key={dimension.label}
            x={LABEL_POSITIONS[axis].x}
            y={LABEL_POSITIONS[axis].y}
            textAnchor={LABEL_POSITIONS[axis].anchor}
          >
            {dimension.label}{" "}
            <tspan className="font-mono" fontWeight="600" fill="var(--ink)">
              {formatValue(dimension.avg)}
            </tspan>
          </text>
        ))}
      </g>
    </svg>
  );
}
