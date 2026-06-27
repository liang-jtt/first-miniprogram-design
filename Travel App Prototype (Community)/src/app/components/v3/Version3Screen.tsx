import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, animate } from "motion/react";

import svgPaths from "../../../imports/ScreenCResult/svg-178vylhgc4";
import gallerySvgPaths from "../../../imports/ScreenAGallery/svg-hdvfxiy51l";

import { LISTINGS as CANONICAL_LISTINGS } from "../v2/listings";

const LISTINGS = CANONICAL_LISTINGS;

const AnimCtx = createContext<{ instant: boolean }>({ instant: false });

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, []);
  return reduced;
}

function Rise({
  children,
  delay = 0,
  duration = 0.3,
  y = 12,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const { instant } = useContext(AnimCtx);
  if (instant) return <div style={style}>{children}</div>;
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function WipeDivider({
  delay = 0,
  duration = 0.4,
  color = "rgba(255,255,255,0.2)",
  height = 0.75,
}: {
  delay?: number;
  duration?: number;
  color?: string;
  height?: number;
}) {
  const { instant } = useContext(AnimCtx);
  if (instant) {
    return <div style={{ height, background: color, width: "100%" }} />;
  }
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration, ease: "easeOut", delay }}
      style={{
        height,
        background: color,
        width: "100%",
        transformOrigin: "left center",
      }}
    />
  );
}

function Reveal({
  children,
  delay = 0,
  duration = 0.4,
  y = 16,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
}) {
  const { instant } = useContext(AnimCtx);
  if (instant) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

import heroImg from "../../../imports/ScreenCResult/46af54ed1c12d4f3c69cabe0c3bdc2e01a10bc07.png";

const FONT_STACK = "'Google Sans Flex', 'Google Sans', Inter, sans-serif";
const ACCENT = "#bd8e3c";
const CITRON = "#ddd864";
const PIN = "#cfd205";
const CARD_BG = "#fdfaf6";

export default function Version3Screen({ noScroll = false }: { noScroll?: boolean } = {}) {
  const reduced = useReducedMotion();
  const instant = noScroll || reduced;
  const [visibleCount, setVisibleCount] = useState(4);
  return (
    <AnimCtx.Provider value={{ instant }}>
      <div
        style={{
          width: 402,
          height: "100%",
          background: CARD_BG,
          position: "relative",
          overflow: "hidden",
          fontFamily: FONT_STACK,
        }}
      >
        <style>{`.yondr-scroll-v3::-webkit-scrollbar{display:none}`}</style>

        <div
          className="yondr-scroll-v3"
          style={{
            position: "absolute",
            inset: 0,
            overflowY: noScroll ? "hidden" : "auto",
            overflowX: "hidden",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingBottom: 24,
          }}
        >
          <Hero />
          <GalleryView
            visibleCount={visibleCount}
            onShowMore={() => setVisibleCount(11)}
          />
          <Reveal>
            <WhyMatched />
          </Reveal>
          <Reveal>
            <PriceAndReserve />
          </Reveal>
        </div>
      </div>
    </AnimCtx.Provider>
  );
}

/* --------------- HERO --------------- */

function Hero() {
  const { instant } = useContext(AnimCtx);
  return (
    <div
      style={{
        position: "relative",
        width: 402,
        height: 505,
        overflow: "hidden",
        background: "#000",
      }}
    >
      {instant ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `url(${heroImg}) center/cover no-repeat`,
          }}
        />
      ) : (
        <motion.div
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background: `url(${heroImg}) center/cover no-repeat`,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4) 13.9%, rgba(51,51,51,0) 58.07%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 66,
          width: 362,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Rise delay={0.1}>
          <TopBar />
        </Rise>
        <WipeDivider delay={0.18} duration={0.35} color="rgba(255,255,255,0.3)" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 7,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Rise delay={0.22}>
            <YMark />
          </Rise>
          <Rise delay={0.28}>
            <p style={{ margin: 0, fontFamily: FONT_STACK, fontWeight: 400, fontSize: 18, color: "#fff" }}>
              Your perfect place
            </p>
          </Rise>
          <Rise delay={0.34}>
            <p
              style={{
                margin: 0,
                fontFamily: FONT_STACK,
                fontWeight: 300,
                fontSize: 12,
                color: "#fff",
                opacity: 0.9,
              }}
            >
              Barcelona · Jun 15-22 · 2 guests
            </p>
          </Rise>
        </div>
      </div>

      {/* Pin + name + stats row — anchored together near bottom of hero */}
      <div
        style={{
          position: "absolute",
          left: 37,
          bottom: 20,
          width: 331,
          display: "flex",
          flexDirection: "column",
          gap: 30,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Rise delay={0.5}>
            <svg width={22} height={22} viewBox="0 0 22 22">
              <path d={svgPaths.p2eb3f9f0} fill={PIN} fillOpacity={0.9} />
            </svg>
          </Rise>
          <Rise delay={0.56}>
            <p
              style={{
                margin: 0,
                fontFamily: "'Besley', serif",
                fontSize: 30,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              Cozy Den
            </p>
          </Rise>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            height: 44,
            justifyContent: "space-between",
          }}
        >
          <WipeDivider delay={0.74} duration={0.4} color="rgba(255,255,255,0.2)" />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Ring label="Walk" value="91%" delay={0.85} />
            <Ring label="Food" value="91%" delay={1.0} />
            <Ring label="Activity" value="91%" delay={1.15} />
          </div>
          <WipeDivider delay={0.78} duration={0.4} color="rgba(255,255,255,0.1)" />
        </div>
      </div>
    </div>
  );
}

function Ring({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string;
  delay?: number;
}) {
  const { instant } = useContext(AnimCtx);
  const target = parseInt(value, 10) || 0;
  const pathRef = useRef<SVGPathElement | null>(null);
  const [len, setLen] = useState<number | null>(null);
  const [shown, setShown] = useState<number>(instant ? target : 0);

  useEffect(() => {
    if (pathRef.current) {
      setLen(pathRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    if (instant) return;
    const controls = animate(0, target, {
      duration: 0.9,
      ease: "easeOut",
      delay,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [instant, target, delay]);

  const restingOffset = len != null ? len * (1 - target / 100) : 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <svg width={24} height={24} viewBox="0 0 24.0039 24.0039">
        {instant || len == null ? (
          <path
            ref={pathRef}
            d={svgPaths.pb2c5d00}
            stroke={CITRON}
            strokeWidth={3.33467}
            fill="none"
            strokeDasharray={len ?? undefined}
            strokeDashoffset={instant && len != null ? restingOffset : undefined}
            strokeLinecap="round"
          />
        ) : (
          <motion.path
            d={svgPaths.pb2c5d00}
            stroke={CITRON}
            strokeWidth={3.33467}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={len}
            initial={{ strokeDashoffset: len }}
            animate={{ strokeDashoffset: restingOffset }}
            transition={{ duration: 0.9, ease: "easeOut", delay }}
          />
        )}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style={{
            fontFamily: FONT_STACK,
            fontWeight: 300,
            fontSize: 12,
            color: "#fff",
            lineHeight: 1,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: FONT_STACK,
            fontWeight: 300,
            fontSize: 12,
            color: "#fff",
            lineHeight: 1,
          }}
        >
          {shown}%
        </span>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        color: "#fff",
      }}
    >
      <div
        style={{
          fontFamily: "'Besley', serif",
          fontSize: 19.17,
          letterSpacing: "-1.15px",
        }}
      >
        <span style={{ letterSpacing: "-1.92px" }}>Y</span>
        <span>on</span>
        <span style={{ letterSpacing: "-0.48px" }}>d</span>
        <span>r</span>
      </div>
    </div>
  );
}

function YMark() {
  return (
    <div
      style={{
        width: 23,
        height: 30.307,
        border: "1.198px solid rgba(255,255,255,0.5)",
        borderRadius: 17.969,
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "31.62%",
          right: "24.11%",
          bottom: "31.64%",
          left: "24.1%",
          transform: "rotate(180deg)",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 11.912 11.1363" preserveAspectRatio="xMidYMid meet" fill="none">
          <path d={svgPaths.p1ac2f840} fill="#fff" fillOpacity={0.5} />
        </svg>
      </div>
    </div>
  );
}

/* --------------- GALLERY (from V1) --------------- */

function GalleryView({
  visibleCount,
  onShowMore,
}: {
  visibleCount: number;
  onShowMore: () => void;
}) {
  const others = LISTINGS.slice(1);
  const shown = others.slice(0, visibleCount);
  const remaining = others.length - visibleCount;

  return (
    <>
      <Rise delay={0.34} duration={0.35}>
        <div style={{ padding: "30px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontFamily: "'Besley', serif", fontSize: 16, color: "#000", lineHeight: 1.2 }}>
            More matches for you
          </p>
          <p style={{ margin: 0, fontFamily: FONT_STACK, fontWeight: 300, fontSize: 14, color: "rgba(0,0,0,0.3)", letterSpacing: 0.7 }}>
            {visibleCount} of 12
          </p>
        </div>
      </Rise>

      <div
        style={{
          padding: "18px 20px 0",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        {shown.map((l, i) => (
          <Rise key={l.id} delay={0.95 + 0.06 * i} duration={0.3}>
            <ListingCard listing={l} />
          </Rise>
        ))}
      </div>

      {visibleCount < others.length && (
        <Rise delay={0.95 + 0.06 * shown.length} duration={0.3}>
          <div style={{ padding: "18px 20px 0" }}>
            <ViewMoreButton onClick={onShowMore} remaining={remaining} />
          </div>
        </Rise>
      )}
    </>
  );
}

function Pill({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <span
      style={{
        background: bg,
        padding: "6px 8px",
        borderRadius: 74,
        fontFamily: FONT_STACK,
        fontWeight: 300,
        fontSize: 12,
        color: "#000",
        whiteSpace: "nowrap",
        lineHeight: 1.2,
      }}
    >
      {children}
    </span>
  );
}

function ListingCard({ listing }: { listing: (typeof LISTINGS)[number] }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: 160,
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
        background: `url(${listing.image}) center/cover no-repeat`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 50%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pill bg="#ddd864">{listing.match}% Match</Pill>
        <div style={{ display: "flex", alignItems: "center", gap: 3.5 }}>
          <svg width={7.94} height={7.94} viewBox="0 0 8.27612 7.87106">
            <path d={gallerySvgPaths.p157b4000} fill="#000" fillOpacity={0.6} />
          </svg>
          <span style={{ fontFamily: FONT_STACK, fontWeight: 300, fontSize: 12, color: "#000" }}>
            {listing.rating.toFixed(2)}
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 12,
          background: "#fdfaf6",
          padding: 6.77,
          borderRadius: 6.77,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          transform: hover ? "translateY(0)" : "translateY(calc(100% + 12px))",
          opacity: hover ? 1 : 0,
          transition: "transform 220ms ease-out, opacity 180ms ease-out",
          pointerEvents: hover ? "auto" : "none",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Besley', serif",
            fontSize: 13,
            color: "#000",
            lineHeight: 1.15,
          }}
        >
          {listing.name}
        </p>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <IconLabel iconPath={gallerySvgPaths.p218635f0} iconW={7.6} iconH={8.2} viewBox="0 0 7.2 8.2" label={listing.type} />
          <GuestIconLabel count={listing.guests} />
          <IconLabel iconPath={gallerySvgPaths.p1cd2000} iconW={9} iconH={9} viewBox="0 0 9.03 9.03" label={listing.price} />
        </div>
      </div>
    </div>
  );
}

function GuestIconLabel({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <svg width={10.146} height={8.086} viewBox="0 0 10.7372 8.61148">
        <g>
          <path d={gallerySvgPaths.p273ae400} fill="#000" stroke="#000" strokeWidth="0.131305" />
          <ellipse cx="7.54993" cy="1.7232" rx="1.69089" ry="1.7232" fill="#000" />
          <path d={gallerySvgPaths.pef79e90} fill="#000" stroke="#FDFAF6" strokeWidth="0.52522" />
          <ellipse cx="3.64771" cy="2.78207" rx="1.69089" ry="1.7232" fill="#000" />
        </g>
      </svg>
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 300,
          fontSize: 11,
          color: "#000",
          lineHeight: 1.2,
        }}
      >
        {count}
      </span>
    </div>
  );
}

function IconLabel({
  iconPath,
  iconW,
  iconH,
  viewBox,
  label,
}: {
  iconPath: string;
  iconW: number;
  iconH: number;
  viewBox: string;
  label: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <svg width={iconW} height={iconH} viewBox={viewBox}>
        <path d={iconPath} fill="#000" />
      </svg>
      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: 11, color: "#000", lineHeight: 1.2 }}>
        {label}
      </span>
    </div>
  );
}

function ViewMoreButton({ onClick, remaining }: { onClick: () => void; remaining: number }) {
  const [hover, setHover] = useState(false);
  const active = hover;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        background: active ? ACCENT : "transparent",
        border: `0.4px solid ${active ? ACCENT : "rgba(189,142,60,0.4)"}`,
        borderRadius: 76,
        padding: 10,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: FONT_STACK,
        fontWeight: 300,
        fontSize: 12,
        color: active ? "#fff" : "#000",
        lineHeight: 1.2,
      }}
    >
      <span>View More</span>
      <span style={{ color: active ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.3)" }}>· {remaining} Left</span>
    </button>
  );
}

/* --------------- WHY WE MATCHED YOU --------------- */

function WhyMatched() {
  return (
    <div style={{ padding: "30px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ margin: 0, fontFamily: "'Besley', serif", fontSize: 16, color: "#000" }}>
        Why we matched you
      </p>

      <WhyRow
        icon={
          <svg width={10} height={17} viewBox="0 0 9.99976 16.9999">
            <path d={svgPaths.p377a480} fill="#000" />
            <path d={svgPaths.p1697e900} fill="#000" />
            <path d={svgPaths.pb9cc900} fill="#000" />
            <path d={svgPaths.p10c8000} fill="#000" />
          </svg>
        }
        title="Walkable to your saved spots"
        sub="4 of your wishlist places within 800m"
      />
      <Divider />
      <WhyRow
        icon={
          <svg width={14.761} height={17} viewBox="0 0 14.7619 17">
            <path d={svgPaths.p3b602780} fill="#000" />
            <path d={svgPaths.p1c9efc80} fill="#000" />
            <path d={svgPaths.p167da380} fill="#000" />
          </svg>
        }
        title="Food scene fits your trips"
        sub="Matches where you ate in Lisbon & Rome"
      />
      <Divider />
      <WhyRow
        icon={
          <svg width={16} height={17} viewBox="0 0 16 17">
            <path d={svgPaths.p2bbce700} fill="#000" />
          </svg>
        }
        title="Quiet area, like your last 3 stays"
        sub="Residential street, low night noise"
      />
      <Divider />
    </div>
  );
}

function Divider() {
  return <div style={{ height: 0.5, background: "rgba(0,0,0,0.15)", width: "100%" }} />;
}

function WhyRow({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {icon}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <p
          style={{
            margin: 0,
            fontFamily: FONT_STACK,
            fontWeight: 500,
            fontSize: 12,
            color: "#000",
            lineHeight: "15.004px",
          }}
        >
          {title}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: FONT_STACK,
            fontWeight: 300,
            fontSize: 12,
            color: "#000",
            lineHeight: "15.004px",
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

/* --------------- PRICE + RESERVE --------------- */

function PriceAndReserve() {
  return (
    <div
      style={{
        padding: "30px 20px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 7, width: 160 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
          <span
            style={{
              fontFamily: "'Besley', serif",
              fontSize: 16,
              color: "#000",
              lineHeight: 1.2,
            }}
          >
            $146
          </span>
          <span
            style={{
              fontFamily: FONT_STACK,
              fontWeight: 300,
              fontSize: 12,
              color: "rgba(0,0,0,0.3)",
              letterSpacing: 0.6,
              lineHeight: 1.2,
            }}
          >
            /night
          </span>
        </div>
        <span
          style={{
            fontFamily: FONT_STACK,
            fontWeight: 300,
            fontSize: 12,
            color: "rgba(0,0,0,0.3)",
            letterSpacing: 0.6,
            lineHeight: 1.2,
          }}
        >
          $1,022 · 7 nights
        </span>
      </div>
      <ReserveButton />
    </div>
  );
}

function ReserveButton() {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const active = hover || pressed;
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        width: 103,
        padding: 10,
        borderRadius: 76.802,
        border: `0.404px solid ${active ? ACCENT : "rgba(189,142,60,0.4)"}`,
        background: active ? ACCENT : "transparent",
        color: active ? "#fff" : "#000",
        fontFamily: FONT_STACK,
        fontWeight: 300,
        fontSize: 12,
        lineHeight: 1.2,
        cursor: "pointer",
        transition: "background-color 150ms, color 150ms, border-color 150ms",
      }}
    >
      Reserve
    </button>
  );
}

