import { Asterisk } from "lucide-react";

const items = [
  "BookTick",
  "Adventure",
  "Curated Travel",
  "Discover the World",
  "Best Experiences",
  "Wanderlust",
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
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
            className="font-serif italic text-white px-6 sm:px-8"
            style={{
              fontSize: "clamp(20px, 3.2vw, 36px)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            {item}
          </span>
          <Asterisk
            className="text-white/85 shrink-0"
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
  const stripH = "clamp(52px, 5.2vw, 70px)";

  return (
    <section
      className="relative overflow-hidden bg-cream"
      style={{ height: "clamp(180px, 18vw, 220px)" }}
    >
      {/* ── Gold strip — rotated -8deg, scrolls reverse ── */}
      <div
        className="absolute overflow-hidden"
        style={{
          backgroundColor: "#F2A93B",
          height: stripH,
          left: "-12%",
          right: "-12%",
          top: "50%",
          transform: "translateY(-50%) rotate(-8deg)",
          transformOrigin: "center center",
          zIndex: 10,
        }}
      >
        <MarqueeRow reverse />
      </div>

      {/* ── Teal strip — rotated +8deg, scrolls forward — sits on top ── */}
      <div
        className="absolute overflow-hidden"
        style={{
          backgroundColor: "#1F8C9E",
          height: stripH,
          left: "-12%",
          right: "-12%",
          top: "50%",
          transform: "translateY(-50%) rotate(8deg)",
          transformOrigin: "center center",
          zIndex: 20,
        }}
      >
        <MarqueeRow />
      </div>
    </section>
  );
}
