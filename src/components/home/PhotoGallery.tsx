"use client";

import Image from "next/image";

/* ── Types ─────────────────────────────────────────────────────────────────── */
interface GalleryImage {
  src: string;
  h: number;
}

/* ── Column data ───────────────────────────────────────────────────────────── */
const H = 220;

const col1: GalleryImage[] = [
  { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=440&fit=crop", h: H },
];

const col2: GalleryImage[] = [
  { src: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=440&fit=crop", h: H },
];

const col3: GalleryImage[] = [
  { src: "https://images.unsplash.com/photo-1439130490301-25e322d88054?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=600&h=440&fit=crop", h: H },
];

const col4: GalleryImage[] = [
  { src: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&h=440&fit=crop", h: H },
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=440&fit=crop", h: H },
];

/* ── Single column ─────────────────────────────────────────────────────────── */
function GalleryColumn({
  images,
  duration,
  reverse = false,
}: {
  images: GalleryImage[];
  duration: string;
  reverse?: boolean;
}) {
  const doubled = [...images, ...images];

  return (
    <div className="flex-1 min-w-0 overflow-hidden">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          animation: `${reverse ? "colDown" : "colUp"} ${duration} linear infinite`,
          willChange: "transform",
        }}
      >
        {doubled.map((img, i) => (
          <div
            key={i}
            className="relative w-full shrink-0 overflow-hidden"
            style={{
              height: img.h,
              borderRadius: "12px",
            }}
          >
            <Image
              src={img.src}
              alt=""
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main section ──────────────────────────────────────────────────────────── */
export default function PhotoGallery() {
  return (
    <section className="relative overflow-hidden" style={{ background: "#0a0e0d" }}>
      <style>{`
        @keyframes colUp {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @keyframes colDown {
          from { transform: translateY(-50%); }
          to   { transform: translateY(0); }
        }
      `}</style>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <div className="relative" style={{ height: "clamp(340px, 60vw, 720px)" }}>

        {/* Top fade */}
        <div
          className="absolute top-0 inset-x-0 h-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #0a0e0d 0%, transparent 100%)" }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 inset-x-0 h-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, #0a0e0d 0%, transparent 100%)" }}
        />

        {/* Columns — no side padding, tight gap */}
        <div className="absolute inset-0 flex gap-2">
          <GalleryColumn images={col1} duration="32s" />
          <GalleryColumn images={col2} duration="26s" reverse />
          <GalleryColumn images={col3} duration="29s" />
          <GalleryColumn images={col4} duration="34s" reverse />
        </div>
      </div>

    </section>
  );
}
