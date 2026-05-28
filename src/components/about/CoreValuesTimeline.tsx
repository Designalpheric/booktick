"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const values = [
  {
    title: "Passion for Travel",
    desc: "We live and breathe travel. Our team is made up of avid explorers who genuinely care about your experience.",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=700&h=480&fit=crop",
  },
  {
    title: "Trust & Transparency",
    desc: "No hidden fees, no surprises. We believe in complete transparency in all our interactions and pricing.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&h=480&fit=crop",
  },
  {
    title: "Global Expertise",
    desc: "With expertise across 50+ destinations, our consultants bring local knowledge and global connections to every trip.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&h=480&fit=crop",
  },
  {
    title: "Excellence in Service",
    desc: "We hold ourselves to the highest standards. Our 4.8/5 rating reflects our unwavering commitment to quality.",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=700&h=480&fit=crop",
  },
];

export default function CoreValuesTimeline() {
  return (
    <div className="mb-16">
      {/* ── Section header ── */}
      <div className="text-center mb-10 xs:mb-12 sm:mb-14">
        <h2
          className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Our Core{" "}
          <span className="font-serif italic font-normal" style={{ color: "#1F8C9E" }}>
            Values
          </span>
        </h2>
      </div>

      {/* ── Zig-zag timeline ── */}
      <div className="relative max-w-5xl mx-auto">
        {/* Vertical center line — desktop only */}
        <div
          className="hidden md:block absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-px pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(31,140,158,0.28) 6%, rgba(31,140,158,0.28) 94%, transparent)",
          }}
        />

        <div className="flex flex-col gap-10 xs:gap-12 sm:gap-14 md:gap-20">
          {values.map((val, i) => {
            const isLeft = i % 2 === 0;

            return (
              <div key={val.title} className="relative">
                {/* Center connector dot — desktop only */}
                <div
                  className="hidden md:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: "#1F8C9E",
                    boxShadow: "0 0 0 3px #f9fafb, 0 0 0 5px rgba(31,140,158,0.22)",
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xs:gap-6 md:gap-14 items-center">
                  {/* ── Image card ── */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -52 : 52 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px 0px" }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative rounded-3xl overflow-hidden h-[200px] xs:h-[224px] sm:h-[248px] md:h-[260px] ${
                      isLeft ? "md:order-1" : "md:order-2"
                    }`}
                    style={{
                      boxShadow:
                        "0 2px 4px rgba(20,20,20,0.04), 0 24px 44px -18px rgba(20,20,20,0.18)",
                    }}
                  >
                    <Image
                      src={val.image}
                      alt={val.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 45vw"
                    />
                  </motion.div>

                  {/* ── Text block ── */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? 52 : -52 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px 0px" }}
                    transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={isLeft ? "md:order-2" : "md:order-1"}
                  >
                    <h3
                      className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 leading-snug"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {val.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-base">
                      {val.desc}
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
