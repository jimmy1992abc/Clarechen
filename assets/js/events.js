/**
 * Markdown Event Parser
 * Fetches and parses markdown event files with YAML frontmatter
 */

async function parseEventMarkdownFile(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[Events] Fetch failed for ${url}: ${response.status} ${response.statusText}`);
      return null;
    }

    const text = await response.text();

    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return null;

    const [, frontmatterStr, content] = match;
    const frontmatter = {};

    frontmatterStr.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        let value = valueParts.join(':').trim();
        value = value.replace(/^["'](.*)["']$/, '$1');
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["'](.*)["']$/, '$1'));
        }
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        frontmatter[key.trim()] = value;
      }
    });

    return {
      frontmatter,
      content,
      slug: url.split('/').pop().replace('.md', '')
    };
  } catch (error) {
    console.error(`[Events] Error parsing ${url}:`, error);
    return null;
  }
}

async function loadPublishedEvents() {
  try {
    const activeUrl = 'https://raw.githubusercontent.com/jimmy1992abc/Clarechen/main/event/active.md';
    const response = await fetch(activeUrl);

    if (!response.ok) {
      console.error(`[Events] Failed to fetch active.md: ${response.status} ${response.statusText}`);
      return [];
    }

    const text = await response.text();
    const slugs = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('- '))
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(Boolean);

    const events = [];

    for (const slug of slugs) {
      const eventUrl = `https://raw.githubusercontent.com/jimmy1992abc/Clarechen/main/event/${slug}/${slug}.md`;
      const event = await parseEventMarkdownFile(eventUrl);

      if (event) {
        event.slug = slug;
        events.push(event);
      }
    }

    // Keep only events on or after today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = events.filter(e => new Date(e.frontmatter.date + 'T00:00:00') >= today);

    // Sort by date ascending (nearest first)
    upcoming.sort((a, b) => new Date(a.frontmatter.date) - new Date(b.frontmatter.date));

    return upcoming;
  } catch (error) {
    console.error('[Events] Error loading published events:', error);
    return [];
  }
}

function formatDateLong(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function createEventCard(event) {
  const { frontmatter, slug } = event;
  const dateFormatted = formatDateLong(frontmatter.date);

  const tags = frontmatter.tags
    ? (Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags])
    : ['Event'];
  const tagHtml = tags.map((tag, idx) => {
    const className = idx > 0 ? 'tag tag--muted' : 'tag';
    return `<span class="${className}">${tag}</span>`;
  }).join('\n        ');

  return `
    <article class="card reveal">
      <div class="card__top">
        ${tagHtml}
      </div>
      <h3 class="card__title">${frontmatter.title}</h3>
      <p class="card__text">
        ${frontmatter.description || ''}
      </p>
      <div class="card__date">
        <span class="card__date--icon">📅</span>
        ${dateFormatted}
      </div>
      <div class="card__actions">
        <a class="link" href="/event/${slug}/" aria-label="Open event">View details</a>
      </div>
    </article>
  `;
}

async function renderEventCards() {
  const container = document.getElementById('eventCardsContainer');
  if (!container) return;

  try {
    const events = await loadPublishedEvents();
    const homepageEvents = events.slice(0, 2);

    if (homepageEvents.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">No upcoming events at the moment. Check back soon!</p>';
      return;
    }

    container.innerHTML = homepageEvents.map(event => createEventCard(event)).join('');

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    }, { threshold: 0.12 });

    container.querySelectorAll(".reveal").forEach(el => io.observe(el));
  } catch (error) {
    console.error('[Events] Error rendering event cards:', error);
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">Error loading events.</p>';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadPublishedEvents, renderEventCards, parseEventMarkdownFile };
}
