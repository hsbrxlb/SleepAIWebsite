document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("page-web-app")) {
    return;
  }

  const STORAGE_KEY = "sleepai-webapp-state-v1";
  const POSITIONING_VARIANTS = {
    flow: {
      kicker: "Work / Study / Flow",
      title: "Keep a softer layer of calm open while the screen stays busy.",
      description:
        "Ambient-first listening for work, study, browsing, gaming, and recovery moments, with quick resets when your nervous system needs less friction and less noise.",
    },
    reset: {
      kicker: "Stress Relief / Calm / Reset",
      title: "Use the browser like a softer recovery space between everything else.",
      description:
        "Quick breathing cues, guided decompression, and low-stimulus ambient sound designed for moments when you need the nervous system to settle without opening a heavy app flow.",
    },
  };
  const CTA_VARIANTS = {
    start_free: {
      primary: "Start listening free",
      secondary: "Try 3-minute reset",
      secondaryHref: "index.html?mode=reset&session=reset-arrival-breath",
    },
    quick_reset: {
      primary: "Try 3-minute reset",
      secondary: "Start listening free",
      secondaryHref: "#app-library",
    },
  };
  const MODE_COPY = {
    ambient: {
      title: "Ambient picks for work, study, and quiet browsing.",
      description:
        "Long-running browser sound with a mix of free previews and Pro items for deeper usage.",
    },
    reset: {
      title: "Short guided resets for overload, anxious loops, and tab fatigue.",
      description:
        "These sessions speak in-browser when speech synthesis is available, with prototype runtimes compressed for testing.",
    },
    winddown: {
      title: "Wind-down sessions carrying Pufflo's bedtime tone into the web product.",
      description:
        "Built from the existing 20-minute ritual logic, but kept as one lane inside a lighter web product.",
    },
  };
  const TRACKS = [
    {
      id: "ambient-rain-code-window",
      mode: "ambient",
      title: "Rain Code Window",
      subtitle: "Brown noise, soft rain, and a low room hum.",
      durationLabel: "45 min target",
      runtimeLabel: "Infinite",
      intent: "Work / Study",
      access: "free",
      description: "A steady low-mid texture that makes reading and coding feel less brittle.",
      caption: "Settle into the room. Let the texture stay in the background while attention narrows.",
      engine: { baseHz: 78, harmonicHz: 156, filterHz: 540, color: "brown", wobbleHz: 0.06 },
    },
    {
      id: "ambient-deep-focus-canopy",
      mode: "ambient",
      title: "Deep Focus Canopy",
      subtitle: "Warm synth pad with filtered brown noise.",
      durationLabel: "60 min target",
      runtimeLabel: "Infinite",
      intent: "Deep work",
      access: "pro",
      description: "Lower-frequency support for heavier concentration blocks.",
      caption: "Let the room get slightly smaller. Keep the tone wide, but keep your attention narrow.",
      engine: { baseHz: 72, harmonicHz: 144, filterHz: 460, color: "brown", wobbleHz: 0.04 },
    },
    {
      id: "ambient-quiet-cafe-drift",
      mode: "ambient",
      title: "Quiet Cafe Drift",
      subtitle: "Soft room motion with a faint high shimmer.",
      durationLabel: "40 min target",
      runtimeLabel: "Infinite",
      intent: "Browsing / Writing",
      access: "free",
      description: "A calmer alternative to real cafe noise when you want presence without distraction.",
      caption: "Hold a little motion in the air. Let the browser stay active while your body stays softer.",
      engine: { baseHz: 92, harmonicHz: 184, filterHz: 760, color: "pink", wobbleHz: 0.08 },
    },
    {
      id: "ambient-night-train-writing",
      mode: "ambient",
      title: "Night Train Writing",
      subtitle: "Low movement, distant rail rhythm, and a patient pulse.",
      durationLabel: "50 min target",
      runtimeLabel: "Infinite",
      intent: "Writing",
      access: "pro",
      description: "For late desk sessions that need momentum but not urgency.",
      caption: "Think in longer lines. Let each sentence land without forcing the next one early.",
      engine: { baseHz: 68, harmonicHz: 136, filterHz: 610, color: "brown", wobbleHz: 0.05 },
    },
    {
      id: "ambient-soft-orbit-reading",
      mode: "ambient",
      title: "Soft Orbit Reading",
      subtitle: "Gentle airy noise with a brighter top edge.",
      durationLabel: "30 min target",
      runtimeLabel: "Infinite",
      intent: "Reading",
      access: "pro",
      description: "A lighter texture for calmer reading, study review, or reflective work.",
      caption: "Read at one page slower than usual. Let comprehension arrive without chasing speed.",
      engine: { baseHz: 110, harmonicHz: 220, filterHz: 940, color: "pink", wobbleHz: 0.09 },
    },
    {
      id: "reset-arrival-breath",
      mode: "reset",
      title: "Arrival Breath",
      subtitle: "3-minute reset for mental spillover.",
      durationLabel: "3 min",
      runtimeLabel: "55 sec prototype",
      intent: "Quick reset",
      access: "free",
      description: "A short decompression session for moments when your thoughts are louder than the room.",
      caption: "Begin by letting the inhale arrive normally. Make the exhale a little longer than before.",
      runtimeMs: 55000,
      steps: [
        { atMs: 0, text: "Pause where you are. Nothing has to be solved in the next minute." },
        { atMs: 10000, text: "Let the inhale arrive naturally. Lengthen the exhale just a little." },
        { atMs: 22000, text: "If thoughts rush back in, do not follow them. Return to the breath." },
        { atMs: 38000, text: "Loosen the jaw, lower the shoulders, and let the room feel less sharp." },
        { atMs: 50000, text: "One final slower breath. Return with less pressure than you started with." },
      ],
      engine: { baseHz: 120, harmonicHz: 240, filterHz: 880, color: "pink", wobbleHz: 0.1 },
    },
    {
      id: "reset-tab-fatigue",
      mode: "reset",
      title: "Tab Fatigue Reset",
      subtitle: "10-minute decompression for overstimulation.",
      durationLabel: "10 min",
      runtimeLabel: "75 sec prototype",
      intent: "Stress relief",
      access: "free",
      description: "For the point in the day when every tab feels equally urgent.",
      caption: "Let your eyes soften first. The body often settles faster when the eyes stop scanning.",
      runtimeMs: 75000,
      steps: [
        { atMs: 0, text: "Stop switching tasks for a moment. Your attention does not need one more sudden turn." },
        { atMs: 14000, text: "Breathe in for four. Exhale for six. Let the pace come down slightly." },
        { atMs: 30000, text: "Feel the support under your feet or chair. Stay with one point of contact." },
        { atMs: 52000, text: "Quietly tell yourself: not everything needs to move right now." },
        { atMs: 68000, text: "Come back when the body feels one step less urgent than before." },
      ],
      engine: { baseHz: 98, harmonicHz: 196, filterHz: 720, color: "pink", wobbleHz: 0.08 },
    },
    {
      id: "reset-478-evening",
      mode: "reset",
      title: "4-7-8 Evening Companion",
      subtitle: "20-minute breathing lane for a slower descent.",
      durationLabel: "20 min",
      runtimeLabel: "90 sec prototype",
      intent: "Breathwork",
      access: "pro",
      description: "A browser-friendly breathing companion that can bridge work mode into evening mode.",
      caption: "Inhale for four. Hold for seven. Exhale for eight. Stay gentle with the count.",
      runtimeMs: 90000,
      steps: [
        { atMs: 0, text: "Release the pace of the last hour. We will use a slower breathing ratio now." },
        { atMs: 16000, text: "Inhale for four. Hold for seven. Exhale for eight. No strain, only pace." },
        { atMs: 40000, text: "Let the exhale carry more weight than the inhale. That is where the settling happens." },
        { atMs: 66000, text: "If counting feels hard, return to the idea of a longer exit than entry." },
        { atMs: 84000, text: "One more round. Then let the breath continue without supervision." },
      ],
      engine: { baseHz: 84, harmonicHz: 168, filterHz: 640, color: "brown", wobbleHz: 0.06 },
    },
    {
      id: "reset-gaming-cooldown",
      mode: "reset",
      title: "Gaming Cooldown",
      subtitle: "A short reset for post-stimulation comedown.",
      durationLabel: "10 min",
      runtimeLabel: "70 sec prototype",
      intent: "Post-play reset",
      access: "pro",
      description: "Useful after play, streaming, or heavy sensory input when the body stays activated.",
      caption: "The intensity can end before the body fully notices. Let it notice now.",
      runtimeMs: 70000,
      steps: [
        { atMs: 0, text: "The stimulus has ended. Let your system take a moment to understand that." },
        { atMs: 15000, text: "Slow the breath. Keep your shoulders wide and your jaw loose." },
        { atMs: 34000, text: "Notice one steady sound in the room and let attention rest there." },
        { atMs: 52000, text: "Tell your body it does not need to stay alert for the next minute." },
        { atMs: 65000, text: "Return slowly. The point is not empty calm, only less leftover tension." },
      ],
      engine: { baseHz: 102, harmonicHz: 204, filterHz: 760, color: "pink", wobbleHz: 0.07 },
    },
    {
      id: "winddown-overthinking",
      mode: "winddown",
      title: "Overthinking Wind-down",
      subtitle: "20-minute ritual for cognitive overload.",
      durationLabel: "20 min",
      runtimeLabel: "95 sec prototype",
      intent: "Bedtime",
      access: "free",
      description: "Adapted from the fixed-structure bedtime ritual for nights when thoughts keep spinning.",
      caption: "The day is over. Nothing needs to be completed in the next twenty minutes.",
      runtimeMs: 95000,
      steps: [
        { atMs: 0, text: "The day is over. Nothing needs to be completed in the next twenty minutes." },
        { atMs: 18000, text: "Place attention on the breath. Let the exhale become slightly longer than the inhale." },
        { atMs: 42000, text: "When thoughts restart, let them rest in a box for tomorrow instead of solving them now." },
        { atMs: 69000, text: "Drop the need to check whether you are doing this correctly. Rest is still rest." },
        { atMs: 90000, text: "The guidance fades now. Stay here, slower and softer than before." },
      ],
      engine: { baseHz: 76, harmonicHz: 152, filterHz: 480, color: "brown", wobbleHz: 0.05 },
    },
    {
      id: "winddown-body-heavy",
      mode: "winddown",
      title: "Body Heavy, Mind Awake",
      subtitle: "20-minute ritual for tired but not sleepy nights.",
      durationLabel: "20 min",
      runtimeLabel: "95 sec prototype",
      intent: "Bedtime",
      access: "pro",
      description: "A body-first track for nights when the system feels tired but refuses to switch off.",
      caption: "Let the bed hold more of your weight than you are currently giving it.",
      runtimeMs: 95000,
      steps: [
        { atMs: 0, text: "You do not need to push yourself into sleep. Let the bed do more of the work." },
        { atMs: 20000, text: "Inhale gently. Exhale longer. Let the shoulders and legs give up a little more weight." },
        { atMs: 46000, text: "Move attention through the body. Jaw, throat, chest, stomach, hands, legs." },
        { atMs: 72000, text: "There is no need to check whether you are sinking enough. Rest is already happening." },
        { atMs: 90000, text: "Stay with the slower exhale and let the room become less important." },
      ],
      engine: { baseHz: 70, harmonicHz: 140, filterHz: 430, color: "brown", wobbleHz: 0.04 },
    },
    {
      id: "winddown-sleep-anxiety",
      mode: "winddown",
      title: "Sleep Anxiety Ease",
      subtitle: "20-minute ritual for fear about not sleeping.",
      durationLabel: "20 min",
      runtimeLabel: "95 sec prototype",
      intent: "Bedtime",
      access: "pro",
      description: "For nights when the pressure to sleep is the thing keeping you awake.",
      caption: "You do not need to prove sleep tonight. Lying down and resting still counts.",
      runtimeMs: 95000,
      steps: [
        { atMs: 0, text: "You do not need to prove sleep tonight. Lying down and resting still counts." },
        { atMs: 18000, text: "Breathe in for four. Breathe out for six. Keep the pace gentle, not forced." },
        { atMs: 43000, text: "When the question appears, when will I fall asleep, answer it only with: it is okay." },
        { atMs: 70000, text: "Drop the urge to monitor yourself. The body does not need that pressure." },
        { atMs: 90000, text: "Leave the breath to continue on its own. Let the guidance step back." },
      ],
      engine: { baseHz: 82, harmonicHz: 164, filterHz: 560, color: "brown", wobbleHz: 0.05 },
    },
    {
      id: "winddown-emotional-afterglow",
      mode: "winddown",
      title: "Emotional Afterglow",
      subtitle: "20-minute ritual for feelings that still feel too active.",
      durationLabel: "20 min",
      runtimeLabel: "95 sec prototype",
      intent: "Night recovery",
      access: "free",
      description: "A warmer session for nights where emotion is still moving too loudly to sleep against it.",
      caption: "Nothing inside you has to disappear before rest can begin.",
      runtimeMs: 95000,
      steps: [
        { atMs: 0, text: "Nothing inside you has to disappear before rest can begin." },
        { atMs: 21000, text: "Let the breath move around the feeling instead of trying to erase it." },
        { atMs: 45000, text: "Name the feeling softly if you need to, then stop explaining it." },
        { atMs: 71000, text: "Let the body be supported. Let the emotion be present without being in charge." },
        { atMs: 90000, text: "The room can hold the rest of this night with you." },
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
  const liveTrackMode = document.getElementById("live-track-mode");
  const liveTrackAccess = document.getElementById("live-track-access");
  const heroSessionCount = document.getElementById("hero-session-count");
  const heroStreakCount = document.getElementById("hero-streak-count");
  const heroEntitlementBanner = document.getElementById("hero-entitlement-banner");
  const modeTabs = Array.from(document.querySelectorAll("[data-mode-tab]"));
  const trackGrid = document.getElementById("track-grid");
  const libraryTitle = document.getElementById("library-title");
  const libraryDescription = document.getElementById("library-description");
  const playerModeLabel = document.getElementById("player-mode-label");
  const playerTitle = document.getElementById("player-title");
  const playerAccessPill = document.getElementById("player-access-pill");
  const playerDescription = document.getElementById("player-description");
  const playerDuration = document.getElementById("player-duration");
  const playerRuntime = document.getElementById("player-runtime");
  const playerProgressFill = document.getElementById("player-progress-fill");
  const playerCaption = document.getElementById("player-caption");
  const playerStatusBanner = document.getElementById("player-status-banner");
  const playToggle = document.getElementById("play-toggle");
  const favoriteToggle = document.getElementById("favorite-toggle");
  const voiceToggle = document.getElementById("voice-toggle");
  const completeSessionButton = document.getElementById("complete-session");
  const stopSessionButton = document.getElementById("stop-session");
  const emailForm = document.getElementById("email-form");
  const emailInput = document.getElementById("email-input");
  const accountSummary = document.getElementById("account-summary");
  const recentList = document.getElementById("recent-list");
  const favoriteList = document.getElementById("favorite-list");
  const rewardButtons = Array.from(document.querySelectorAll("[data-claim-reward]"));
  const rewardCardPro = document.getElementById("reward-card-pro-pass");
  const rewardCardMobile = document.getElementById("reward-card-mobile-unlock");
  const priceButtons = Array.from(document.querySelectorAll("[data-plan]"));
  const eventStream = document.getElementById("event-stream");
  const demoThreeSessions = document.getElementById("demo-three-sessions");
  const demoFiveStreak = document.getElementById("demo-five-streak");
  const resetDemoState = document.getElementById("reset-demo-state");
  const handoffToMobile = document.getElementById("handoff-to-mobile");

  const createDefaultState = () => ({
    email: "",
    favorites: [],
    recentTrackIds: [],
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
      positioning: Math.random() > 0.5 ? "flow" : "reset",
      cta: Math.random() > 0.5 ? "start_free" : "quick_reset",
    },
    voiceEnabled: true,
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
        recentTrackIds: Array.isArray(parsed.recentTrackIds) ? parsed.recentTrackIds : [],
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

  const getLocalDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getTrackById = (trackId) => TRACKS.find((track) => track.id === trackId) || null;

  const sortRecentIds = (ids) =>
    Array.from(new Set(ids)).filter((id) => getTrackById(id)).slice(0, 6);

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

  const trackEvent = (name, payload = {}) => {
    const eventPayload = {
      event: name,
      timestamp: new Date().toISOString(),
      ...payload,
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventPayload);

    state.eventLog = [eventPayload, ...state.eventLog].slice(0, 8);
    saveState();
    renderEventStream();
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
        master.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 1.2);
      },
      stop() {
        const stopAt = ctx.currentTime + 0.5;
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
        }, 650);
      },
    };
  };

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
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
    playToggle.textContent = "Play selected";
    if (reason === "manual_stop") {
      trackEvent("session_stopped", { trackId: activeTrackId || null });
    }
  };

  const maybeSpeak = (text) => {
    if (!state.voiceEnabled) return;
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 0.96;
    utterance.volume = 0.82;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const updateRecentTrack = (trackId) => {
    state.recentTrackIds = sortRecentIds([trackId, ...state.recentTrackIds]);
    saveState();
  };

  const renderEventStream = () => {
    if (!eventStream) return;
    if (!state.eventLog.length) {
      eventStream.innerHTML = '<span class="app-token app-token-empty">No events yet</span>';
      return;
    }

    eventStream.innerHTML = state.eventLog
      .map(
        (item) =>
          `<span class="app-token">${item.event.replaceAll("_", " ")}</span>`
      )
      .join("");
  };

  const renderHero = () => {
    const positioning = POSITIONING_VARIANTS[state.experiments.positioning];
    const ctaVariant = CTA_VARIANTS[state.experiments.cta];

    heroKicker.textContent = positioning.kicker;
    heroTitle.textContent = positioning.title;
    heroDescription.textContent = positioning.description;
    heroPrimary.textContent = ctaVariant.primary;
    heroSecondary.textContent = ctaVariant.secondary;
    heroSecondary.setAttribute("href", ctaVariant.secondaryHref);
  };

  const updateHeroStats = () => {
    heroSessionCount.textContent = String(state.completedCount);
    heroStreakCount.textContent = `${getStreak()} days`;

    const entitlementText = hasProAccess()
      ? `${state.entitlement.plan === "yearly" ? "Yearly" : "Pro"} access active`
      : "Free access active";
    const entitlementDetail = hasProAccess()
      ? "Full web library unlocked. Rewards and favorites stay synced in local state."
      : "Complete sessions to earn a 3-day Pro pass, or unlock monthly / yearly access below.";

    heroEntitlementBanner.innerHTML = `<strong>${entitlementText}</strong><span>${entitlementDetail}</span>`;
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
        const accessTag = locked
          ? '<span class="app-track-tag is-pro">Pro preview</span>'
          : track.access === "pro"
          ? '<span class="app-track-tag is-pro">Pro unlocked</span>'
          : '<span class="app-track-tag is-free">Free</span>';

        return `
          <article class="app-track-card ${isSelected ? "is-selected" : ""}" data-track-id="${track.id}">
            <div class="app-track-card-top">
              <div>
                <h3>${track.title}</h3>
                <p>${track.subtitle}</p>
              </div>
              ${accessTag}
            </div>
            <div class="app-track-meta">
              <span class="app-track-tag">${track.durationLabel}</span>
              <span class="app-track-tag">${track.intent}</span>
            </div>
            <div class="app-track-tags">
              <span class="app-track-tag">${track.runtimeLabel}</span>
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
      playerTitle.textContent = "Choose a session to start";
      playerDescription.textContent =
        "Pick any card on the left to start a browser session. Guided tracks can speak aloud when your browser supports speech synthesis.";
      playerDuration.textContent = "Duration: --";
      playerRuntime.textContent = "Prototype runtime: --";
      playerAccessPill.textContent = "Ready";
      playerAccessPill.classList.remove("is-pro");
      setCaption("No session is active yet.");
      playerStatusBanner.innerHTML =
        "<strong>Visitor mode</strong><span>Use the email capture below to save favorites and sync future entitlements.</span>";
      favoriteToggle.textContent = "Save";
      voiceToggle.textContent = state.voiceEnabled ? "Voice on" : "Voice off";
      liveTrackTitle.textContent = "Rain Code Window";
      liveTrackMode.textContent = "Ambient";
      liveTrackAccess.textContent = hasProAccess() ? "Unlocked" : "Free preview";
      return;
    }

    const locked = track.access === "pro" && !hasProAccess();

    playerModeLabel.textContent =
      activeMode === "ambient"
        ? "Ambient"
        : activeMode === "reset"
        ? "Quick Reset"
        : "Wind-down";
    playerTitle.textContent = track.title;
    playerDescription.textContent = track.description;
    playerDuration.textContent = `Duration: ${track.durationLabel}`;
    playerRuntime.textContent = `Prototype runtime: ${track.runtimeLabel}`;
    playerAccessPill.textContent = locked ? "Preview only" : track.access === "pro" ? "Pro" : "Free";
    playerAccessPill.classList.toggle("is-pro", track.access === "pro");
    setCaption(track.caption);
    favoriteToggle.textContent = state.favorites.includes(track.id) ? "Saved" : "Save";
    voiceToggle.textContent = state.voiceEnabled ? "Voice on" : "Voice off";

    playerStatusBanner.innerHTML = locked
      ? "<strong>Preview cap active</strong><span>This Pro item will stop after a short preview until access is unlocked.</span>"
      : hasProAccess()
      ? "<strong>Full access active</strong><span>Playback is no longer capped, and reward logic stays enabled.</span>"
      : "<strong>Free access active</strong><span>Free items play in full. Pro items unlock after checkout or reward claims.</span>";

    liveTrackTitle.textContent = track.title;
    liveTrackMode.textContent = playerModeLabel.textContent;
    liveTrackAccess.textContent = locked ? "Preview only" : track.access === "pro" ? "Unlocked" : "Free";
  };

  const renderAccount = () => {
    const statusLabel = state.email ? "Saved locally" : "Visitor";
    const planLabel = hasProAccess()
      ? state.entitlement.plan === "yearly"
        ? "Yearly"
        : state.entitlement.plan === "monthly"
        ? "Monthly"
        : "Reward pass"
      : "Free";

    accountSummary.innerHTML = `
      <div>
        <span>Status</span>
        <strong>${statusLabel}</strong>
      </div>
      <div>
        <span>Plan</span>
        <strong>${planLabel}</strong>
      </div>
      <div>
        <span>Favorites</span>
        <strong>${state.favorites.length} items</strong>
      </div>
      <div>
        <span>Recent plays</span>
        <strong>${state.recentTrackIds.length}</strong>
      </div>
    `;

    if (state.email) {
      emailInput.value = state.email;
    }

    recentList.innerHTML = state.recentTrackIds.length
      ? state.recentTrackIds
          .map((trackId) => getTrackById(trackId))
          .filter(Boolean)
          .map((track) => `<span class="app-token">${track.title}</span>`)
          .join("")
      : '<span class="app-token app-token-empty">Nothing yet</span>';

    favoriteList.innerHTML = state.favorites.length
      ? state.favorites
          .map((trackId) => getTrackById(trackId))
          .filter(Boolean)
          .map((track) => `<span class="app-token">${track.title}</span>`)
          .join("")
      : '<span class="app-token app-token-empty">Nothing saved</span>';
  };

  const renderRewards = () => {
    const threeEligible = state.completedCount >= 3;
    const streakEligible = getStreak() >= 5;

    const threeButton = rewardButtons.find((button) => button.dataset.claimReward === "three_sessions");
    const streakButton = rewardButtons.find((button) => button.dataset.claimReward === "five_day_streak");

    if (threeButton) {
      threeButton.textContent = state.claimedRewards.three_sessions
        ? "Claimed"
        : threeEligible
        ? "Claim 3-day Pro pass"
        : `${state.completedCount}/3 sessions complete`;
      threeButton.disabled = state.claimedRewards.three_sessions || !threeEligible;
    }

    if (streakButton) {
      streakButton.textContent = state.claimedRewards.five_day_streak
        ? "Claimed"
        : streakEligible
        ? "Claim 7-day mobile unlock"
        : `${getStreak()}/5 day streak`;
      streakButton.disabled = state.claimedRewards.five_day_streak || !streakEligible;
    }

    rewardCardPro.style.borderColor = threeEligible
      ? "rgba(163, 255, 241, 0.22)"
      : "rgba(255, 255, 255, 0.09)";
    rewardCardMobile.style.borderColor = streakEligible
      ? "rgba(255, 214, 149, 0.22)"
      : "rgba(255, 255, 255, 0.09)";
  };

  const renderAll = () => {
    renderHero();
    updateHeroStats();
    renderTrackGrid();
    renderPlayer();
    renderAccount();
    renderRewards();
    renderEventStream();
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

    if (shouldTrack) {
      trackEvent("library_mode_switched", { mode });
    }
  };

  const selectTrack = (trackId, shouldTrack = true) => {
    const track = getTrackById(trackId);
    if (!track) return;

    activeTrackId = trackId;
    activeMode = track.mode;
    modeTabs.forEach((tab) => {
      const isActive = tab.dataset.modeTab === activeMode;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    renderTrackGrid();
    renderPlayer();

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
      showToast("This browser does not support Web Audio.");
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

    updateRecentTrack(track.id);
    renderAccount();
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
          setCaption("Preview ended. Unlock full access to keep this session going.");
          playerStatusBanner.innerHTML =
            "<strong>Preview ended</strong><span>Unlock monthly or yearly access, or earn a reward pass through repeated use.</span>";
          trackEvent("preview_capped", { trackId: track.id, mode: track.mode });
          showToast("Preview ended. Unlock full access to continue.");
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
      showToast("Start a session before finishing it.");
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
    renderAll();
    showToast("Session logged. Rewards may now be available.");
  };

  const toggleFavorite = () => {
    const track = getTrackById(activeTrackId);
    if (!track) {
      showToast("Choose a session to save.");
      return;
    }

    if (state.favorites.includes(track.id)) {
      state.favorites = state.favorites.filter((id) => id !== track.id);
      trackEvent("favorite_removed", { trackId: track.id });
    } else {
      state.favorites = [track.id, ...state.favorites].slice(0, 8);
      trackEvent("favorite_added", { trackId: track.id });
    }

    saveState();
    renderAccount();
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
      showToast("3-day Pro pass activated.");
      return;
    }

    if (rewardKey === "five_day_streak" && getStreak() >= 5 && !state.claimedRewards.five_day_streak) {
      state.claimedRewards.five_day_streak = true;
      saveState();
      trackEvent("reward_claimed", { reward: rewardKey });
      renderAll();
      showToast("7-day mobile unlock marked as earned.");
      return;
    }

    showToast("That reward is not unlocked yet.");
  };

  const activatePlan = (plan) => {
    if (!state.email) {
      emailInput.focus();
      showToast("Capture an email first so access can be synced later.");
      return;
    }

    trackEvent("checkout_started", { plan });
    state.entitlement = {
      plan,
      source: "prototype_checkout",
      expiresAt: plan === "monthly" ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + 365 * 24 * 60 * 60 * 1000,
    };
    saveState();
    trackEvent("checkout_completed", { plan });
    renderAll();
    showToast(`${plan === "yearly" ? "Yearly" : "Monthly"} access activated locally.`);
  };

  const seedThreeSessions = () => {
    state.completedCount = Math.max(state.completedCount, 3);
    state.sessionDays = Array.from(new Set([getLocalDateKey(), ...state.sessionDays]));
    saveState();
    renderAll();
    trackEvent("demo_seed_state", { state: "three_sessions" });
    showToast("Loaded 3 completed sessions.");
  };

  const seedFiveDayStreak = () => {
    const days = Array.from({ length: 5 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - index);
      return getLocalDateKey(date);
    });
    state.completedCount = Math.max(state.completedCount, 5);
    state.sessionDays = Array.from(new Set([...days, ...state.sessionDays]));
    saveState();
    renderAll();
    trackEvent("demo_seed_state", { state: "five_day_streak" });
    showToast("Loaded a 5-day streak.");
  };

  const resetState = () => {
    stopPlayback("reset");
    state = createDefaultState();
    saveState();
    renderAll();
    trackEvent("demo_state_reset");
    showToast("Local prototype state reset.");
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
      playToggle.textContent = "Play selected";
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

  voiceToggle.addEventListener("click", () => {
    state.voiceEnabled = !state.voiceEnabled;
    saveState();
    renderPlayer();
    trackEvent("voice_toggled", { enabled: state.voiceEnabled });
  });

  emailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailValue = emailInput.value.trim();
    if (!emailValue) return;
    state.email = emailValue;
    saveState();
    renderAccount();
    updateHeroStats();
    trackEvent("email_captured", { hasEmail: true });
    showToast("Email captured locally for this prototype.");
  });

  rewardButtons.forEach((button) => {
    button.addEventListener("click", () => {
      claimReward(button.dataset.claimReward);
    });
  });

  priceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activatePlan(button.dataset.plan);
    });
  });

  demoThreeSessions.addEventListener("click", seedThreeSessions);
  demoFiveStreak.addEventListener("click", seedFiveDayStreak);
  resetDemoState.addEventListener("click", resetState);

  handoffToMobile.addEventListener("click", (event) => {
    event.preventDefault();
    trackEvent("mobile_handoff_clicked", { emailCaptured: Boolean(state.email), plan: state.entitlement.plan });
    showToast("Mobile handoff click tracked. Replace this with the real app deep link.");
  });

  heroPrimary.addEventListener("click", () => {
    trackEvent("hero_cta_clicked", { variant: state.experiments.cta, target: "primary" });
  });

  heroSecondary.addEventListener("click", () => {
    trackEvent("hero_cta_clicked", { variant: state.experiments.cta, target: "secondary" });
  });

  handleQueryParams();
  renderAll();
  trackEvent("web_app_visit", { route: "/app" });
  trackEvent("experiment_exposed", {
    positioning: state.experiments.positioning,
    cta: state.experiments.cta,
  });
});
