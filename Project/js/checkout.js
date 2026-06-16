/**
 * checkout.js — Amazon checkout logic controller
 * Handles billing form validations, cart math matching, payment simulation, and success receipts.
 */

'use strict';

const checkoutState = {
  cart: [],
  paymentMethod: 'card', // card, upi, cod
  user: null
};

// Utils
const $ = id => document.getElementById(id);
const $all = sel => document.querySelectorAll(sel);

function inr(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// Load cart on DOM load
document.addEventListener('DOMContentLoaded', () => {
  loadCartData();
  syncHeaderAuth();
  
  if (!checkoutState.cart.length) {
    showEmptyCheckoutState();
    return;
  }
  
  renderSummary();
  setupPaymentSelector();
  setupFormValidation();
  setupCheckoutSubmit();
  setupHeaderScroll();
});

// Load cart from localStorage
function loadCartData() {
  try {
    const c = localStorage.getItem('amz_cart');
    if (c) checkoutState.cart = JSON.parse(c);
    const u = localStorage.getItem('amz_user');
    if (u) checkoutState.user = JSON.parse(u);
  } catch (_) {}
}

// Sync header auth display
function syncHeaderAuth() {
  const userDisp = $('user-display');
  if (userDisp && checkoutState.user) {
    userDisp.textContent = `Hello, ${checkoutState.user.name.split(' ')[0]}`;
    userDisp.style.display = 'inline-block';
  }
}

// Header scroll effect
function setupHeaderScroll() {
  const header = $('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// Show empty state if cart is empty
function showEmptyCheckoutState() {
  const main = $('checkout-main-grid');
  if (!main) return;
  main.innerHTML = `
    <div class="checkout-card" style="grid-column: 1 / -1; text-align: center; padding: 64px 24px;">
      <div style="font-size: 3rem; margin-bottom: 16px;">🛒</div>
      <h1 class="checkout-heading" style="margin-bottom: 8px;">Your bag is empty</h1>
      <p style="color: var(--ink-40); margin-bottom: 24px;">Please add some premium curations to your cart before proceeding to checkout.</p>
      <a href="index.html" class="btn-hero-primary" style="display: inline-block; text-decoration: none;">Browse Store</a>
    </div>
  `;
}

// Calculate totals and render items in sidebar summary panel
function renderSummary() {
  const container = $('summary-items-container');
  if (!container) return;
  
  container.innerHTML = '';
  let subtotal = 0;
  let savings = 0;
  
  checkoutState.cart.forEach(({ id, qty }) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    
    subtotal += p.discountedPrice * qty;
    savings += (p.marketPrice - p.discountedPrice) * qty;
    
    const div = document.createElement('div');
    div.className = 'summary-item';
    div.innerHTML = `
      <img class="summary-item-img" src="${p.imageURL}" alt="${p.title}" width="50" height="50" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23f4f4f0%22/%3E%3C/svg%3E'">
      <div class="summary-item-info">
        <span class="summary-item-brand">${p.brand}</span>
        <h4 class="summary-item-title">${p.title}</h4>
        <div class="summary-item-meta">
          <span class="summary-item-qty">Qty: ${qty}</span>
          <span class="summary-item-price">${inr(p.discountedPrice * qty)}</span>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  
  // Calculate delivery & taxes
  const delivery = subtotal > 499 ? 0 : 99;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst + delivery;
  
  $('co-sub').textContent = inr(subtotal);
  $('co-save').textContent = '-' + inr(savings);
  $('co-delivery').textContent = delivery === 0 ? 'Free' : inr(delivery);
  $('co-gst').textContent = inr(gst);
  $('co-grand').textContent = inr(grandTotal);
}

// Payment method selectors
function setupPaymentSelector() {
  const btnCard = $('btn-pay-card');
  const btnUpi = $('btn-pay-upi');
  const btnCod = $('btn-pay-cod');
  
  const paneCard = $('payment-pane-card');
  const paneUpi = $('payment-pane-upi');
  const paneCod = $('payment-pane-cod');
  
  function selectPayment(method) {
    checkoutState.paymentMethod = method;
    
    // Toggle active classes
    btnCard.classList.toggle('active', method === 'card');
    btnUpi.classList.toggle('active', method === 'upi');
    btnCod.classList.toggle('active', method === 'cod');
    
    btnCard.setAttribute('aria-checked', method === 'card' ? 'true' : 'false');
    btnUpi.setAttribute('aria-checked', method === 'upi' ? 'true' : 'false');
    btnCod.setAttribute('aria-checked', method === 'cod' ? 'true' : 'false');
    
    // Toggle displays
    paneCard.style.display = method === 'card' ? 'block' : 'none';
    paneUpi.style.display = method === 'upi' ? 'block' : 'none';
    paneCod.style.display = method === 'cod' ? 'block' : 'none';
    
    // Smooth reset payment inputs
    resetPaymentValidation();
  }
  
  btnCard.onclick = () => selectPayment('card');
  btnUpi.onclick = () => selectPayment('upi');
  btnCod.onclick = () => selectPayment('cod');
}

// Input validation rules helper
function validateInput(inputEl, condition, errEl) {
  if (condition) {
    inputEl.classList.remove('is-invalid');
    inputEl.classList.add('is-valid');
    if (errEl) errEl.style.display = 'none';
    return true;
  } else {
    inputEl.classList.remove('is-valid');
    inputEl.classList.add('is-invalid');
    if (errEl) errEl.style.display = 'block';
    return false;
  }
}

// Realtime validation
function setupFormValidation() {
  const nameInput = $('co-name');
  const emailInput = $('co-email');
  const addressInput = $('co-address');
  const cityInput = $('co-city');
  const pincodeInput = $('co-pincode');
  
  // Real-time listener for inputs
  nameInput.oninput = () => validateInput(nameInput, nameInput.value.trim().length >= 3, $('err-name'));
  emailInput.oninput = () => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
    validateInput(emailInput, isEmail, $('err-email'));
  };
  addressInput.oninput = () => validateInput(addressInput, addressInput.value.trim().length >= 8, $('err-address'));
  cityInput.oninput = () => validateInput(cityInput, cityInput.value.trim().length >= 2, $('err-city'));
  pincodeInput.oninput = () => {
    // only digits, length 6
    pincodeInput.value = pincodeInput.value.replace(/\D/g, '');
    validateInput(pincodeInput, /^[0-9]{6}$/.test(pincodeInput.value), $('err-pincode'));
  };

  // Payment field formatters
  const cardNum = $('co-card-num');
  const cardExp = $('co-card-exp');
  const cardCvv = $('co-card-cvv');
  const upiId = $('co-upi-id');

  cardNum.oninput = () => {
    // Space format: 0000 0000 0000 0000
    let v = cardNum.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = v.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    cardNum.value = parts.length > 0 ? parts.join(' ') : v;
    validateInput(cardNum, v.length === 16, $('err-card-num'));
  };

  cardExp.oninput = () => {
    let v = cardExp.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      cardExp.value = v.substring(0, 2) + '/' + v.substring(2, 4);
    } else {
      cardExp.value = v;
    }
    const isFormat = /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(cardExp.value);
    validateInput(cardExp, isFormat, $('err-card-exp'));
  };

  cardCvv.oninput = () => {
    cardCvv.value = cardCvv.value.replace(/\D/g, '');
    validateInput(cardCvv, /^[0-9]{3}$/.test(cardCvv.value), $('err-card-cvv'));
  };

  upiId.oninput = () => {
    const isUpi = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.value.trim());
    validateInput(upiId, isUpi, $('err-upi-id'));
  };
}

function resetPaymentValidation() {
  ['co-card-num', 'co-card-exp', 'co-card-cvv', 'co-upi-id'].forEach(id => {
    const el = $(id);
    if (el) {
      el.classList.remove('is-valid', 'is-invalid');
    }
  });
  ['err-card-num', 'err-card-exp', 'err-card-cvv', 'err-upi-id'].forEach(id => {
    const el = $(id);
    if (el) el.style.display = 'none';
  });
}

// Full checkout submit logic
function setupCheckoutSubmit() {
  const form = $('checkout-form');
  const overlay = $('loader-overlay');
  const loaderText = $('loader-text-message');
  
  if (!form) return;
  
  form.onsubmit = e => {
    e.preventDefault();
    
    // Check validation of shipping address
    const nameVal = validateInput($('co-name'), $('co-name').value.trim().length >= 3, $('err-name'));
    const emailInput = $('co-email');
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
    const emailVal = validateInput(emailInput, isEmail, $('err-email'));
    const addressVal = validateInput($('co-address'), $('co-address').value.trim().length >= 8, $('err-address'));
    const cityVal = validateInput($('co-city'), $('co-city').value.trim().length >= 2, $('err-city'));
    const pincodeVal = validateInput($('co-pincode'), /^[0-9]{6}$/.test($('co-pincode').value), $('err-pincode'));
    
    let isFormValid = nameVal && emailVal && addressVal && cityVal && pincodeVal;
    
    // Check payment validation depending on selected method
    if (checkoutState.paymentMethod === 'card') {
      const ccNumVal = validateInput($('co-card-num'), $('co-card-num').value.replace(/\s+/g, '').length === 16, $('err-card-num'));
      const ccExpVal = validateInput($('co-card-exp'), /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test($('co-card-exp').value), $('err-card-exp'));
      const ccCvvVal = validateInput($('co-card-cvv'), /^[0-9]{3}$/.test($('co-card-cvv').value), $('err-card-cvv'));
      isFormValid = isFormValid && ccNumVal && ccExpVal && ccCvvVal;
    } else if (checkoutState.paymentMethod === 'upi') {
      const upiVal = validateInput($('co-upi-id'), /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test($('co-upi-id').value.trim()), $('err-upi-id'));
      isFormValid = isFormValid && upiVal;
    }
    
    if (!isFormValid) {
      toast('Please correct the validation errors in the form.');
      // Scroll to first invalid field
      const firstInvalid = document.querySelector('.form-input.is-invalid');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    // Form is valid! Start payment animation sequence
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    
    // Step 1
    loaderText.textContent = "Verifying shipping address details...";
    
    // Step 2
    setTimeout(() => {
      loaderText.textContent = checkoutState.paymentMethod === 'cod' 
        ? "Reserving items & registering COD order..."
        : "Authorizing secure payment with gateway...";
    }, 1000);
    
    // Step 3
    setTimeout(() => {
      loaderText.textContent = "Finalizing your transaction and generating receipt...";
    }, 2000);
    
    // Success redirect/render
    setTimeout(() => {
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
      processOrderSuccess();
    }, 3000);
  };
}

// Complete order, clear cart, render receipt
function processOrderSuccess() {
  const customerName = $('co-name').value.trim();
  const email = $('co-email').value.trim();
  const address = $('co-address').value.trim();
  const city = $('co-city').value.trim();
  const pincode = $('co-pincode').value.trim();
  
  // Calculate final totals
  let subtotal = 0;
  checkoutState.cart.forEach(({ id, qty }) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (p) subtotal += p.discountedPrice * qty;
  });
  const delivery = subtotal > 499 ? 0 : 99;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst + delivery;
  
  // Generate random order ID
  const orderId = `AMZ-2026-${Math.floor(10000000 + Math.random() * 90000000)}`;
  
  // Clear cart
  try {
    localStorage.removeItem('amz_cart');
  } catch (_) {}
  
  // Hide main checkout view
  const main = $('main-pane');
  if (!main) return;
  
  main.innerHTML = `
    <div class="container">
      <article class="success-receipt-card" aria-labelledby="success-heading">
        <div class="checkmark-circle">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 id="success-heading" style="font-family: var(--font-serif); font-style: italic; font-size: 2.5rem; margin-bottom: 8px;">Order Confirmed</h1>
        <p style="color: var(--ink-40); font-size: 0.95rem;">Thank you for your purchase. Your receipt and invoice details are compiled below.</p>
        
        <hr class="receipt-divider" aria-hidden="true">
        
        <div class="receipt-info-grid">
          <div>
            <span class="receipt-label">Order ID</span>
            <p class="receipt-val order-id">${orderId}</p>
          </div>
          <div>
            <span class="receipt-label">Estimated Delivery</span>
            <p class="receipt-val" style="color: var(--green); font-weight: 600;">2-3 Business Days</p>
          </div>
          <div>
            <span class="receipt-label">Customer Name</span>
            <p class="receipt-val">${customerName}</p>
          </div>
          <div>
            <span class="receipt-label">Email Address</span>
            <p class="receipt-val">${email}</p>
          </div>
          <div style="grid-column: 1 / -1;">
            <span class="receipt-label">Shipping Destination</span>
            <p class="receipt-val">${address}, ${city} - ${pincode}</p>
          </div>
          <div>
            <span class="receipt-label">Payment Type</span>
            <p class="receipt-val" style="text-transform: uppercase;">${checkoutState.paymentMethod === 'card' ? 'Credit/Debit Card' : checkoutState.paymentMethod === 'upi' ? 'UPI Pay' : 'Cash on Delivery (COD)'}</p>
          </div>
          <div>
            <span class="receipt-label">Amount Paid</span>
            <p class="receipt-val" style="font-size: 1.1rem; font-weight: 700; color: var(--ink);">${inr(grandTotal)}</p>
          </div>
        </div>
        
        <div class="receipt-actions">
          <button onclick="window.print()" class="btn-receipt-secondary">Print Receipt</button>
          <a href="index.html" class="btn-receipt-primary" style="text-decoration: none;">Return to Store</a>
        </div>
      </article>
    </div>
  `;
}

// Toast
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
