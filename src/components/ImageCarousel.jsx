import { useEffect, useMemo, useRef, useState } from "react";

export default function ImageCarousel({
  images = [],
  autoPlay = true,
  autoPlayMs = 6500,
}) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);

  const [index, setIndex] = useState(0);

  // Slide animation state
  const [nextIndex, setNextIndex] = useState(null); // null when idle
  const [direction, setDirection] = useState(1); // 1 => next (slide left), -1 => prev (slide right)
  const [trackX, setTrackX] = useState(0); // percent translateX
  const [transitionOn, setTransitionOn] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const isAnimating = nextIndex !== null;

  const clampIndex = (i) => {
    const n = safeImages.length;
    if (n === 0) return 0;
    if (i < 0) return n - 1;
    if (i >= n) return 0;
    return i;
  };

  const startSlideTo = (toIndex) => {
    if (!safeImages.length) return;
    if (isAnimating) return;

    const n = safeImages.length;
    const target = ((toIndex % n) + n) % n;
    if (target === index) return;

    const dir = target > index ? 1 : -1;
    setDirection(dir);
    setNextIndex(target);

    // Prepare the track position WITHOUT transition so it "snaps" to the start frame
    setTransitionOn(false);

    // Track arrangement:
    // dir=1: [current, next], start at 0 -> animate to -100
    // dir=-1: [next, current], start at -100 -> animate to 0
    setTrackX(dir === 1 ? 0 : -100);

    // Next frame: enable transition and move track to animate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionOn(true);
        setTrackX(dir === 1 ? -100 : 0);
      });
    });
  };

  const go = (delta) => {
    if (!safeImages.length) return;
    const target = clampIndex(index + delta);
    startSlideTo(target);
  };

  const goTo = (i) => startSlideTo(i);

  const onTransitionEnd = () => {
    if (nextIndex === null) return;

    // Commit the slide
    setIndex(nextIndex);

    // Reset animation state
    setNextIndex(null);
    setTransitionOn(false);
    setTrackX(0);
  };

  // Autoplay
  useEffect(() => {
    if (!autoPlay || isPaused || safeImages.length <= 1) return;
    if (isAnimating) return;

    timerRef.current = setInterval(() => {
      go(1);
    }, autoPlayMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, isPaused, autoPlayMs, safeImages.length, index, isAnimating]);

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, safeImages.length, isAnimating]);

  if (!safeImages.length) {
    return (
      <div style={styles.fallback}>
        Add images to <b>src/assets/images/</b> and update the imports.
      </div>
    );
  }

  const shownIndex = nextIndex !== null ? nextIndex : index;
  const shown = safeImages[shownIndex];

  // Build slides for animation frame
  let slides = null;
  if (!isAnimating) {
    slides = (
      <img
        src={safeImages[index].src}
        alt={safeImages[index].alt || "Meeting room photo"}
        style={styles.img}
        loading="lazy"
      />
    );
  } else {
    const current = safeImages[index];
    const next = safeImages[nextIndex];

    const leftSlide = direction === 1 ? current : next;
    const rightSlide = direction === 1 ? next : current;

    slides = (
      <div
        style={{
          ...styles.track,
          transform: `translateX(${trackX}%)`,
          transition: transitionOn ? "transform 320ms ease-in-out" : "none",
        }}
        onTransitionEnd={onTransitionEnd}
      >
        <div style={styles.slide}>
          <img
            src={leftSlide.src}
            alt={leftSlide.alt || "Meeting room photo"}
            style={styles.img}
            loading="lazy"
          />
        </div>
        <div style={styles.slide}>
          <img
            src={rightSlide.src}
            alt={rightSlide.alt || "Meeting room photo"}
            style={styles.img}
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={styles.wrap}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div style={styles.frame}>
        {/* Image / Animated track */}
        {slides}

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          style={{ ...styles.navBtn, left: 10, opacity: isAnimating ? 0.55 : 1 }}
          disabled={isAnimating}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          style={{ ...styles.navBtn, right: 10, opacity: isAnimating ? 0.55 : 1 }}
          disabled={isAnimating}
        >
          ›
        </button>

        <div style={styles.caption}>
          <div style={styles.captionTitle}>{shown.label || "Meeting Room"}</div>
          <div style={styles.captionSub}>
            {shown.note || "Swipe / click arrows to browse"}
          </div>
        </div>
      </div>

      <div style={styles.dots}>
        {safeImages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to image ${i + 1}`}
            disabled={isAnimating}
            style={{
              ...styles.dot,
              opacity: i === shownIndex ? 1 : 0.35,
              transform: i === shownIndex ? "scale(1.05)" : "scale(1)",
              cursor: isAnimating ? "not-allowed" : "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    width: "100%",
  },
  frame: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 14px 44px rgba(0,0,0,0.28)",
    aspectRatio: "16 / 9",
  },

  // Track-based slider
  track: {
    position: "absolute",
    inset: 0,
    width: "200%",
    height: "100%",
    display: "flex",
  },
  slide: {
    width: "50%",
    height: "100%",
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  navBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 42,
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.28)",
    color: "white",
    fontSize: 28,
    lineHeight: "40px",
    userSelect: "none",
    display: "grid",
    placeItems: "center",
    backdropFilter: "blur(6px)",
  },

  caption: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.28)",
    backdropFilter: "blur(8px)",
  },
  captionTitle: { fontWeight: 900, letterSpacing: "-0.2px" },
  captionSub: { marginTop: 2, opacity: 0.8, fontSize: 12 },

  dots: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.8)",
  },

  fallback: {
    borderRadius: 16,
    border: "1px dashed rgba(255,255,255,0.28)",
    padding: 16,
    color: "rgba(242,246,251,0.78)",
    background: "rgba(255,255,255,0.04)",
  },
};
