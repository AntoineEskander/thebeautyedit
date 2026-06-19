/* ============================================================
   THE BEAUTY EDIT — app.js
   Navigation filter, promotions loader, brand card badging
   ============================================================ */


/* ── 1. SECTION FILTER ────────────────────────────────────── */

const SECTIONS = ['prestige', 'luxury', 'spotlight', 'skincare', 'promotions'];

function applyFilter(filter) {
  SECTIONS.forEach((name) => {
    const el = document.querySelector(`[data-section="${name}"]`);
    if (!el) return;
    const isVisible = filter === 'all' || filter === name;
    el.classList.toggle('hidden', !isVisible);
  });
}

function setActiveButton(activeBtn) {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });
  activeBtn.classList.add('active');
  activeBtn.setAttribute('aria-selected', 'true');

  // Scroll active tab into view on mobile
  activeBtn.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  });
}

function onNavClick(event) {
  const btn    = event.currentTarget;
  const filter = btn.dataset.filter;

  setActiveButton(btn);
  applyFilter(filter);

  // Scroll back to top of content on mobile after filtering
  const main = document.querySelector('main');
  if (main) {
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


/* ── 2. PROMOTIONS LOADER ─────────────────────────────────── */

/**
 * Fetches promotions.json, renders promotion cards in the
 * promotions section, and badges brand cards where applicable.
 */
async function loadPromotions() {
  const grid    = document.getElementById('promosGrid');
  const updated = document.getElementById('promosUpdated');

  if (!grid) return;

  // Show loading state
  grid.innerHTML = `<div class="promos-loading">Loading promotions…</div>`;

  try {
    const res  = await fetch('./promotions.json');
    if (!res.ok) throw new Error(`Could not load promotions.json (HTTP ${res.status})`);

    const data = await res.json();

    renderPromotionCards(data.promotions, grid);
    badgeBrandCards(data.promotions);

    if (updated && data.lastUpdated) {
      updated.textContent = `Promotions verified ${data.lastUpdated}`;
    }

  } catch (err) {
    // Fail silently in production — don't show errors to visitors
    grid.innerHTML = `<div class="promos-loading">No promotions available at this time.</div>`;
    console.warn('Beauty Edit — promotions load failed:', err.message);
  }
}

/**
 * Renders promotion cards into the promotions grid.
 * Featured promotions appear first as full-width dark cards.
 * @param {Array}       promotions
 * @param {HTMLElement} grid
 */
function renderPromotionCards(promotions, grid) {
  grid.innerHTML = '';

  if (!promotions || promotions.length === 0) {
    grid.innerHTML = `<div class="promos-loading">No promotions available at this time.</div>`;
    return;
  }

  // Sort: featured first, then by brand name
  const sorted = [...promotions].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.brand.localeCompare(b.brand);
  });

  sorted.forEach((promo) => {
    const card = document.createElement('a');
    card.className  = promo.featured
      ? 'promo-card promo-card--featured'
      : 'promo-card';
    card.href       = promo.url;
    card.target     = '_blank';
    card.rel        = 'noopener noreferrer';
    card.setAttribute('aria-label', `${promo.brand} — ${promo.headline}`);

    const expiresHtml = promo.expires
      ? `<span class="promo-expires">Ends ${formatDate(promo.expires)}</span>`
      : '';

    card.innerHTML = `
      <span class="promo-type">${promo.type}</span>
      <span class="promo-brand">${promo.brand}</span>
      <span class="promo-headline">${promo.headline}</span>
      <span class="promo-desc">${promo.description}</span>
      ${expiresHtml}
      <span class="promo-cta">${promo.cta} →</span>`;

    grid.appendChild(card);
  });
}

/**
 * Adds a subtle promotion pill to any brand card that has
 * an active promotion in the JSON.
 * Matches on the card's href domain against promo brandKey.
 * @param {Array} promotions
 */
function badgeBrandCards(promotions) {
  // Build a map of brandKey → shortest headline for the pill
  const brandMap = {};
  promotions.forEach((p) => {
    if (!brandMap[p.brandKey]) {
      // Pick the most concise headline for the badge
      brandMap[p.brandKey] = p.headline.length < 25
        ? p.headline
        : p.type;
    }
  });

  // Find all brand cards and check if their href matches a promo brand
  const brandCards = document.querySelectorAll('.brand-card');

  brandCards.forEach((card) => {
    const href = card.getAttribute('href') || '';

    const matchedKey = Object.keys(brandMap).find((key) =>
      href.toLowerCase().includes(key.toLowerCase())
    );

    if (matchedKey && !card.querySelector('.brand-promo-pill')) {
      const pill = document.createElement('div');
      pill.className = 'brand-promo-pill';
      pill.setAttribute('aria-label', `Promotion: ${brandMap[matchedKey]}`);
      pill.innerHTML = `
        <i class="ti ti-tag" aria-hidden="true"></i>
        <span>${brandMap[matchedKey]}</span>`;
      card.appendChild(pill);
    }
  });
}


/* ── 3. UTILITIES ─────────────────────────────────────────── */

/**
 * Formats an ISO date string to a readable short date.
 * e.g. "2026-07-01" → "1 Jul 2026"
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
  try {
    return new Date(isoDate).toLocaleDateString('en-US', {
      day:   'numeric',
      month: 'short',
      year:  'numeric',
    });
  } catch {
    return isoDate;
  }
}


/* ── 4. INIT ──────────────────────────────────────────────── */

function init() {
  // Wire up nav filter buttons
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', onNavClick);
  });

  // Set initial filter state from active button
  const initialActive = document.querySelector('.nav-btn.active');
  if (initialActive) {
    applyFilter(initialActive.dataset.filter || 'all');
  }

  // Load promotions from JSON
  loadPromotions();
}

document.addEventListener('DOMContentLoaded', init);
