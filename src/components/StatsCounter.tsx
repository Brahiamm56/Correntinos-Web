interface StatsCounterProps {
  value: number;
  suffix?: string;
}

export default function StatsCounter({ value, suffix = "" }: StatsCounterProps) {
  return (
    <div className="inline-block">
      <span
        className="text-4xl font-bold tabular-nums text-[var(--verde-profundo)] sm:text-5xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {value}
        <span className="text-[var(--dorado)]">{suffix}</span>
      </span>
    </div>
  );
}
