/* ============================================================
   NOVA HEAD SPA — Script v6 · Editorial Redesign
   ============================================================ */

// Localization helpers (i18n.js loads first; fall back to the key if absent)
const t = key => (window.NovaI18N ? window.NovaI18N.t(key) : key);
const currentLang = () => (window.NovaI18N ? window.NovaI18N.lang : 'fr');

// ── NAV ──────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Navbar stays dark throughout — white text reads over both light and dark
// sections; a hairline border keeps the bar legible over dark backgrounds.

// ── MOBILE MENU ──────────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    navbar.classList.toggle('is-nav-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navMenu.querySelectorAll('.navbar__link, .navbar__cta').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      navbar.classList.remove('is-nav-open');
      document.body.style.overflow = '';
    });
  });
}

// ── MOBILE STICKY BAR ────────────────────────────────────────
const mobileBar = document.getElementById('mobile-bar');
if (mobileBar) {
  window.addEventListener('scroll', () => {
    mobileBar.classList.toggle('is-visible', window.scrollY > 400);
  });
}

// ── REVEAL & SCROLL ANIMATIONS ──────────────────────────────
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      if (e.target.classList.contains('stagger')) {
        e.target.querySelectorAll('.reveal, .reveal-scale').forEach(c => c.classList.add('visible'));
      }
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger, .section-line').forEach(el => obs.observe(el));

// ── SMOOTH SCROLL ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ── COOKIE CONSENT — Loi 25 ──────────────────────────────────
// Non-essential cookies stay off until the visitor opts in. To add real
// analytics later, drop the loader inside enableAnalytics() — it only runs
// once consent.analytics is true.
(function () {
  const KEY = 'nova_consent_v1';
  const banner = document.getElementById('cookie-consent');
  const prefs = document.getElementById('cookie-prefs');
  if (!banner) return;

  const analyticsToggle = document.getElementById('pref-analytics');
  let lastFocus = null;

  const stored = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };

  function save(consent) {
    consent.date = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(consent));
    apply(consent);
  }

  function apply(consent) {
    if (consent.analytics) enableAnalytics();
  }

  function enableAnalytics() {
    if (window.__novaAnalytics) return;
    window.__novaAnalytics = true;
    // Inject your audience-measurement script here — fires only after opt-in.
  }

  function openPrefs() {
    if (analyticsToggle) { const s = stored(); analyticsToggle.checked = !!(s && s.analytics); }
    lastFocus = document.activeElement;
    prefs.hidden = false;
    const title = prefs.querySelector('.cookie-prefs__title');
    title.setAttribute('tabindex', '-1');
    title.focus();
  }

  function closePrefs() {
    prefs.hidden = true;
    if (lastFocus) lastFocus.focus();
  }

  function handle(action) {
    switch (action) {
      case 'accept':    save({ essential: true, analytics: true });  banner.hidden = true; closePrefs(); break;
      case 'decline':   save({ essential: true, analytics: false }); banner.hidden = true; closePrefs(); break;
      case 'save':      save({ essential: true, analytics: !!(analyticsToggle && analyticsToggle.checked) }); banner.hidden = true; closePrefs(); break;
      case 'customize':
      case 'manage':    openPrefs(); break;
      case 'close':     closePrefs(); break;
    }
  }

  document.querySelectorAll('[data-cookie]').forEach(el => {
    el.addEventListener('click', () => handle(el.dataset.cookie));
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !prefs.hidden) closePrefs(); });

  const existing = stored();
  if (existing) apply(existing); else banner.hidden = false;
})();

// ── CONTACT FORM (Formspree) ─────────────────────────────────
const contactForm = document.querySelector('.contact__form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = t('status.sending');
    btn.disabled = true;

    fetch(form.action, {
      method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }
    }).then(r => {
      if (r.ok) {
        btn.textContent = t('status.sent');
        btn.style.background = 'var(--rose)'; btn.style.color = '#fff';
        form.reset();
      } else {
        btn.textContent = t('status.error');
        btn.style.background = '#c0392b'; btn.style.color = '#fff';
      }
    }).catch(() => {
      btn.textContent = t('status.netError');
      btn.style.background = '#c0392b'; btn.style.color = '#fff';
    }).finally(() => {
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; }, 3000);
    });
  });
}

// ── BOOKING FLOW ─────────────────────────────────────────────
(function() {
  const soinCards = document.querySelectorAll('.soin-card');
  const pills = document.querySelectorAll('.resa__pill');
  const steps = document.querySelectorAll('.resa__step');
  const nextBtns = document.querySelectorAll('.resa__next');
  const soinDisplay = document.getElementById('resa-soin-display');
  const summaryDiv = document.getElementById('resa-summary');
  const dateInput = document.getElementById('resa-date');
  const startBtn = document.getElementById('resa-start-btn');
  if (!pills.length) return;

  let selectedSoin = null;
  const soinNames = {
    essentiel: 'Nova Essentiel — 89 $ (60 min)',
    evasion: 'Nova Évasion — 109 $ (75 min)',
    royal: 'Nova Royal — 129 $ (105 min)'
  };
  const soinDurations = { essentiel: 60, evasion: 75, royal: 105 };

  if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

  // ── VRAIES DISPONIBILITÉS (Supabase) ────────────────────────
  // Tant que js/supabase-config.js n'a pas été configuré avec un
  // vrai projet, supabaseClient est `null` et on garde la liste
  // d'heures statique du HTML — le site continue de fonctionner
  // sans casser pendant la mise en place du backend.
  const timeSelect = document.getElementById('resa-time');

  async function refreshAvailableSlots() {
    if (!timeSelect || !dateInput) return;
    if (typeof supabaseClient === 'undefined' || !supabaseClient) return; // pas encore configuré
    const date = dateInput.value;
    if (!date) return;
    const duration = soinDurations[selectedSoin] || 60;

    timeSelect.innerHTML = `<option value="">${t('resa.checkingSlots')}</option>`;
    timeSelect.disabled = true;

    const { data, error } = await supabaseClient.rpc('get_available_slots', {
      p_date: date,
      p_duration: duration
    });

    timeSelect.disabled = false;

    if (error || !data || !data.length) {
      timeSelect.innerHTML = `<option value="">${t('resa.noSlots')}</option>`;
      return;
    }

    const options = [`<option value="">${t('resa.timePlaceholder')}</option>`]
      .concat(data.map(row => {
        const hhmm = row.slot_time.slice(0, 5); // "09:30:00" -> "09:30"
        return `<option value="${hhmm}">${hhmm.replace(':', ' h ')}</option>`;
      }));
    timeSelect.innerHTML = options.join('');
  }

  if (dateInput) dateInput.addEventListener('change', refreshAvailableSlots);

  function activateStep(n) {
    steps.forEach(s => s.classList.toggle('resa__step--active', parseInt(s.dataset.step) === n));
    // Hide the main CTA once a step is active
    if (startBtn) startBtn.style.display = 'none';
  }

  function selectSoin(id) {
    selectedSoin = id;
    soinCards.forEach(c => c.classList.toggle('is-selected', c.dataset.soin === id));
    pills.forEach(p => p.classList.toggle('is-active', p.dataset.soin === id));
    if (soinDisplay) soinDisplay.textContent = soinNames[id] || id;
    refreshAvailableSlots();
    activateStep(2);
    setTimeout(() => {
      const target = document.getElementById('resa-step-2') || document.getElementById('reservation');
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }, 150);
  }

  // Soin card clicks + keyboard. preventDefault on mousedown stops the browser
  // from scroll-jumping a tall focusable card into view, which fought our scroll.
  soinCards.forEach(c => {
    c.addEventListener('mousedown', e => e.preventDefault());
    c.addEventListener('click', () => selectSoin(c.dataset.soin));
    c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectSoin(c.dataset.soin); } });
  });
  pills.forEach(p => p.addEventListener('click', () => selectSoin(p.dataset.soin)));

  // Step header clicks to expand
  steps.forEach(s => {
    s.querySelector('.resa__step-header').addEventListener('click', () => activateStep(parseInt(s.dataset.step)));
  });

  // Next buttons
  nextBtns.forEach(b => {
    b.addEventListener('click', () => {
      const next = parseInt(b.dataset.next);
      activateStep(next);
      if (next === 4) updateSummary();
    });
  });

  // Start button
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      activateStep(1);
    });
  }

  // Oil chips — toggle detail on tap (mobile) + selection
  document.querySelectorAll('.oil-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('is-tapped'));
  });
  document.querySelectorAll('.oil-chip input').forEach(cb => {
    cb.addEventListener('change', () => cb.closest('.oil-chip').classList.toggle('is-selected', cb.checked));
  });

  const OIL_KEY = {
    lavande: 'oil.lavande.name', eucalyptus: 'oil.eucalyptus.name', menthe: 'oil.menthe.name',
    romarin: 'oil.romarin.name', 'tea-tree': 'oil.teatree.name', ylang: 'oil.ylang.name'
  };

  function updateSummary() {
    if (!summaryDiv) return;
    const oils = Array.from(document.querySelectorAll('input[name="resa-oils"]:checked')).map(c => t(OIL_KEY[c.value] || c.value));
    const date = dateInput ? dateInput.value : '';
    const time = document.getElementById('resa-time');
    const locale = currentLang() === 'en' ? 'en-CA' : 'fr-CA';
    let h = '';
    if (selectedSoin) h += `<strong>${t('summary.soin')} :</strong> ${soinNames[selectedSoin]}<br>`;
    if (oils.length) h += `<strong>${t('summary.huiles')} :</strong> ${oils.join(', ')}<br>`;
    if (date) { const d = new Date(date + 'T12:00:00'); h += `<strong>${t('summary.date')} :</strong> ${d.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>`; }
    if (time && time.value) h += `<strong>${t('summary.heure')} :</strong> ${time.value}<br>`;
    if (h) { summaryDiv.innerHTML = h; summaryDiv.classList.add('is-visible'); }
  }

  const resaForm = document.getElementById('resa-form');
  if (resaForm) resaForm.addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = t('status.sending'); btn.disabled = true;

    // Build full reservation data
    const data = new FormData(form);
    if (selectedSoin) data.append('soin', soinNames[selectedSoin]);
    const oils = Array.from(document.querySelectorAll('input[name="resa-oils"]:checked')).map(c => c.value);
    if (oils.length) data.append('huiles', oils.join(', '));
    const dateVal = dateInput ? dateInput.value : '';
    const timeEl = document.getElementById('resa-time');
    if (dateVal) data.append('date', dateVal);
    if (timeEl && timeEl.value) data.append('heure', timeEl.value);

    // Étape 1: si Supabase est configuré, on réserve le créneau pour de
    // vrai (avec vérification anti-chevauchement côté serveur) AVANT
    // d'envoyer la notification par courriel. Si quelqu'un d'autre vient
    // de prendre ce créneau, on arrête tout et on prévient la cliente.
    if (typeof supabaseClient !== 'undefined' && supabaseClient && dateVal && timeEl && timeEl.value) {
      const { error: bookingError } = await supabaseClient.from('appointments').insert({
        appointment_date: dateVal,
        start_time: timeEl.value,
        duration_minutes: soinDurations[selectedSoin] || 60,
        soin: selectedSoin || 'essentiel',
        prenom: form.prenom.value,
        nom: form.nom.value,
        telephone: form.telephone.value,
        email: form.email.value,
        notes: form.notes ? form.notes.value : '',
        oils: oils.join(', ')
      });

      if (bookingError) {
        btn.textContent = t('resa.slotTaken');
        btn.style.background = '#c0392b'; btn.style.color = '#fff';
        btn.disabled = false;
        refreshAvailableSlots();
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 4000);
        return;
      }
    }

    fetch('https://formspree.io/f/xdarkqrn', {
      method: 'POST', body: data, headers: { 'Accept': 'application/json' }
    }).then(r => {
      if (r.ok) {
        btn.textContent = t('status.requestSent');
        btn.style.background = 'var(--rose)'; btn.style.color = '#fff';
        setTimeout(() => {
          btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; btn.disabled = false;
          form.reset(); selectedSoin = null;
          soinCards.forEach(c => c.classList.remove('is-selected'));
          pills.forEach(p => p.classList.remove('is-active'));
          if (soinDisplay) soinDisplay.textContent = t('resa.step1sub');
          if (summaryDiv) { summaryDiv.classList.remove('is-visible'); summaryDiv.innerHTML = ''; }
          document.querySelectorAll('.oil-chip input').forEach(cb => { cb.checked = false; cb.closest('.oil-chip').classList.remove('is-selected'); });
          activateStep(1);
          if (startBtn) startBtn.style.display = '';
        }, 3000);
      } else {
        btn.textContent = t('status.error');
        btn.style.background = '#c0392b'; btn.style.color = '#fff';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; }, 3000);
      }
    }).catch(() => {
      btn.textContent = t('status.netError');
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; }, 3000);
    });
  });
})();

// ── PROMO POPUP + STRIP ───────────────────────────────────
(function () {
  const popup = document.getElementById('promo-popup');
  const popupClose = document.getElementById('promo-close');
  const popupBackdrop = document.getElementById('promo-backdrop');
  const popupCta = document.getElementById('promo-cta');
  const bar = document.getElementById('promo-bar');
  const barClose = document.getElementById('promo-bar-close');
  if (!popup || !bar) return;

  function updateBarHeight() {
    if (bar.classList.contains('hidden')) {
      document.documentElement.style.setProperty('--promo-h', '0px');
    } else {
      document.documentElement.style.setProperty('--promo-h', bar.getBoundingClientRect().height + 'px');
    }
  }

  function closePopup() {
    popup.classList.add('hidden');
    document.body.style.overflow = '';
    sessionStorage.setItem('nova_promo_popup', '1');
    bar.classList.remove('hidden');
    updateBarHeight();
  }

  function closeBar() {
    bar.classList.add('hidden');
    sessionStorage.setItem('nova_promo_bar', '1');
    updateBarHeight();
  }

  if (sessionStorage.getItem('nova_promo_popup')) {
    popup.classList.add('hidden');
    if (!sessionStorage.getItem('nova_promo_bar')) {
      bar.classList.remove('hidden');
    }
  } else {
    document.body.style.overflow = 'hidden';
  }

  updateBarHeight();
  window.addEventListener('resize', updateBarHeight);

  if (popupClose) popupClose.addEventListener('click', closePopup);
  if (popupBackdrop) popupBackdrop.addEventListener('click', closePopup);
  if (popupCta) popupCta.addEventListener('click', closePopup);
  if (barClose) barClose.addEventListener('click', closeBar);
})();

