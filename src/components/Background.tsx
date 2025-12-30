import { memo, useEffect, useRef } from "react";
import styles from "./Background.module.css";

function Background() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Enforce autoplay requirements
    v.muted = true;
    v.playsInline = true;
    v.loop = true;

    const tryPlay = async () => {
      try {
        if (v.paused) await v.play();
      } catch {
        // ignore autoplay policy failures
      }
    };

    const restart = async () => {
      try {
        v.currentTime = 0;
      } catch {
        // ignore
      }
      await tryPlay();
    };

    // Start playback immediately
    tryPlay();

    // If loop fails in some webviews, force restart at end
    const onEnded = () => {
      restart();
    };

    // If paused by the environment, resume
    const onPause = () => {
      tryPlay();
    };

    // Resume on tab visibility
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    // Resume after any interaction (helps webviews)
    const onInteraction = () => {
      tryPlay();
    };

    v.addEventListener("ended", onEnded);
    v.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("click", onInteraction);
    window.addEventListener("touchstart", onInteraction);
    window.addEventListener("keydown", onInteraction);

    return () => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("click", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("keydown", onInteraction);
    };
  }, []);

  return (
    <div className={styles.bg} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.bgVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/bg-loop.mp4" type="video/mp4" />
      </video>
      <div className={styles.bgOverlay} />
    </div>
  );
}

export default memo(Background);
