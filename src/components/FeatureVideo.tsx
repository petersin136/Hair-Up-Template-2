"use client";

import { useEffect, useRef, useState } from "react";
import { FEATURE_VIDEO_HEIGHT } from "@/lib/sections";

const VIDEO_SRC =
  "https://ydjzhldfwuqbtukenfbm.supabase.co/storage/v1/object/public/site-images/7575399-uhd_3840_2160_24fps.mp4";

const OVERLAY_ALPHA = 0.72;
const PLAYBACK_RATE = 0.5;

type Props = {
  top: number;
  src?: string;
};

export default function FeatureVideo({ top, src = VIDEO_SRC }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const applyRate = () => {
      el.playbackRate = PLAYBACK_RATE;
    };
    applyRate();
    el.addEventListener("play", applyRate);
    el.addEventListener("loadedmetadata", applyRate);
    void el.play().catch(() => {});
    return () => {
      el.removeEventListener("play", applyRate);
      el.removeEventListener("loadedmetadata", applyRate);
    };
  }, [ready]);

  return (
    <section
      className="absolute left-0 w-full overflow-hidden bg-black"
      style={{ top, height: FEATURE_VIDEO_HEIGHT }}
      aria-label="Feature video"
    >
      {ready ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      ) : null}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `rgba(0,0,0,${OVERLAY_ALPHA})` }}
      />
    </section>
  );
}
