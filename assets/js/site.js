document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("has-motion");

  const revealTargets = Array.from(
    document.querySelectorAll(".section, .quote-band-inner, .page-hero-copy")
  );

  revealTargets.forEach((node) => node.setAttribute("data-reveal", ""));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      }
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((node) => revealObserver.observe(node));

  window.setTimeout(() => {
    revealTargets.forEach((node) => node.classList.add("in-view"));
  }, 1200);

  const dots = Array.from(document.querySelectorAll(".scene-dots a"));
  const scenes = Array.from(document.querySelectorAll(".scene[id]"));

  if (dots.length && scenes.length) {
    const dotMap = new Map(
      dots.map((dot) => [dot.getAttribute("href")?.replace("#", ""), dot])
    );

    const sceneObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible || !visible.target.id) return;

        dots.forEach((dot) => dot.classList.remove("is-active"));
        const activeDot = dotMap.get(visible.target.id);
        if (activeDot) activeDot.classList.add("is-active");
      },
      { threshold: [0.3, 0.45, 0.6] }
    );

    scenes.forEach((scene) => sceneObserver.observe(scene));
  }
});
