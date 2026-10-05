import { useCallback, useEffect, useState } from "react";

export default function useSlider(length, interval = 6000) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i) => setIndex(((i % length) + length) % length), [length]);
  const next = useCallback(() => setIndex((c) => (c + 1) % length), [length]);
  const prev = useCallback(() => setIndex((c) => (c - 1 + length) % length), [length]);

  // Al cambiar de slide (a mano o solo) el temporizador se reinicia
  useEffect(() => {
    if (paused || length < 2) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [index, paused, interval, length, next]);

  return {
    index,
    next,
    prev,
    goTo,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
  };
}