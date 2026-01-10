import confetti from "canvas-confetti";

export const fireConfetti = () => {
  const defaults = {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  };

  confetti({
    ...defaults,
    spread: 100,
    particleCount: 80,
    origin: { y: 0.7 },
  });
};
