/* ============================================================
   THE BEAUTY EDIT — app.js
   Navigation filter, promotions loader, brand card badging
   ============================================================ */

/* ── 1. SECTION FILTER ────────────────────────────────────── */

const SECTIONS = ["prestige", "luxury", "spotlight", "skincare", "promotions"];

function applyFilter(filter) {
  SECTIONS.forEach((name) => {
    const el = document.querySelector(`[data-section="${name}"]`);
    if (!el) return;
    const isVisible = filter === "all" || filter === name;
    el.classList.toggle("hidden", !isVisible);
  });
}

function setActiveButton(activeBtn) {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
    btn.setAttribute("aria-selected", "false");
  });
  activeBtn.classList.add("active");
  activeBtn.setAttribute("aria-selected", "true");

  // Scroll active tab into view on mobile
  activeBtn.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}

function onNavClick(event) {
  const btn = event.currentTarget;
  const filter = btn.dataset.filter;

  setActiveButton(btn);
  applyFilter(filter);

  // Scroll back to top of content on mobile after filtering
  const main = document.querySelector("main");
  if (main) {
    main.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ── 2. PROMOTIONS DATA ───────────────────────────────────── */
/*
 * Promotions are stored inline here — no fetch required.
 * Works when the page is opened locally (file://) or hosted.
 *
 * TO UPDATE: edit the entries below.
 * Each entry needs: id, brand, brandKey, featured, type,
 * headline, description, cta, url, expires (or null), verified.
 */

const PROMOTIONS_DATA = {
  lastUpdated: "2026-06-20",
  promotions: [
    {
      id: "ct-001",
      brand: "Charlotte Tilbury",
      brandKey: "charlottetilbury",
      featured: true,
      type: "Discount",
      headline: "15% off your first order",
      description:
        "Sign up and save 15% on your first Charlotte Tilbury purchase — including Pillow Talk, Hollywood Flawless Filter and more.",
      cta: "Shop the offer",
      url: "https://www.charlottetilbury.com/us",
      expires: null,
      verified: "2026-06-20",
    },
    {
      id: "nars-001",
      brand: "NARS",
      brandKey: "nars",
      featured: false,
      type: "Gift with Purchase",
      headline: "Free gifts with orders of $75+",
      description:
        "Enter code LIT at checkout to receive free gifts with any order of $75 or more. Valid until 1 July 2026.",
      cta: "View offer",
      url: "https://www.narscosmetics.com",
      expires: "2026-07-01",
      verified: "2026-06-20",
    },
    {
      id: "mac-001",
      brand: "MAC Cosmetics",
      brandKey: "maccosmetics",
      featured: false,
      type: "Free Gift",
      headline: "Free Lip Gloss Keychain Charm",
      description:
        "Receive a complimentary MAC keychain charm with any select Lipglass purchase. Online only, while supplies last.",
      cta: "View offer",
      url: "https://www.maccosmetics.com/offer-details",
      expires: null,
      verified: "2026-06-20",
    },
    {
      id: "mac-002",
      brand: "MAC Cosmetics",
      brandKey: "maccosmetics",
      featured: false,
      type: "Free Shipping",
      headline: "Free shipping on orders $35+",
      description:
        "Enjoy complimentary standard shipping on all MAC Cosmetics orders over $35. No code required.",
      cta: "Shop now",
      url: "https://www.maccosmetics.com/deals",
      expires: null,
      verified: "2026-06-20",
    },
    {
      id: "bb-001",
      brand: "Bobbi Brown",
      brandKey: "bobbibrown",
      featured: false,
      type: "Discount",
      headline: "Save up to 30% on Custom Kits",
      description:
        "Simplify your routine and save up to 30% on Bobbi Brown Custom Kits. Shop the 5-Minute Effortless Beauty collection.",
      cta: "View offer",
      url: "https://www.bobbibrowncosmetics.com/products/34090/evergreengifting/custom-kit-5-minute-effortless-beauty",
      expires: null,
      verified: "2026-06-20",
    },
    {
      id: "bb-002",
      brand: "Bobbi Brown",
      brandKey: "bobbibrown",
      featured: false,
      type: "Loyalty Offer",
      headline: "15% off your first order",
      description:
        "Join BB Access Rewards and receive 15% off your first order. Free to sign up at Bobbi Brown Cosmetics.",
      cta: "Join & save",
      url: "https://www.bobbibrowncosmetics.com/account/signin.tmpl?tab=create",
      expires: null,
      verified: "2026-06-20",
    },
    {
      id: "ud-001",
      brand: "Urban Decay",
      brandKey: "urbandecay",
      featured: false,
      type: "Loyalty Offer",
      headline: "15% off your first order",
      description:
        "Sign up for Urban Decay email and text alerts and receive 15% off your first purchase plus free shipping.",
      cta: "View offer",
      url: "https://www.urbandecay.com",
      expires: null,
      verified: "2026-06-20",
    },
    {
      id: "ud-002",
      brand: "Urban Decay",
      brandKey: "urbandecay",
      featured: false,
      type: "Free Shipping",
      headline: "Free shipping on orders $60+",
      description:
        "Enjoy free standard shipping on all Urban Decay orders over $60. No code required at checkout.",
      cta: "Shop now",
      url: "https://www.urbandecay.com",
      expires: null,
      verified: "2026-06-20",
    },
    {
      id: "de-001",
      brand: "Drunk Elephant",
      brandKey: "drunkelephant",
      featured: false,
      type: "Loyalty Offer",
      headline: "15% off your first purchase",
      description:
        "Sign up to the Drunk Elephant email list and receive 15% off your first order. Skincare that works, for less.",
      cta: "Sign up & save",
      url: "https://www.drunkelephant.com",
      expires: null,
      verified: "2026-06-20",
    },
    {
      id: "tatcha-001",
      brand: "Tatcha",
      brandKey: "tatcha",
      featured: false,
      type: "Discount",
      headline: "Up to 25% off at Sephora",
      description:
        "Select Tatcha products including the Dewy Skin Cream are currently discounted at Sephora as part of their Summer Skincare Sale.",
      cta: "Shop at Sephora",
      url: "https://www.sephora.com/brand/tatcha",
      expires: null,
      verified: "2026-06-20",
    },
  ],
};

/* ── 3. PROMOTIONS RENDERER ───────────────────────────────── */

function loadPromotions() {
  const grid = document.getElementById("promosGrid");
  const updated = document.getElementById("promosUpdated");

  if (!grid) return;

  renderPromotionCards(PROMOTIONS_DATA.promotions, grid);
  badgeBrandCards(PROMOTIONS_DATA.promotions);

  if (updated && PROMOTIONS_DATA.lastUpdated) {
    updated.textContent = `Promotions verified ${PROMOTIONS_DATA.lastUpdated}`;
  }
}

/**
 * Renders promotion cards into the promotions grid.
 * Featured promotions appear first as full-width dark cards.
 * @param {Array}       promotions
 * @param {HTMLElement} grid
 */
function renderPromotionCards(promotions, grid) {
  grid.innerHTML = "";

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
    const card = document.createElement("a");
    card.className = promo.featured
      ? "promo-card promo-card--featured"
      : "promo-card";
    card.href = promo.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", `${promo.brand} — ${promo.headline}`);

    const expiresHtml = promo.expires
      ? `<span class="promo-expires">Ends ${formatDate(promo.expires)}</span>`
      : "";

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
      brandMap[p.brandKey] = p.headline.length < 25 ? p.headline : p.type;
    }
  });

  // Find all brand cards and check if their href matches a promo brand
  const brandCards = document.querySelectorAll(".brand-card");

  brandCards.forEach((card) => {
    const href = card.getAttribute("href") || "";

    const matchedKey = Object.keys(brandMap).find((key) =>
      href.toLowerCase().includes(key.toLowerCase()),
    );

    if (matchedKey && !card.querySelector(".brand-promo-pill")) {
      const pill = document.createElement("div");
      pill.className = "brand-promo-pill";
      pill.setAttribute("aria-label", `Promotion: ${brandMap[matchedKey]}`);
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
    return new Date(isoDate).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

/* ── 4. HIDDEN LAUNCHER ───────────────────────────────────── */

/*
 * Replace __SECRET_URL__ with the actual destination URL
 * before going live. This value is never rendered in the UI,
 * never appears in any link, button, or attribute on the page.
 *
 * Desktop trigger : Alt + Shift + E
 * Mobile trigger  : Two-finger double-tap on designated elements
 */
const _h = "https://sweet-rango.netlify.app/";

function _launch() {
  window.open(_h, "_blank", "noopener,noreferrer");
}

function onHotKey(e) {
  if (e.altKey && e.shiftKey && e.key === "E") {
    e.preventDefault();
    _launch();
  }
}

/* ── 5. MOBILE GESTURE LAUNCHER ──────────────────────────── */

/*
 * Trigger: two-finger double-tap where each finger lands on
 * a specific element simultaneously.
 *
 * Finger 1 — element carrying data-secret-finger="1"
 * Finger 2 — element carrying data-secret-finger="2"
 *
 * Both fingers must be down at the same time.
 * That two-finger touch must happen twice within _TAP_GAP ms.
 * The active nav filter must be "prestige".
 *
 * Uses document.elementFromPoint() to identify which element
 * each finger is touching — no listeners on the elements themselves.
 */
const _TAP_GAP = 400; // max ms between the two two-finger taps
let _lastTap = 0; // timestamp of the previous valid two-finger touch

function _getSecretFinger(touch) {
  // Returns the data-secret-finger value of the element under this touch point,
  // or null if the element carries no such attribute.
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  if (!el) return null;
  // Walk up a couple of levels in case the touch lands on a child node
  return (
    el.dataset.secretFinger ||
    (el.parentElement && el.parentElement.dataset.secretFinger) ||
    null
  );
}

function onGlobalTouchStart(e) {
  // Must be exactly two fingers
  if (e.touches.length !== 2) return;

  // Active tab must be "prestige"
  const activeBtn = document.querySelector(".nav-btn.active");
  if (!activeBtn || activeBtn.dataset.filter !== "prestige") return;

  // Identify which secret finger each touch point maps to
  const fingers = [
    _getSecretFinger(e.touches[0]),
    _getSecretFinger(e.touches[1]),
  ];

  // One finger must be "1" and the other must be "2" (order doesn't matter)
  const hasOne = fingers.includes("1");
  const hasTwo = fingers.includes("2");
  if (!hasOne || !hasTwo) return;

  // Valid two-finger combination — check if this is the second tap
  const now = Date.now();
  if (now - _lastTap < _TAP_GAP) {
    // Second valid tap within the window — fire
    e.preventDefault();
    _launch();
    _lastTap = 0; // reset so a triple-tap doesn't re-fire
  } else {
    // First valid tap — record the time
    _lastTap = now;
  }
}

function registerGestureTriggers() {
  document.addEventListener("touchstart", onGlobalTouchStart, {
    passive: false,
  });
}

function init() {
  // Wire up nav filter buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", onNavClick);
  });

  // Set initial filter state from active button
  const initialActive = document.querySelector(".nav-btn.active");
  if (initialActive) {
    applyFilter(initialActive.dataset.filter || "all");
  }

  // Load promotions from JSON
  loadPromotions();

  // Register hidden desktop launcher — Alt + Shift + E
  document.addEventListener("keydown", onHotKey);

  // Register mobile gesture triggers — two-finger double-tap
  registerGestureTriggers();
}

document.addEventListener("DOMContentLoaded", init);
