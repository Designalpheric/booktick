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
  // duplicate items so the scroll loop is seamless at the -50% reset point
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
  return (
    <section className="relative py-10 sm:py-12 overflow-hidden bg-cream">
      <div
        className="relative mx-auto overflow-hidden"
        style={{ height: "clamp(56px, 5.6vw, 78px)" }}
      >
        {/* ── Black strip — back, taller, rotated, peeks out clearly ── */}
        <div
          className="absolute overflow-hidden"
          style={{
            backgroundColor: "#0E1424",
            left: "-8%",
            right: "-8%",
            top: "-14px",
            bottom: "-14px",
            transform: "rotate(-5deg)",
            transformOrigin: "center center",
          }}
        >
          <MarqueeRow reverse />
        </div>

        {/* ── Gold strip — front, straight, same vertical center ── */}
        <div
          className="absolute inset-0 overflow-hidden z-10"
          style={{ backgroundColor: "#F2A93B" }}
        >
          <MarqueeRow />
        </div>
      </div>
    </section>
  );
}
