(() => {
  const intro = document.getElementById("intro");
  const year = document.getElementById("year");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const bar = document.getElementById("scrollbarBar");

  // year
  if (year) year.textContent = new Date().getFullYear();

  // intro fade-out
  window.addEventListener("load", () => {
    setTimeout(() => {
      intro?.classList.add("is-hidden");
    }, 700);
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
``