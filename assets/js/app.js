document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("page-web-app")) {
    return;
  }

  const STORAGE_KEY = "sleepai-webapp-state-v2";

  const HERO_VARIANTS = {
    flow: {
      kicker: "Ambient Sound",
      title: "Keep the day softer while the screen stays on.",
      description:
        "Start a steady sound bed for work and study, or step into a short calm session when your pace gets too bright.",
    },
    reset: {
      kicker: "Quick Calm",
      title: "Take the edge off without leaving the browser.",
      description:
        "Press play, lower the noise, and move through a short reset when the room feels too sharp.",
    },
  };

  const CTA_VARIANTS = {
    listen: {
      primary: "Start listening",
      secondary: "Try a 3-minute reset",
      secondaryHref: "index.html?mode=reset&session=reset-arrival-breath",
    },
    reset: {
      primary: "Try a 3-minute reset",
      secondary: "Start listening",
      secondaryHref: "#app-library",
    },
  };

  const MODE_COPY = {
    ambient: {
      title: "Focus, read, work.",
      description: "Low-distraction sound for the desk.",
    },
    reset: {
      title: "3, 10, and 20 minute calm.",
      description: "Short guided sessions when you need less noise.",
    },
    winddown: {
      title: "A softer night, when you want it.",
      description: "Evening sessions kept here as a quieter third lane.",
    },
  };

  const TRACKS = [
    {
      id: "ambient-rain-code-window",
      mode: "ambient",
      title: "Rain Code Window",
      subtitle: "Low, warm, and steady.",
      durationLabel: "45 min",
      access: "free",
      description: "A soft bed of sound for work, reading, and long quiet stretches.",
      caption: "Let the room settle behind you.",
      featured: "A low, warm sound bed for reading, work, and quiet focus.",
      engine: { baseHz: 78, harmonicHz: 156, filterHz: 540, color: "brown", wobbleHz: 0.06 },
    },
    {
      id: "ambient-deep-focus-canopy",
      mode: "ambient",
      title: "Deep Focus Canopy",
      subtitle: "Lower and more immersive.",
      durationLabel: "60 min",
      access: "pro",
      description: "A heavier focus bed for work that needs more depth.",
      caption: "Narrow the room and stay with one thing.",
      featured: "A deeper sound bed for heavier focus blocks.",
      engine: { baseHz: 72, harmonicHz: 144, filterHz: 460, color: "brown", wobbleHz: 0.04 },
    },
    {
      id: "ambient-quiet-cafe-drift",
      mode: "ambient",
      title: "Quiet Cafe Drift",
      subtitle: "Gentle motion, no crowd.",
      durationLabel: "40 min",
      access: "free",
      description: "A calmer alternative to cafe noise when you want soft presence.",
      caption: "Keep a little movement in the air, not in your head.",
      featured: "Soft movement for browsing, writing, and light focus.",
      engine: { baseHz: 92, harmonicHz: 184, filterHz: 760, color: "pink", wobbleHz: 0.08 },
    },
    {
      id: "ambient-night-train-writing",
      mode: "ambient",
      title: "Night Train Writing",
      subtitle: "Slow rhythm for longer lines.",
      durationLabel: "50 min",
      access: "pro",
      description: "A patient background for writing without rush.",
      caption: "Let the pace stay low and even.",
      featured: "Slow rhythm for writing and late desk hours.",
      engine: { baseHz: 68, harmonicHz: 136, filterHz: 610, color: "brown", wobbleHz: 0.05 },
    },
    {
      id: "ambient-soft-orbit-reading",
      mode: "ambient",
      title: "Soft Orbit Reading",
      subtitle: "Light and airy.",
      durationLabel: "30 min",
      access: "pro",
      description: "A brighter tone for reading, review, and quiet thinking.",
      caption: "Read at an easier pace than usual.",
      featured: "A lighter tone for reading and study review.",
      engine: { baseHz: 110, harmonicHz: 220, filterHz: 940, color: "pink", wobbleHz: 0.09 },
    },
    {
      id: "reset-arrival-breath",
      mode: "reset",
      title: "Arrival Breath",
      subtitle: "For mental spillover.",
      durationLabel: "3 min",
      access: "free",
      description: "A short reset for the moment you need the room to feel less sharp.",
      caption: "Slow the exhale and let the pace drop.",
      featured: "A short reset when your thoughts are louder than the room.",
      runtimeMs: 55000,
      steps: [
        { atMs: 0, text: "Pause where you are." },
        { atMs: 10000, text: "Let the inhale arrive naturally." },
        { atMs: 22000, text: "Make the exhale a little longer." },
        { atMs: 38000, text: "Loosen the jaw and shoulders." },
        { atMs: 50000, text: "Return with less pressure than before." },
      ],
      engine: { baseHz: 120, harmonicHz: 240, filterHz: 880, color: "pink", wobbleHz: 0.1 },
    },
    {
      id: "reset-tab-fatigue",
      mode: "reset",
      title: "Tab Fatigue Reset",
      subtitle: "When everything feels equally urgent.",
      durationLabel: "10 min",
      access: "free",
      description: "A calmer reset for overstimulation and mental clutter.",
      caption: "Bring the body back before the next task.",
      featured: "A short calm session for overstimulation and mental clutter.",
      runtimeMs: 75000,
      steps: [
        { atMs: 0, text: "Stop switching tasks for a moment." },
        { atMs: 14000, text: "Breathe in for four and out for six." },
        { atMs: 30000, text: "Stay with one point of contact." },
        { atMs: 52000, text: "Not everything needs to move right now." },
        { atMs: 68000, text: "Come back slowly." },
      ],
      engine: { baseHz: 98, harmonicHz: 196, filterHz: 720, color: "pink", wobbleHz: 0.08 },
    },
    {
      id: "reset-478-evening",
      mode: "reset",
      title: "4-7-8 Evening",
      subtitle: "A slower breathing lane.",
      durationLabel: "20 min",
      access: "pro",
      description: "A paced breathing session for a slower descent into evening.",
      caption: "Stay gentle with the count.",
      featured: "A slower breathing lane for late afternoon and evening.",
      runtimeMs: 90000,
      steps: [
        { atMs: 0, text: "Release the pace of the last hour." },
        { atMs: 16000, text: "Inhale for four." },
        { atMs: 40000, text: "Hold for seven, then exhale for eight." },
        { atMs: 66000, text: "Keep the count easy, not forced." },
        { atMs: 84000, text: "Let the breath continue on its own." },
      ],
      engine: { baseHz: 84, harmonicHz: 168, filterHz: 640, color: "brown", wobbleHz: 0.06 },
    },
    {
      id: "reset-gaming-cooldown",
      mode: "reset",
      title: "Gaming Cooldown",
      subtitle: "For the comedown after stimulation.",
      durationLabel: "10 min",
      access: "pro",
      description: "A short calm session after play, streaming, or heavy sensory input.",
      caption: "Let the body understand that the intensity is over.",
      featured: "A short comedown after play and stimulation.",
      runtimeMs: 70000,
      steps: [
        { atMs: 0, text: "The stimulus has ended." },
        { atMs: 15000, text: "Slow the breath." },
        { atMs: 34000, text: "Find one steady sound in the room." },
        { atMs: 52000, text: "Tell your body it can stand down." },
        { atMs: 65000, text: "Return slowly." },
      ],
      engine: { baseHz: 102, harmonicHz: 204, filterHz: 760, color: "pink", wobbleHz: 0.07 },
    },
    {
      id: "winddown-overthinking",
      mode: "winddown",
      title: "Overthinking",
      subtitle: "For a bright mind at night.",
      durationLabel: "20 min",
      access: "free",
      description: "A slower evening session for nights when thoughts keep circling.",
      caption: "The day can stop here for a while.",
      featured: "A soft wind-down for a mind that keeps going.",
      runtimeMs: 95000,
      steps: [
        { atMs: 0, text: "The day is over for now." },
        { atMs: 18000, text: "Let the exhale lengthen." },
        { atMs: 42000, text: "Put the next thought down until tomorrow." },
        { atMs: 69000, text: "You do not need to check whether this is working." },
        { atMs: 90000, text: "Stay here a little longer." },
      ],
      engine: { baseHz: 76, harmonicHz: 152, filterHz: 480, color: "brown", wobbleHz: 0.05 },
    },
    {
      id: "winddown-body-heavy",
      mode: "winddown",
      title: "Body Heavy, Mind Awake",
      subtitle: "For tired but alert nights.",
      durationLabel: "20 min",
      access: "pro",
      description: "A body-first evening session when you need a slower landing.",
      caption: "Let the bed do more of the work.",
      featured: "A body-first wind-down for tired but alert nights.",
      runtimeMs: 95000,
      steps: [
        { atMs: 0, text: "You do not need to push sleep." },
        { atMs: 20000, text: "Exhale longer than you inhale." },
        { atMs: 46000, text: "Let the shoulders and legs get heavier." },
        { atMs: 72000, text: "Rest is already happening." },
        { atMs: 90000, text: "Let the room become less important." },
      ],
      engine: { baseHz: 70, harmonicHz: 140, filterHz: 430, color: "brown", wobbleHz: 0.04 },
    },
    {
      id: "winddown-sleep-anxiety",
      mode: "winddown",
      title: "Sleep Anxiety Ease",
      subtitle: "For nights with too much pressure.",
      durationLabel: "20 min",
      access: "pro",
      description: "A calmer evening session when the pressure to sleep gets in the way.",
      caption: "Rest still counts, even before sleep arrives.",
      featured: "A softer night when sleep itself feels pressured.",
      runtimeMs: 95000,
      steps: [
        { atMs: 0, text: "You do not need to prove sleep tonight." },
        { atMs: 18000, text: "Breathe in for four and out for six." },
        { atMs: 43000, text: "Answer the pressure with: it is okay." },
        { atMs: 70000, text: "Drop the urge to monitor yourself." },
        { atMs: 90000, text: "Let the breath continue on its own." },
      ],
      engine: { baseHz: 82, harmonicHz: 164, filterHz: 560, color: "brown", wobbleHz: 0.05 },
    },
    {
      id: "winddown-emotional-afterglow",
      mode: "winddown",
      title: "Emotional Afterglow",
      subtitle: "For feelings that still feel active.",
      durationLabel: "20 min",
      access: "free",
      description: "A warmer evening session for nights that still feel emotionally bright.",
      caption: "Nothing inside you has to disappear before rest can begin.",
      featured: "A warmer evening session for an active emotional night.",
      runtimeMs: 95000,
      steps: [
        { atMs: 0, text: "Nothing inside you has to disappear." },
        { atMs: 21000, text: "Let the breath move around the feeling." },
        { atMs: 45000, text: "Name it softly, then let it quiet down." },
        { atMs: 71000, text: "Let the body stay supported." },
        { atMs: 90000, text: "The room can hold the rest of this night." },
      ],
      engine: { baseHz: 88, harmonicHz: 176, filterHz: 620, color: "pink", wobbleHz: 0.06 },
    },
  ];

  const toast = document.createElement("div");
  toast.className = "app-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);

  let toastTimer = 0;
  let audioContext = null;
  let activeEngine = null;
  let activePlayback = null;
  let progressInterval = 0;
  let scheduledTimeouts = [];
  let activeTrackId = "";
  let activeMode = "ambient";

  const heroKicker = document.getElementById("hero-kicker");
  const heroTitle = document.getElementById("hero-title");
  const heroDescription = document.getElementById("hero-description");
  const heroPrimary = document.querySelector(".js-hero-primary");
  const heroSecondary = document.querySelector(".js-hero-secondary");
  const liveTrackTitle = document.getElementById("live-track-title");
  const liveTrackSubtitle = document.getElementById("live-track-subtitle");
  const liveTrackMode = document.getElementById("live-track-mode");
  const liveTrackAccess = document.getElementById("live-track-access");
  const modeTabs = Array.from(document.querySelectorAll("[data-mode-tab]"));
  const libraryTitle = document.getElementById("library-title");
  const libraryDescription = document.getElementById("library-description");
  const trackGrid = document.getElementById("track-grid");
  const playerModeLabel = document.getElementById("player-mode-label");
  const playerTitle = document.getElementById("player-title");
  const playerAccessPill = document.getElementById("player-access-pill");
  const playerDescription = document.getElementById("player-description");
  const playerDuration = document.getElementById("player-duration");
  const playerProgressFill = document.getElementById("player-progress-fill");
  const playerCaption = document.getElementById("player-caption");
  const playerStatusBanner = document.getElementById("player-status-banner");
  const playToggle = document.getElementById("play-toggle");
  const favoriteToggle = document.getElementById("favorite-toggle");
  const stopSessionButton = document.getElementById("stop-session");
  const completeSessionButton = document.getElementById("complete-session");
  const emailForm = document.getElementById("email-form");
  const emailInput = document.getElementById("email-input");
  const accountStatusText = document.getElementById("account-status-text");
  const rewardNote = document.getElementById("reward-note");
  const rewardClaim = document.getElementById("reward-claim");

  const createDefaultState = () => ({
    email: "",
    favorites: [],
    completedCount: 0,
    sessionDays: [],
    claimedRewards: {
      three_sessions: false,
      five_day_streak: false,
    },
    entitlement: {
      plan: "free",
      source: "visitor",
      expiresAt: null,
    },
    experiments: {
      hero: Math.random() > 0.5 ? "flow" : "reset",
      cta: Math.random() > 0.5 ? "listen" : "reset",
    },
    eventLog: [],
  });

  const loadState = () => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
      if (!parsed || typeof parsed !== "object") {
        return createDefaultState();
      }

      return {
        ...createDefaultState(),
        ...parsed,
        claimedRewards: {
          ...createDefaultState().claimedRewards,
          ...(parsed.claimedRewards || {}),
        },
        entitlement: {
          ...createDefaultState().entitlement,
          ...(parsed.entitlement || {}),
        },
        experiments: {
          ...createDefaultState().experiments,
          ...(parsed.experiments || {}),
        },
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
        sessionDays: Array.isArray(parsed.sessionDays) ? parsed.sessionDays : [],
        eventLog: Array.isArray(parsed.eventLog) ? parsed.eventLog : [],
      };
    } catch (error) {
      return createDefaultState();
    }
  };

  let state = loadState();

  const saveState = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const trackEvent = (name, payload = {}) => {
    const eventPayload = {
      event: name,
      timestamp: new Date().toISOString(),
      ...payload,
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventPayload);
    state.eventLog = [eventPayload, ...state.eventLog].slice(0, 10);
    saveState();
  };

  const getTrackById = (trackId) => TRACKS.find((track) => track.id === trackId) || null;

  const getLocalDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const pruneExpiredEntitlement = () => {
    if (!state.entitlement.expiresAt) return;
    if (Date.now() < state.entitlement.expiresAt) return;

    state.entitlement = {
      plan: "free",
      source: "expired",
      expiresAt: null,
    };
    saveState();
  };

  const hasProAccess = () => {
    pruneExpiredEntitlement();
    return state.entitlement.plan !== "free";
  };

  const getStreak = () => {
    const uniqueDays = Array.from(new Set(state.sessionDays)).sort((a, b) => (a < b ? 1 : -1));
    if (!uniqueDays.length) return 0;

    let streak = 0;
    let cursor = new Date();

    for (const day of uniqueDays) {
      const cursorKey = getLocalDateKey(cursor);
      if (day !== cursorKey) {
        if (streak === 0) {
          const yesterday = new Date(cursor);
          yesterday.setDate(yesterday.getDate() - 1);
          if (day !== getLocalDateKey(yesterday)) {
            break;
          }
          cursor = yesterday;
        } else {
          break;
        }
      }

      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  };

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  };

  const ensureAudioContext = () => {
    if (!audioContext) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) {
        return null;
      }
      audioContext = new Context();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    return audioContext;
  };

  const createNoiseBuffer = (ctx, color = "pink") => {
    const bufferSize = Math.max(1, ctx.sampleRate * 2);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastBrown = 0;

    for (let index = 0; index < bufferSize; index += 1) {
      const white = Math.random() * 2 - 1;
      if (color === "brown") {
        lastBrown = (lastBrown + 0.02 * white) / 1.02;
        output[index] = lastBrown * 3.5;
      } else {
        output[index] = white * 0.6 + (index > 0 ? output[index - 1] * 0.18 : 0);
      }
    }

    return buffer;
  };

  const createAmbientEngine = (ctx, config) => {
    const master = ctx.createGain();
    master.gain.value = 0.0001;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = config.filterHz;
    filter.Q.value = 0.4;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.11;

    const source = ctx.createBufferSource();
    source.buffer = createNoiseBuffer(ctx, config.color);
    source.loop = true;

    const oscA = ctx.createOscillator();
    oscA.type = "sine";
    oscA.frequency.value = config.baseHz;

    const oscB = ctx.createOscillator();
    oscB.type = "triangle";
    oscB.frequency.value = config.harmonicHz;

    const oscGainA = ctx.createGain();
    oscGainA.gain.value = 0.025;

    const oscGainB = ctx.createGain();
    oscGainB.gain.value = 0.014;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = config.wobbleHz;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.012;

    source.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(master);
    oscA.connect(oscGainA);
    oscGainA.connect(master);
    oscB.connect(oscGainB);
    oscGainB.connect(master);
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    master.connect(ctx.destination);

    return {
      start() {
        source.start();
        oscA.start();
        oscB.start();
        lfo.start();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 1.1);
      },
      stop() {
        const stopAt = ctx.currentTime + 0.45;
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.0001, stopAt);
        window.setTimeout(() => {
          try {
            source.stop();
            oscA.stop();
            oscB.stop();
            lfo.stop();
          } catch (error) {
            return;
          }
        }, 600);
      },
    };
  };

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const maybeSpeak = (text) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 0.96;
    utterance.volume = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const setCaption = (text) => {
    playerCaption.textContent = text;
  };

  const stopPlayback = (reason = "manual_stop") => {
    if (activeEngine) {
      activeEngine.stop();
      activeEngine = null;
    }

    stopSpeech();
    scheduledTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    scheduledTimeouts = [];
    window.clearInterval(progressInterval);
    progressInterval = 0;
    activePlayback = null;
    playerProgressFill.style.width = "0%";
    playToggle.textContent = "Play";

    if (reason === "manual_stop") {
      trackEvent("session_stopped", { trackId: activeTrackId || null });
    }
  };

  const renderHero = () => {
    const heroVariant = HERO_VARIANTS[state.experiments.hero];
    const ctaVariant = CTA_VARIANTS[state.experiments.cta];

    heroKicker.textContent = heroVariant.kicker;
    heroTitle.textContent = heroVariant.title;
    heroDescription.textContent = heroVariant.description;
    heroPrimary.textContent = ctaVariant.primary;
    heroSecondary.textContent = ctaVariant.secondary;
    heroSecondary.setAttribute("href", ctaVariant.secondaryHref);
  };

  const renderFeatured = (track) => {
    const shownTrack = track || getTrackById(activeTrackId) || TRACKS[0];
    const locked = shownTrack.access === "pro" && !hasProAccess();

    liveTrackTitle.textContent = shownTrack.title;
    liveTrackSubtitle.textContent = shownTrack.featured || shownTrack.description;
    liveTrackMode.textContent =
      shownTrack.mode === "ambient"
        ? "Ambient"
        : shownTrack.mode === "reset"
        ? "Reset"
        : "Wind-down";
    liveTrackAccess.textContent = locked ? "Pro" : shownTrack.access === "pro" ? "Pro" : "Free";
  };

  const renderTrackGrid = () => {
    const modeTracks = TRACKS.filter((track) => track.mode === activeMode);
    const modeCopy = MODE_COPY[activeMode];

    libraryTitle.textContent = modeCopy.title;
    libraryDescription.textContent = modeCopy.description;

    trackGrid.innerHTML = modeTracks
      .map((track) => {
        const isSelected = track.id === activeTrackId;
        const locked = track.access === "pro" && !hasProAccess();

        return `
          <article class="app-track-card ${isSelected ? "is-selected" : ""}" data-track-id="${track.id}">
            <div class="app-track-card-top">
              <div>
                <h3>${track.title}</h3>
                <p>${track.subtitle}</p>
              </div>
              <span class="app-track-badge ${track.access === "pro" ? "is-pro" : "is-free"}">${locked ? "Pro" : track.access === "pro" ? "Pro" : "Free"}</span>
            </div>
            <div class="app-track-card-bottom">
              <span class="app-track-duration">${track.durationLabel}</span>
            </div>
          </article>
        `;
      })
      .join("");
  };

  const renderPlayer = () => {
    const track = getTrackById(activeTrackId);
    if (!track) {
      playerModeLabel.textContent = "Ambient";
      playerTitle.textContent = "Choose a session";
      playerDescription.textContent = "A steady layer of sound for work, reading, and quiet focus.";
      playerDuration.textContent = "Duration: --";
      playerAccessPill.textContent = "Free";
      playerAccessPill.classList.remove("is-pro");
      favoriteToggle.textContent = "Save";
      setCaption("Press play to begin.");
      playerStatusBanner.innerHTML = "<strong>Free listening</strong><span>Some sessions open with Pro.</span>";
      return;
    }

    const locked = track.access === "pro" && !hasProAccess();
    const accessLabel = locked ? "Pro" : track.access === "pro" ? "Pro" : "Free";

    playerModeLabel.textContent =
      activeMode === "ambient"
        ? "Ambient"
        : activeMode === "reset"
        ? "Reset"
        : "Wind-down";
    playerTitle.textContent = track.title;
    playerDescription.textContent = track.description;
    playerDuration.textContent = `Duration: ${track.durationLabel}`;
    playerAccessPill.textContent = accessLabel;
    playerAccessPill.classList.toggle("is-pro", accessLabel === "Pro");
    favoriteToggle.textContent = state.favorites.includes(track.id) ? "Saved" : "Save";
    setCaption(track.caption);

    playerStatusBanner.innerHTML = hasProAccess()
      ? "<strong>Pro open</strong><span>Everything in this library is ready to play.</span>"
      : locked
      ? "<strong>Free listening</strong><span>This session opens with Pro.</span>"
      : "<strong>Free listening</strong><span>More sessions open with Pro.</span>";
  };

  const renderUnlockArea = () => {
    const statusLabel = hasProAccess()
      ? state.entitlement.plan === "yearly"
        ? "Pro yearly"
        : state.entitlement.plan === "monthly"
        ? "Pro monthly"
        : "Pro"
      : state.email
      ? "Saved"
      : "Free";

    accountStatusText.textContent = statusLabel;

    const threeEligible = state.completedCount >= 3 && !state.claimedRewards.three_sessions;
    const fiveEligible = getStreak() >= 5 && !state.claimedRewards.five_day_streak;

    if (fiveEligible) {
      rewardNote.textContent = "Your 7-day mobile unlock is ready.";
      rewardClaim.textContent = "Claim reward";
      rewardClaim.dataset.reward = "five_day_streak";
      rewardClaim.classList.remove("is-hidden");
      return;
    }

    if (threeEligible) {
      rewardNote.textContent = "Your 3-day Pro pass is ready.";
      rewardClaim.textContent = "Claim reward";
      rewardClaim.dataset.reward = "three_sessions";
      rewardClaim.classList.remove("is-hidden");
      return;
    }

    if (!state.claimedRewards.three_sessions) {
      const remaining = Math.max(0, 3 - state.completedCount);
      rewardNote.textContent =
        remaining === 0
          ? "Your 3-day Pro pass is ready."
          : `Finish ${remaining} more ${remaining === 1 ? "session" : "sessions"} to unlock 3 days of Pro.`;
      rewardClaim.classList.add("is-hidden");
      rewardClaim.dataset.reward = "";
      return;
    }

    if (!state.claimedRewards.five_day_streak) {
      const remaining = Math.max(0, 5 - getStreak());
      rewardNote.textContent =
        remaining === 0
          ? "Your 7-day mobile unlock is ready."
          : `${remaining} more ${remaining === 1 ? "day" : "days"} in a row to unlock 7 mobile nights.`;
      rewardClaim.classList.add("is-hidden");
      rewardClaim.dataset.reward = "";
      return;
    }

    rewardNote.textContent = "Keep listening. New access and mobile rewards build with use.";
    rewardClaim.classList.add("is-hidden");
    rewardClaim.dataset.reward = "";
  };

  const renderAll = () => {
    renderHero();
    renderTrackGrid();
    renderPlayer();
    renderFeatured();
    renderUnlockArea();
  };

  const selectMode = (mode, shouldTrack = true) => {
    activeMode = mode;
    modeTabs.forEach((tab) => {
      const isActive = tab.dataset.modeTab === mode;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    const firstTrack = TRACKS.find((track) => track.mode === mode);
    if (firstTrack) {
      activeTrackId = firstTrack.id;
    }

    renderTrackGrid();
    renderPlayer();
    renderFeatured();

    if (shouldTrack) {
      trackEvent("library_mode_switched", { mode });
    }
  };

  const selectTrack = (trackId, shouldTrack = true) => {
    const track = getTrackById(trackId);
    if (!track) return;

    activeTrackId = track.id;
    activeMode = track.mode;

    modeTabs.forEach((tab) => {
      const isActive = tab.dataset.modeTab === activeMode;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    renderTrackGrid();
    renderPlayer();
    renderFeatured(track);

    if (shouldTrack) {
      trackEvent("session_selected", { trackId: track.id, mode: track.mode, access: track.access });
    }
  };

  const startPlayback = () => {
    const track = getTrackById(activeTrackId);
    if (!track) {
      showToast("Choose a session first.");
      return;
    }

    const ctx = ensureAudioContext();
    if (!ctx) {
      showToast("Audio is not available in this browser.");
      return;
    }

    stopPlayback("switch_track");

    const previewMode = track.access === "pro" && !hasProAccess();
    activeEngine = createAmbientEngine(ctx, track.engine);
    activeEngine.start();

    activePlayback = {
      trackId: track.id,
      startedAt: Date.now(),
      previewMode,
      completed: false,
    };

    playToggle.textContent = "Pause";
    setCaption(track.caption);
    trackEvent("play_started", {
      trackId: track.id,
      mode: track.mode,
      access: previewMode ? "preview" : track.access,
    });

    if (track.steps) {
      track.steps.forEach((step) => {
        const timeoutId = window.setTimeout(() => {
          setCaption(step.text);
          maybeSpeak(step.text);
        }, step.atMs);
        scheduledTimeouts.push(timeoutId);
      });
    }

    const runtimeMs = track.runtimeMs || 0;
    if (runtimeMs > 0) {
      progressInterval = window.setInterval(() => {
        if (!activePlayback) return;
        const elapsed = Date.now() - activePlayback.startedAt;
        const progress = Math.min(100, (elapsed / runtimeMs) * 100);
        playerProgressFill.style.width = `${progress}%`;
      }, 200);

      const finishTimeout = window.setTimeout(() => {
        if (!activePlayback) return;

        if (previewMode) {
          stopPlayback("preview_end");
          setCaption("Open Pro to keep this one playing.");
          playerStatusBanner.innerHTML = "<strong>Free listening</strong><span>Open Pro to play this session.</span>";
          trackEvent("preview_capped", { trackId: track.id, mode: track.mode });
          showToast("Open Pro to keep this session playing.");
          return;
        }

        completeSession("auto");
      }, runtimeMs);

      scheduledTimeouts.push(finishTimeout);
    } else {
      playerProgressFill.style.width = "100%";
    }
  };

  const completeSession = (source = "manual") => {
    const track = getTrackById(activeTrackId);
    if (!track || !activePlayback || activePlayback.completed) {
      showToast("Start a session first.");
      return;
    }

    activePlayback.completed = true;
    state.completedCount += 1;
    state.sessionDays = Array.from(new Set([getLocalDateKey(), ...state.sessionDays])).slice(0, 30);
    saveState();

    trackEvent("session_completed", {
      trackId: track.id,
      mode: track.mode,
      source,
      completedCount: state.completedCount,
      streak: getStreak(),
    });

    stopPlayback("completed");
    renderUnlockArea();
    showToast("Session saved.");
  };

  const toggleFavorite = () => {
    const track = getTrackById(activeTrackId);
    if (!track) {
      showToast("Choose a session first.");
      return;
    }

    if (state.favorites.includes(track.id)) {
      state.favorites = state.favorites.filter((id) => id !== track.id);
      trackEvent("favorite_removed", { trackId: track.id });
      showToast("Removed from saved.");
    } else {
      state.favorites = [track.id, ...state.favorites].slice(0, 12);
      trackEvent("favorite_added", { trackId: track.id });
      showToast("Saved.");
    }

    saveState();
    renderPlayer();
  };

  const claimReward = (rewardKey) => {
    if (rewardKey === "three_sessions" && state.completedCount >= 3 && !state.claimedRewards.three_sessions) {
      state.claimedRewards.three_sessions = true;
      state.entitlement = {
        plan: "reward-pass",
        source: "three_sessions",
        expiresAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
      };
      saveState();
      trackEvent("reward_claimed", { reward: rewardKey });
      renderAll();
      showToast("3 days of Pro unlocked.");
      return;
    }

    if (rewardKey === "five_day_streak" && getStreak() >= 5 && !state.claimedRewards.five_day_streak) {
      state.claimedRewards.five_day_streak = true;
      saveState();
      trackEvent("reward_claimed", { reward: rewardKey });
      renderUnlockArea();
      showToast("7 mobile nights unlocked.");
    }
  };

  const handleQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const requestedMode = params.get("mode");
    const requestedSession = params.get("session");
    const ctaSource = params.get("cta");

    if (requestedMode && MODE_COPY[requestedMode]) {
      activeMode = requestedMode;
    }

    const requestedTrack = requestedSession ? getTrackById(requestedSession) : null;
    if (requestedTrack) {
      activeTrackId = requestedTrack.id;
      activeMode = requestedTrack.mode;
    } else {
      const firstTrack = TRACKS.find((track) => track.mode === activeMode) || TRACKS[0];
      activeTrackId = firstTrack.id;
      activeMode = firstTrack.mode;
    }

    if (ctaSource) {
      trackEvent("landing_source", { cta: ctaSource });
    }
  };

  modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      selectMode(tab.dataset.modeTab);
    });
  });

  trackGrid.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const card = target.closest("[data-track-id]");
    if (!(card instanceof HTMLElement)) return;
    selectTrack(card.dataset.trackId);
  });

  playToggle.addEventListener("click", () => {
    if (activePlayback) {
      stopPlayback("manual_stop");
      renderPlayer();
      return;
    }

    startPlayback();
  });

  stopSessionButton.addEventListener("click", () => {
    stopPlayback("manual_stop");
    renderPlayer();
  });

  completeSessionButton.addEventListener("click", () => {
    completeSession("manual");
  });

  favoriteToggle.addEventListener("click", toggleFavorite);

  emailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailValue = emailInput.value.trim();
    if (!emailValue) return;

    state.email = emailValue;
    saveState();
    renderUnlockArea();
    trackEvent("email_captured", { hasEmail: true });
    showToast("Saved to this email.");
  });

  rewardClaim.addEventListener("click", () => {
    const reward = rewardClaim.dataset.reward;
    if (reward) {
      claimReward(reward);
    }
  });

  heroPrimary.addEventListener("click", () => {
    trackEvent("hero_cta_clicked", { target: "primary", variant: state.experiments.cta });
  });

  heroSecondary.addEventListener("click", () => {
    trackEvent("hero_cta_clicked", { target: "secondary", variant: state.experiments.cta });
  });

  handleQueryParams();
  renderAll();
  trackEvent("web_app_visit", { route: "/app" });
  trackEvent("experiment_exposed", {
    hero: state.experiments.hero,
    cta: state.experiments.cta,
  });
});
