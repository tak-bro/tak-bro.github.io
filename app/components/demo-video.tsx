import { useEffect, useRef } from 'react';

/**
 * A muted screen recording that plays only while it is on screen. Under reduced
 * motion it stays on its poster until the visitor presses play.
 */
export const DemoVideo = ({
  src,
  poster,
  label,
  width,
  height,
}: {
  src: string;
  poster: string;
  label: string;
  width: number;
  height: number;
}) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // A refused autoplay leaves the poster and the controls, which is the fallback anyway.
        if (entry?.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      width={width}
      height={height}
      aria-label={label}
      muted
      loop
      playsInline
      controls
      preload="none"
      className="h-auto w-full rounded-md bg-fd-card"
    />
  );
};

/** The herdr recording for the herdr guide; each language passes its own accessible name. */
export const HerdrDemo = ({ label }: { label: string }) => (
  <DemoVideo src="/assets/video/herdr.mp4" poster="/assets/video/herdr-poster.webp" width={1440} height={860} label={label} />
);
