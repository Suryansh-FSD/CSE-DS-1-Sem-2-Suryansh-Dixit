/**
 * script.js — Amazon application engine
 * Core single-page state handling engine for 'APP'
 */

'use strict';

const APP = {
  cart: [],
  wishlist: [],
  filter: {
    query: '',
    category: 'All'
  },
  modalProductId: null,
  user: null
};

/* ============================================================
   UTILS
   ============================================================ */
const $ = id => document.getElementById(id);
const $all = sel => document.querySelectorAll(sel);

function inr(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

function stars(rating) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}

function starsHtml(rating) {
  return `<span class="stars" title="${rating} / 5" aria-label="${rating} out of 5">${stars(rating)}</span>`;
}

function stockClass(status) {
  if (status === 'Out of Stock') return 'out';
  if (status === 'Limited Stock') return 'low';
  return '';
}

/* ============================================================
   STORAGE
   ============================================================ */
function save() {
  try {
    localStorage.setItem('amz_cart', JSON.stringify(APP.cart));
    localStorage.setItem('amz_wishlist', JSON.stringify(APP.wishlist));
  } catch (_) {}
}

function load() {
  try {
    const c = localStorage.getItem('amz_cart');
    const w = localStorage.getItem('amz_wishlist');
    if (c) APP.cart = JSON.parse(c);
    if (w) APP.wishlist = JSON.parse(w);
    const u = localStorage.getItem('amz_user');
    if (u) APP.user = JSON.parse(u);
  } catch (_) {}
}

/* ============================================================
   FILTERING
   ============================================================ */
function filtered() {
  const q = APP.filter.query.toLowerCase().trim();
  const cat = APP.filter.category;
  return PRODUCTS.filter(p => {
    const matchCat = cat === 'All' || p.category === cat;
    const matchQuery = !q || [p.title, p.brand, p.category, p.description]
      .some(s => s.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });
}

/* ============================================================
   CART ENGINE
   ============================================================ */
function cartItem(id) { return APP.cart.find(i => i.id === id); }
function cartCount() { return APP.cart.reduce((s, i) => s + i.qty, 0); }

function addToCart(id, qty = 1) {
  const existing = cartItem(id);
  existing ? (existing.qty += qty) : APP.cart.push({ id, qty });
  save();
  syncCartBadge();
  renderCartItems();
  const p = PRODUCTS.find(x => x.id === id);
  toast(`Added to bag: ${p?.brand ?? ''}`);
}

function removeFromCart(id) {
  APP.cart = APP.cart.filter(i => i.id !== id);
  save();
  syncCartBadge();
  renderCartItems();
}

function setQty(id, qty) {
  if (qty < 1) { removeFromCart(id); return; }
  const item = cartItem(id);
  if (item) { item.qty = qty; save(); syncCartBadge(); renderCartItems(); }
}

function syncCartBadge() {
  const n = cartCount();
  const el = $('cart-badge');
  if (!el) return;
  el.textContent = n;
  el.setAttribute('aria-label', `${n} items in cart`);
}

/* ============================================================
   CART RENDER
   ============================================================ */
function renderCartItems() {
  const list = $('cart-items-list');
  const foot = $('cart-footer-area');
  if (!list) return;

  if (!APP.cart.length) {
    list.innerHTML = `
      <div class="cart-empty-state" style="text-align: center; padding: 48px 0; color: var(--ink-40);">
        <h3>Your bag is empty</h3>
        <p style="font-size: 0.85rem; margin-top: 4px;">Items you add will appear here.</p>
      </div>`;
    foot && updateTotals(0, 0);
    return;
  }

  let sub = 0, saved = 0;
  list.innerHTML = '';

  APP.cart.forEach(({ id, qty }) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    sub += p.discountedPrice * qty;
    saved += (p.marketPrice - p.discountedPrice) * qty;

    const li = document.createElement('div');
    li.className = 'cart-item';
    li.setAttribute('role', 'listitem');
    li.innerHTML = `
      <img class="cart-item-img" src="${p.imageURL}" alt="${p.title}" loading="lazy" width="70" height="70" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2270%22 height=%2270%22 viewBox=%220 0 200 200%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%23f4f4f0%22/%3E%3Ctext x=%22100%22 y=%22105%22 font-family=%22Inter,sans-serif%22 font-size=%2213%22 fill=%22%23b5b5b0%22 text-anchor=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E'">
      <div class="cart-item-info">
        <span class="cart-item-brand">${p.brand}</span>
        <p class="cart-item-title">${p.title}</p>
        <span class="cart-item-price">${inr(p.discountedPrice)}</span>
        <div class="cart-item-controls">
          <div class="qty-stepper" role="group" aria-label="Quantity for ${p.title}">
            <button class="qty-btn" data-action="dec" data-id="${id}">−</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${id}">+</button>
          </div>
          <button class="cart-remove" data-id="${id}">Remove</button>
        </div>
      </div>`;
    list.appendChild(li);
  });

  list.querySelectorAll('.qty-btn').forEach(btn => {
    btn.onclick = () => {
      const item = cartItem(btn.dataset.id);
      if (item) setQty(btn.dataset.id, item.qty + (btn.dataset.action === 'inc' ? 1 : -1));
    };
  });
  list.querySelectorAll('.cart-remove').forEach(btn => {
    btn.onclick = () => removeFromCart(btn.dataset.id);
  });

  updateTotals(sub, saved);
}

function updateTotals(sub, saved) {
  const gst = Math.round(sub * 0.18);
  const grand = sub + gst;
  const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };
  set('ct-sub', inr(sub));
  set('ct-save', '-' + inr(saved));
  set('ct-gst', inr(gst));
  set('ct-grand', inr(grand));
}

/* ============================================================
   WISHLIST
   ============================================================ */
function toggleWishlist(id) {
  const idx = APP.wishlist.indexOf(id);
  idx !== -1 ? APP.wishlist.splice(idx, 1) : APP.wishlist.push(id);
  save();
  syncWishBadge();
  renderProductGrid();
  const wb = $('modal-wish-btn');
  if (wb && APP.modalProductId === id) {
    wb.classList.toggle('active', APP.wishlist.includes(id));
  }
  toast(idx !== -1 ? 'Removed from wishlist' : 'Added to wishlist');
}

function syncWishBadge() {
  const el = $('wishlist-badge');
  if (!el) return;
  const n = APP.wishlist.length;
  el.textContent = n;
  el.hidden = n === 0;
}

/* ============================================================
   3D CARD TILT INTERACTION
   ============================================================ */
function apply3DTilt() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const dx = x - xc;
      const dy = y - yc;
      const rx = -(dy / yc) * 5; // max 5 degrees tilt
      const ry = (dx / xc) * 5;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    });
    card.style.transition = 'transform 0.08s cubic-bezier(0.16, 1, 0.3, 1)';
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

/* ============================================================
   PRODUCT GRID RENDER
   ============================================================ */
function renderProductGrid() {
  const grid = $('product-grid');
  const empty = $('empty-state');
  const info = $('results-info');
  if (!grid) return;

  const list = filtered();
  grid.innerHTML = '';

  if (info) info.textContent = list.length
    ? `Displaying ${list.length} of ${PRODUCTS.length} curations`
    : '';

  if (!list.length) { empty?.removeAttribute('hidden'); return; }
  empty?.setAttribute('hidden', '');

  list.forEach((p, i) => renderCard(p, grid, i));
  apply3DTilt();
}

function renderCard(p, container, delay = 0) {
  const inWish = APP.wishlist.includes(p.id);
  const sc = stockClass(p.stockStatus);

  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('role', 'listitem');
  card.setAttribute('aria-label', p.title);

  card.innerHTML = `
    <div class="card-img-wrap">
      <img class="card-img" src="${p.imageURL}" alt="${p.title}" loading="lazy"
           onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 viewBox=%220 0 200 200%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%23f4f4f0%22/%3E%3Ctext x=%22100%22 y=%22105%22 font-family=%22Inter,sans-serif%22 font-size=%2213%22 fill=%22%23b5b5b0%22 text-anchor=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E'">
      <span class="card-badge">${p.discountPercentage}% OFF</span>
      <button class="card-wish-btn ${inWish ? 'active' : ''}" data-id="${p.id}"
              aria-label="${inWish ? 'Remove from wishlist' : 'Add to wishlist'}" aria-pressed="${inWish}">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="${inWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>
    <div class="card-body">
      <span class="card-brand">${p.brand}</span>
      <h3 class="card-title">${p.title}</h3>
      <div class="card-rating">
        ${starsHtml(p.rating)}
        <span class="review-ct">${p.reviewCount.toLocaleString('en-IN')}</span>
      </div>
      <div class="card-price">
        <div class="price-row">
          <span class="price-current">${inr(p.discountedPrice)}</span>
          <span class="price-original">${inr(p.marketPrice)}</span>
        </div>
        <span class="price-saving">Save ${inr(p.marketPrice - p.discountedPrice)}</span>
        <span class="card-stock ${sc}">${p.stockStatus}</span>
      </div>
      <div class="card-cta">
        <button class="card-add-btn" data-id="${p.id}">Add to Bag</button>
      </div>
    </div>`;

  card.addEventListener('click', e => {
    if (!e.target.closest('button')) openModal(p.id);
  });
  card.querySelector('.card-wish-btn').addEventListener('click', e => {
    e.stopPropagation();
    toggleWishlist(p.id);
  });
  card.querySelector('.card-add-btn').addEventListener('click', e => {
    e.stopPropagation();
    addToCart(p.id);
  });

  container.appendChild(card);
  return card;
}

function renderSectionGrid(gridId, products, max = 4) {
  const grid = $(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  products.slice(0, max).forEach((p, i) => renderCard(p, grid, i));
  apply3DTilt();
}

function populateHomeSections() {
  const trending = [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount);
  renderSectionGrid('trending-grid', trending);
}

/* ============================================================
   CATEGORY CARDS
   ============================================================ */
function renderCategoryGrid() {
  const grid = $('category-grid');
  if (!grid) return;
  grid.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const count = PRODUCTS.filter(p => p.category === cat).length;

    const card = document.createElement('div');
    card.className = 'category-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Browse ${cat} — ${count} products`);
    card.innerHTML = `
      <p class="cat-name">${cat}</p>
      <p class="cat-count">${count} items</p>`;

    const activate = () => {
      APP.filter.category = cat;
      renderFilterBar();
      renderProductGrid();
      document.getElementById('home-featured')?.scrollIntoView({ behavior: 'smooth' });
    };

    card.addEventListener('click', activate);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
    grid.appendChild(card);
  });
}

function renderFilterBar() {
  const bar = $('filter-bar');
  if (!bar) return;

  const cats = ['All', ...CATEGORIES];
  bar.innerHTML = '';

  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-chip ${APP.filter.category === cat ? 'active' : ''}`;
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      APP.filter.category = cat;
      bar.querySelectorAll('.filter-chip').forEach(c => {
        c.classList.toggle('active', c.textContent === cat);
      });
      renderProductGrid();
    });
    bar.appendChild(btn);
  });
}

/* ============================================================
   HERO PRODUCT CARD
   ============================================================ */
function renderHeroCard() {
  const slot = $('hero-product-slot');
  if (!slot) return;
  const p = PRODUCTS.find(x => x.id === 'sony-wh1000xm5') || PRODUCTS[0];

  slot.innerHTML = `
    <div class="hero-product-card">
      <div class="hero-product-img-wrap">
        <img class="hero-product-img" src="${p.imageURL}" alt="${p.title}" loading="eager">
      </div>
      <div class="hero-product-info">
        <p class="hero-product-brand">${p.brand}</p>
        <p class="hero-product-name">${p.title}</p>
        <div class="hero-product-price-row">
          <span class="hero-product-price">${inr(p.discountedPrice)}</span>
          <button class="hero-add-btn" id="hero-card-add">Add to Bag</button>
        </div>
      </div>
    </div>`;

  $('hero-card-add')?.addEventListener('click', () => addToCart(p.id));
  $('hero-shop-btn')?.addEventListener('click', () => {
    document.getElementById('home-featured')?.scrollIntoView({ behavior: 'smooth' });
  });
  $('hero-explore-btn')?.addEventListener('click', () => {
    window.location.href = 'about.html';
  });
}

/* ============================================================
   SEARCH
   ============================================================ */
function setupSearch() {
  const input = $('search-input');
  const form = $('search-form');
  const drop = $('search-dropdown');
  if (!input || !drop) return;

  input.addEventListener('input', () => {
    APP.filter.query = input.value;
    renderProductGrid();
    renderSuggestions(input.value.trim(), drop, input);
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    drop.hidden = true;
    document.getElementById('home-featured')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.addEventListener('click', e => {
    if (!form?.contains(e.target)) {
      drop.hidden = true;
    }
  });
}

function renderSuggestions(q, list, input) {
  if (q.length < 2) { list.hidden = true; return; }

  const matches = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(q.toLowerCase()) ||
    p.brand.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 6);

  if (!matches.length) { list.hidden = true; return; }

  list.innerHTML = '';
  list.hidden = false;

  matches.forEach(p => {
    const li = document.createElement('li');
    li.className = 'suggestion-item';
    li.innerHTML = `<span>${p.title}</span><span class="suggestion-brand" style="color:var(--ink-40); font-size:0.75rem;">${p.brand}</span>`;
    const activate = () => {
      input.value = p.title;
      APP.filter.query = p.title;
      list.hidden = true;
      renderProductGrid();
      openModal(p.id);
    };
    li.addEventListener('click', activate);
    list.appendChild(li);
  });
}

/* ============================================================
   CATEGORY DROPDOWN (desktop nav)
   ============================================================ */
function setupCategoryDropdown() {
  $all('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      APP.filter.category = btn.dataset.cat;
      renderFilterBar();
      renderProductGrid();
      document.getElementById('home-featured')?.scrollIntoView({ behavior: 'smooth' });
      closeMobileNav();
    });
  });
}

/* ============================================================
   CART DRAWER & POPUP SETUP
   ============================================================ */
function setupCart() {
  const cartBtn = $('cart-btn');
  const drawer = $('cart-drawer');
  const closeBtn = $('cart-close-btn');
  const checkBtn = $('checkout-btn');

  if (!cartBtn || !drawer) return;

  cartBtn.addEventListener('click', () => {
    renderCartItems();
    drawer.showPopover();
  });

  closeBtn?.addEventListener('click', () => {
    drawer.hidePopover();
  });

  checkBtn?.addEventListener('click', () => {
    if (!APP.cart.length) { toast('Your bag is empty'); return; }
    window.location.href = 'checkout.html';
  });
}

/* ============================================================
   PRODUCT DETAIL DIALOG (MODAL)
   ============================================================ */
function openModal(id) {
  const modal = $('product-modal');
  const p = PRODUCTS.find(x => x.id === id);
  if (!modal || !p) return;

  APP.modalProductId = id;
  const inWish = APP.wishlist.includes(id);
  const sc = stockClass(p.stockStatus);

  $('modal-img').src = p.imageURL;
  $('modal-img').alt = p.title;
  $('modal-badge-pct').textContent = `${p.discountPercentage}% OFF`;
  $('modal-brand').textContent = p.brand;
  $('modal-title').textContent = p.title;
  $('modal-stars').innerHTML = stars(p.rating);
  $('modal-reviews').textContent = `${p.reviewCount.toLocaleString('en-IN')} ratings`;
  $('modal-price-current').textContent = inr(p.discountedPrice);
  $('modal-price-original').textContent = inr(p.marketPrice);
  $('modal-price-pct').textContent = `${p.discountPercentage}% off`;
  $('modal-desc').textContent = p.description;

  const stockEl = $('modal-stock');
  stockEl.textContent = p.stockStatus;
  stockEl.className = `card-stock ${sc}`;

  const qty = $('modal-qty');
  if (qty) qty.value = '1';

  const wb = $('modal-wish-btn');
  if (wb) wb.classList.toggle('active', inWish);

  const addBtn = $('modal-add-btn');
  const newAdd = addBtn.cloneNode(true);
  addBtn.replaceWith(newAdd);
  newAdd.addEventListener('click', () => {
    addToCart(id, parseInt(qty?.value || '1', 10));
    modal.close();
  });

  const newWb = wb.cloneNode(true);
  wb.replaceWith(newWb);
  newWb.classList.toggle('active', inWish);
  newWb.addEventListener('click', () => toggleWishlist(id));

  modal.showModal();
}

function setupModal() {
  const modal = $('product-modal');
  const closeBtn = $('modal-close');
  if (!modal) return;

  closeBtn?.addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.close();
  });
}

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */
function openMobileNav() {
  const nav = $('mobile-nav');
  const back = $('mobile-nav-backdrop');
  if (!nav) return;
  nav.classList.add('open');
  nav.removeAttribute('inert');
  back?.removeAttribute('hidden');
}

function closeMobileNav() {
  const nav = $('mobile-nav');
  const back = $('mobile-nav-backdrop');
  if (!nav) return;
  nav.classList.remove('open');
  nav.setAttribute('inert', '');
  back?.setAttribute('hidden', '');
}

function setupMobileNav() {
  $('mobile-burger')?.addEventListener('click', openMobileNav);
  $('mobile-nav-close')?.addEventListener('click', closeMobileNav);
  $('mobile-nav-backdrop')?.addEventListener('click', closeMobileNav);
  $all('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', closeMobileNav);
  });
}

/* ============================================================
   SCROLL EFFECTS
   ============================================================ */
function setupScrollEffects() {
  const header = $('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* ============================================================
   TOAST SYSTEM
   ============================================================ */
let toastTimer;
function toast(msg) {
  const el = $('toast');
  const msgEl = $('toast-msg');
  if (!el) return;
  if (msgEl) msgEl.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

/* ============================================================
   DEALS BANNER CTA
   ============================================================ */
function setupDealsBanner() {
  $('deals-cta-btn')?.addEventListener('click', () => {
    APP.filter.category = 'Electronics';
    renderFilterBar();
    renderProductGrid();
    document.getElementById('home-featured')?.scrollIntoView({ behavior: 'smooth' });
  });

  $('view-all-trending')?.addEventListener('click', e => {
    e.preventDefault();
    APP.filter.category = 'All';
    renderFilterBar();
    renderProductGrid();
    document.getElementById('home-featured')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ============================================================
   CLEAR FILTERS
   ============================================================ */
function setupClearFilters() {
  $('clear-btn')?.addEventListener('click', () => {
    APP.filter.query = '';
    APP.filter.category = 'All';
    const inp = $('search-input');
    if (inp) inp.value = '';
    renderFilterBar();
    renderProductGrid();
  });
}

/* ============================================================
   AUTH UI SYNC
   ============================================================ */
function syncAuthUI() {
  const loginBtn = $('nav-login-btn');
  const signupBtn = $('nav-signup-btn');
  if (APP.user && loginBtn && signupBtn) {
    loginBtn.textContent = APP.user.name.split(' ')[0];
    loginBtn.href = '#';
    signupBtn.textContent = 'Sign out';
    signupBtn.href = '#';
    signupBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('amz_user');
      APP.user = null;
      toast('Signed out successfully');
      setTimeout(() => location.reload(), 800);
    });
  }
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  load();

  renderHeroCard();
  renderCategoryGrid();
  renderFilterBar();
  renderProductGrid();
  populateHomeSections();

  syncCartBadge();
  syncWishBadge();
  syncAuthUI();

  setupSearch();
  setupCategoryDropdown();
  setupCart();
  setupModal();
  setupMobileNav();
  setupScrollEffects();
  setupDealsBanner();
  setupClearFilters();

  $('wishlist-btn')?.addEventListener('click', () => {
    toast(`${APP.wishlist.length} item${APP.wishlist.length !== 1 ? 's' : ''} in wishlist`);
  });

  // Multi-tab storage sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'amz_cart') {
      load();
      syncCartBadge();
      renderCartItems();
    }
    if (e.key === 'amz_wishlist') {
      load();
      syncWishBadge();
      renderProductGrid();
    }
  });
});
