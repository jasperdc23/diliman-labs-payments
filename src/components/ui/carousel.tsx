"use client";

import { useRef, useState, type ReactNode } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import styles from "./carousel.module.css";

export type CarouselProps = {
  slides: ReactNode[];
  className?: string;
  "aria-label"?: string;
};

/**
 * Horizontally scrollable slides on native CSS scroll-snap — no JS drag or
 * swipe reimplementation. The track itself already handles touch swipe,
 * trackpad scroll and keyboard arrow scrolling for free; prev/next and the
 * dots just drive `scrollTo` and read position back off `scrollLeft`.
 */
export function Carousel({ slides, className = "", "aria-label": ariaLabel }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Simplest robust way to know which slide is "current": on every scroll
  // event, divide scrollLeft by the track width and round to the nearest
  // whole slide. An IntersectionObserver per slide would also work, but
  // needs one observer instance per slide plus a threshold to pick a
  // "winner" mid-scroll; this is one division, always agrees with what
  // scroll-snap just settled on, and needs no cleanup.
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(Math.min(Math.max(index, 0), slides.length - 1));
  };

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.min(Math.max(index, 0), slides.length - 1);
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={`${styles.root} ${className}`}>
      <div
        ref={trackRef}
        className={styles.track}
        onScroll={handleScroll}
        role="region"
        aria-label={ariaLabel ?? "Carousel"}
        tabIndex={0}
      >
        {slides.map((slide, index) => (
          <div className={styles.slide} key={index} role="group" aria-roledescription="slide">
            {slide}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navButton}
          aria-label="Previous slide"
          disabled={activeIndex === 0}
          onClick={() => scrollToIndex(activeIndex - 1)}
        >
          <CaretLeft size={16} />
        </button>

        <div className={styles.dots}>
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={styles.dot}
              data-active={index === activeIndex || undefined}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.navButton}
          aria-label="Next slide"
          disabled={activeIndex === slides.length - 1}
          onClick={() => scrollToIndex(activeIndex + 1)}
        >
          <CaretRight size={16} />
        </button>
      </div>
    </div>
  );
}
