import { Asterisk } from "lucide-react";

const items = [
  "BookTick",
  "Adventure",
  "Curated Travel",
  "Discover the World",
  "Best Experiences",
  "Wanderlust",
];

function MarqueeRow({
  reverse = false,
  textColor = "text-white",
}: {
  reverse?: boolean;
  textColor?: string;
}) {
  const repeated = [...items, ...items];

  return (
    <div
      className={`flex items-center h-full whitespace-nowrap ${
        reverse ? "animate-marquee-rev" : "animate-marquee"
      }`}
    >
      {repeated.map((item, i) => (
        <div key={i} className="flex items-center">
          <span
            className={`font-serif italic ${textColor} px-6 sm:px-8`}
            style={{
              fontSize: "clamp(20px, 3.2vw, 36px)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            {item}
          </span>
          <Asterisk
            className={`${textColor} opacity-80 shrink-0`}
            style={{
              width: "clamp(14px, 2vw, 22px)",
              height: "clamp(14px, 2vw, 22px)",
            }}
            strokeWidth={2.2}
          />
        </div>
      ))}
    </div>
  );
}

export default function MarqueeStrip() {
  const stripHeight = "clamp(52px, 5.2vw, 72px)";

  return (
    <section className="relative py-10 sm:py-12 overflow-hidden bg-cream flex flex-col gap-4">

      {/* ── Strip 1 — Black, rotated left ── */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#0E1424",
          height: stripHeight,
          transform: "rotate(-3deg)",
          marginLeft: "-6%",
          marginRight: "-6%",
        }}
      >
        <MarqueeRow reverse />
      </div>

      {/* ── Strip 2 — Teal, rotated right ── */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#1F8C9E",
          height: stripHeight,
          transform: "rotate(3deg)",
          marginLeft: "-6%",
          marginRight: "-6%",
        }}
      >
        <MarqueeRow />
      </div>

    </section>
  );
}
