/**
 * Writing loader
 * Loads published writing posts and renders cards on index.html and writing/index.html.
 */

const WRITING_SLUGS = [
  "calm-systems-beat-heroic-effort",
  "designing-a-homepage-that-feels-premium"
];

const WRITING_REMOTE_BASE = "https://raw.githubusercontent.com/jimmy1992abc/Clarechen.com.au/main/writing";

async function parseMarkdownFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const textRaw = await response.text();
    const text = textRaw.replace(/\r\n/g, "\n");
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return null;

    const [, frontmatterStr, content] = match;
    const frontmatter = {};

    frontmatterStr.split("\n").forEach((line) => {
      const [key, ...valueParts] = line.split(":");
      if (!key || valueParts.length === 0) return;
      let value = valueParts.join(":").trim();
      value = value.replace(/^["'](.*)["']$/, "$1");
      frontmatter[key.trim()] = value;
    });

    return { frontmatter, content };
  } catch {
    return null;
  }
}

async function loadPostBySlug(slug) {
  const pathname = window.location.pathname.replace(/\\/g, "/");
  const localPrefix = pathname.includes("/writing/") ? "../" : "";

  // Try local site path first, then GitHub raw as fallback.
  const candidates = [
    `${localPrefix}writing/${slug}/${slug}.md`,
    `${WRITING_REMOTE_BASE}/${slug}/${slug}.md`
  ];

  for (const url of candidates) {
    const post = await parseMarkdownFile(url);
    if (post) return post;
  }

  return null;
}

function estimateReadTime(text) {
  const words = text.replace(/[#>*`\-]/g, " ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

function getFirstParagraph(markdownContent) {
  const lines = markdownContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !line.startsWith("- "));

  return lines[0] || "";
}

async function loadPublishedWriting() {
  try {
    const posts = [];

    for (const slug of WRITING_SLUGS) {
      const post = await loadPostBySlug(slug);
      if (!post) continue;

      posts.push({
        slug,
        frontmatter: post.frontmatter,
        content: post.content
      });
    }

    posts.sort((a, b) => new Date(b.frontmatter.date || 0) - new Date(a.frontmatter.date || 0));
    return posts;
  } catch {
    return [];
  }
}

function createPostCard(post) {
  const { slug, frontmatter, content } = post;
  const dateStr = frontmatter.date 
    ? new Date(frontmatter.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })
    : "2026";
  const readTime = frontmatter.readTime || estimateReadTime(content);
  const summary = frontmatter.description || getFirstParagraph(content);

  return `
    <a class="post reveal" href="/writing/${slug}/">
      <div class="post__meta">
        <span class="post__date">${dateStr} · Note</span>
        <span class="post__dot" aria-hidden="true"></span>
        <span class="post__read">${readTime}</span>
      </div>
      <h3 class="post__title">${frontmatter.title || "Untitled"}</h3>
      <p class="post__text">${summary}</p>
    </a>
  `;
}

function applyReveal(container) {
  const revealEls = Array.from(container.querySelectorAll(".reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => io.observe(el));
}

async function renderHomepageWriting() {
  const container = document.getElementById("writingPostsContainer");
  if (!container) return;

  const posts = await loadPublishedWriting();
  if (posts.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:20px 0;">No writing published yet.</p>';
    return;
  }

  container.innerHTML = posts.slice(0, 2).map(createPostCard).join("");
  applyReveal(container);
}

async function renderWritingPage() {
  const container = document.getElementById("writingListContainer");
  if (!container) return;

  const posts = await loadPublishedWriting();
  if (posts.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:20px 0;">No writing published yet.</p>';
    return;
  }

  container.innerHTML = posts.map(createPostCard).join("");
  applyReveal(container);
}

window.renderHomepageWriting = renderHomepageWriting;
window.renderWritingPage = renderWritingPage;
