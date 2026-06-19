/* ============================================================
   THE BEAUTY EDIT — app.js
   Navigation filter logic with mobile touch optimisations
   ============================================================ */


/**
 * All sections that can be shown or hidden by the filter nav.
 * Each value matches the data-section attribute on the <section> element
 * and the data-filter attribute on the corresponding <button>.
 */
const SECTIONS = ['prestige', 'luxury', 'spotlight', 'skincare'];


/**
 * Shows all sections or a single named section.
 * @param {string} filter - 'all' or one of the SECTIONS values
 */
function applyFilter(filter) {
  SECTIONS.forEach((name) => {
    const el = document.querySelector(`[data-section="${name}"]`);
    if (!el) return;

    const isVisible = filter === 'all' || filter === name;
    el.classList.toggle('hidden', !isVisible);
  });
}


/**
 * Updates the active state on nav buttons and scrolls the
 * active button into view — important on mobile where the
 * nav overflows horizontally.
 * @param {HTMLElement} activeBtn - the button that was clicked
 */
function setActiveButton(activeBtn) {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });

  activeBtn.classList.add('active');
  activeBtn.setAttribute('aria-selected', 'true');

  // Scroll the active tab into view smoothly on mobile
  activeBtn.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  });
}


/**
 * Handles a nav button click — reads the data-filter attribute,
 * updates active state, applies the filter, and scrolls the
 * page to the top of the main content area.
 * @param {Event} event
 */
function onNavClick(event) {
  const btn = event.currentTarget;
  const filter = btn.dataset.filter;

  setActiveButton(btn);
  applyFilter(filter);

  // On mobile, scroll back to top of content after filtering
  // so users don't have to scroll up manually
  const main = document.querySelector('main');
  if (main) {
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


/**
 * Bootstraps the page — attaches event listeners after DOM is ready.
 */
function init() {
  const navButtons = document.querySelectorAll('.nav-btn');

  navButtons.forEach((btn) => {
    btn.addEventListener('click', onNavClick);
  });

  // Ensure the initial active button reflects the correct state on load
  const initialActive = document.querySelector('.nav-btn.active');
  if (initialActive) {
    applyFilter(initialActive.dataset.filter || 'all');
  }
}


// Run once the DOM is fully parsed
document.addEventListener('DOMContentLoaded', init);
