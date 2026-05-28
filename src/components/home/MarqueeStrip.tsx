const row1 = [
  "Goa", "Kerala", "Dubai", "Bali", "Maldives",
  "Rajasthan", "Singapore", "Paris", "Shimla", "Thailand",
];

const row2 = [
  "Beach Escapes", "Mountain Treks", "Luxury Stays",
  "Cultural Tours", "Adventure Trips", "Honeymoon Specials",
  "Family Holidays", "Weekend Getaways",
];

function Strip({
  items,
  reverse = false,
  bg,
  fadeColor,
  textColor = "#fff",
}: {
  items: string[];
  reverse?: boolean;
  bg: string;
  fadeColor: string;
  textColor?: string;
}) {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: bg, height: "clamp(54px,5.6vw,72px)" }}
    >
      {/* ── Left & right edge fades ── */}
      <div
        className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{ width: "12%", background: `linear-gradient(to right, ${fadeColor}, transparent)` }}
      />
      <div
        className="absolute inset-y-0 right-0 z-10 pointer-events-none"
        style={{ width: "12%", background: `linear-gradient(to left, ${fadeColor}, transparent)` }}
      />

      {/* ── Scrolling content ── */}
      <div className="flex items-center h-full overflow-hidden">
        <div className={`flex items-center whitespace-nowrap ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
          {repeated.map((item, i) => (
            <div key={i} className="inline-flex items-center shrink-0">
              <span
                style={{
                  color: textColor,
                  fontFamily: "'Georgia', serif",
                  fontStyle: "italic",
                  fontSize: "clamp(15px,1.7vw,23px)",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  padding: "0 clamp(20px,2.2vw,36px)",
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </span>
              <span style={{ color: textColor, opacity: 0.4, fontSize: "clamp(8px,0.9vw,11px)", userSelect: "none" }}>
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MarqueeStrip() {
  return (
    <section className="overflow-hidden bg-white">
      {/* ── Top rule ── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #E5E7EB 20%, #E5E7EB 80%, transparent)" }} />

      {/* ── Row 1 — teal, right → left ── */}
      <Strip
        items={row1}
        reverse={false}
        bg="linear-gradient(90deg, #1A7F90 0%, #1F8C9E 40%, #20909B 100%)"
        fadeColor="#1F8C9E"
      />

      {/* ── 2px gap ── */}
      <div style={{ height: 2, background: "#fff" }} />

      {/* ── Row 2 — amber, left → right ── */}
      <Strip
        items={row2}
        reverse={true}
        bg="linear-gradient(90deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)"
        fadeColor="#F59E0B"
      />

      {/* ── Bottom rule ── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #E5E7EB 20%, #E5E7EB 80%, transparent)" }} />
    </section>
  );
}
