document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("has-motion");

  const initHeroTypewriter = (prefersReducedMotion) => {
    const dynamicNode = document.querySelector(".hero-typewriter-dynamic");

    if (!(dynamicNode instanceof HTMLElement)) return;

    const words = (dynamicNode.dataset.typewriterWords ?? "")
      .split("|")
      .map((word) => word.trim())
      .filter(Boolean);

    if (!words.length) return;

    const fallbackWord = words[0];

    if (prefersReducedMotion.matches) {
      dynamicNode.textContent = fallbackWord;
      return;
    }

    const typeSpeed = 72;
    const deleteSpeed = 36;
    const wordPause = 1120;
    const startDelay = 680;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const currentWord = words[wordIndex];
      const nextLength = isDeleting ? charIndex - 1 : charIndex + 1;
      charIndex = Math.max(0, Math.min(currentWord.length, nextLength));
      dynamicNode.textContent = currentWord.slice(0, charIndex);

      let delay = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        delay = wordPause;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 320;
      }

      window.setTimeout(tick, delay);
    };

    dynamicNode.textContent = "";
    window.setTimeout(tick, startDelay);
  };

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

  const upgradeClickCards = () => {
    const cardCandidates = Array.from(
      document.querySelectorAll(".link-card, .link-summary-card")
    );

    cardCandidates.forEach((card) => {
      if (card.dataset.clickCardReady === "true") return;

      const links = Array.from(card.querySelectorAll("a[href]"));
      if (!links.length) return;

      const hrefs = Array.from(
        new Set(
          links
            .map((link) => link.getAttribute("href"))
            .filter((href) => typeof href === "string" && href.length > 0)
        )
      );

      if (hrefs.length !== 1) return;

      const primaryLink = links[0];
      if (!(primaryLink instanceof HTMLAnchorElement)) return;

      card.dataset.clickCardReady = "true";
      card.classList.add("is-click-card");
      card.tabIndex = 0;
      card.setAttribute("role", "link");

      const labelSource = card.querySelector("h3, strong") ?? primaryLink;
      const label = labelSource?.textContent?.trim();
      if (label) {
        card.setAttribute("aria-label", label);
      }

      const activateCard = () => {
        primaryLink.click();
      };

      card.addEventListener("click", (event) => {
        if (event.target instanceof Element) {
          if (event.target.closest("a, button, summary, input, select, textarea, label")) {
            return;
          }
        }

        activateCard();
      });

      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        activateCard();
      });
    });
  };

  upgradeClickCards();

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");

  initHeroTypewriter(prefersReducedMotion);

  if (prefersReducedMotion.matches || !finePointer.matches) {
    return;
  }

  const trailRoot = document.createElement("div");
  trailRoot.className = "cursor-trail";
  trailRoot.setAttribute("aria-hidden", "true");

  const lead = document.createElement("span");
  lead.className = "cursor-trail-lead";
  trailRoot.appendChild(lead);

  const nodes = Array.from({ length: 7 }, (_, index) => {
    const node = document.createElement("span");
    node.className = "cursor-trail-node";
    node.style.setProperty("--trail-index", String(index));
    trailRoot.appendChild(node);
    return node;
  });

  document.body.appendChild(trailRoot);
  document.body.classList.add("has-cursor-trail");

  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.5,
    visible: false,
    lastMoveAt: 0,
  };

  const chain = Array.from({ length: nodes.length }, () => ({
    x: pointer.x,
    y: pointer.y,
  }));

  const interactiveSelector =
    "a, button, summary, .button, .mini-cta, .is-click-card";

  const setHoverState = (isHovering) => {
    trailRoot.classList.toggle("is-hovering", isHovering);
  };

  const updatePointer = (event) => {
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    pointer.lastMoveAt = performance.now();
    pointer.visible = true;
    trailRoot.classList.add("is-visible");
  };

  document.addEventListener("pointermove", updatePointer, { passive: true });
  const hideTrail = () => {
    pointer.visible = false;
    setHoverState(false);
  };

  document.addEventListener("mouseleave", hideTrail);
  window.addEventListener("blur", hideTrail);
  document.addEventListener("pointerdown", () => trailRoot.classList.add("is-pressed"));
  document.addEventListener("pointerup", () => trailRoot.classList.remove("is-pressed"));
  document.addEventListener("pointercancel", () => trailRoot.classList.remove("is-pressed"));

  document.addEventListener(
    "pointerover",
    (event) => {
      setHoverState(Boolean(event.target.closest(interactiveSelector)));
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerout",
    (event) => {
      if (event.relatedTarget instanceof Element) {
        setHoverState(Boolean(event.relatedTarget.closest(interactiveSelector)));
      } else {
        setHoverState(false);
      }
    },
    { passive: true }
  );

  const animateTrail = () => {
    const now = performance.now();
    const idleFor = now - pointer.lastMoveAt;
    const shouldShow = pointer.visible && idleFor < 140;

    pointer.x += (pointer.targetX - pointer.x) * 0.24;
    pointer.y += (pointer.targetY - pointer.y) * 0.24;

    const pressScale = trailRoot.classList.contains("is-pressed") ? 0.84 : 1;

    lead.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) scale(${pressScale})`;
    lead.style.opacity = shouldShow ? "1" : "0";

    let anchorX = pointer.x;
    let anchorY = pointer.y;

    nodes.forEach((node, index) => {
      const segment = chain[index];
      segment.x += (anchorX - segment.x) * 0.32;
      segment.y += (anchorY - segment.y) * 0.32;

      anchorX = segment.x;
      anchorY = segment.y;

      const progress = 1 - index / nodes.length;
      const scale = 0.42 + progress * 0.58;
      const opacity = shouldShow ? 0.06 + progress * 0.22 : 0;

      node.style.transform = `translate3d(${segment.x}px, ${segment.y}px, 0) scale(${scale})`;
      node.style.opacity = opacity.toFixed(3);
    });

    trailRoot.classList.toggle("is-visible", shouldShow);
    requestAnimationFrame(animateTrail);
  };

  requestAnimationFrame(animateTrail);
});
