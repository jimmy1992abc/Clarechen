(() => {
  const intro = document.getElementById("intro");
  const year = document.getElementById("year");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const bar = document.getElementById("scrollbarBar");
  const path = window.location.pathname;
  const hash = window.location.hash;
  const isHomePage = /^\/(?:index\.html)?$/.test(path);
  const introSeenStorageKey = "clareIntroSeen";

  const hasSeenIntro = (() => {
    try {
      if (localStorage.getItem(introSeenStorageKey) === "1") return true;
    } catch {
      // Ignore blocked storage and rely on cookie fallback.
    }

    return document.cookie
      .split(";")
      .map((part) => part.trim())
      .some((part) => part === `${introSeenStorageKey}=1`);
  })();

  const markIntroSeen = () => {
    try {
      localStorage.setItem(introSeenStorageKey, "1");
    } catch {
      // Ignore storage errors (private mode / blocked storage).
    }

    document.cookie = `${introSeenStorageKey}=1; path=/; max-age=31536000; samesite=lax`;
  };

  // year
  if (year) year.textContent = new Date().getFullYear();

  // Hide immediately on repeat visits to avoid intro flash.
  if (intro && isHomePage && (hash || hasSeenIntro)) {
    intro.classList.add("is-hidden");
  }

  // intro fade-out (homepage only)
  window.addEventListener("load", () => {
  // Keep intro visible until first interaction
  if (!intro || !isHomePage) return;

  // Skip intro for section deep-links or repeat visits.
  if (hash || hasSeenIntro) {
    intro.classList.add("is-hidden");
    markIntroSeen();
    return;
  }

  const hideIntro = () => {
    intro.classList.add("is-hidden");
    markIntroSeen();

    // Remove listeners after dismissing (avoid extra work)
    window.removeEventListener("mousemove", onFirstInteraction);
    window.removeEventListener("mousedown", onFirstInteraction);
    window.removeEventListener("keydown", onFirstInteraction);
    window.removeEventListener("touchstart", onFirstInteraction);
    window.removeEventListener("scroll", onFirstInteraction);
  };

  let dismissed = false;
  const onFirstInteraction = () => {
    if (dismissed) return;
    dismissed = true;
    hideIntro();
  };

  // Attach “first interaction” listeners
  window.addEventListener("mousemove", onFirstInteraction, { once: true });
  window.addEventListener("mousedown", onFirstInteraction, { once: true });
  window.addEventListener("keydown", onFirstInteraction, { once: true });
  window.addEventListener("touchstart", onFirstInteraction, { once: true, passive: true });
  window.addEventListener("scroll", onFirstInteraction, { once: true, passive: true });
  });

  // mobile nav
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    // close on link click
    navMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // reveal on scroll
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));

  // top progress
  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    if (bar) bar.style.width = `${pct}%`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();