/* ============================================================
   NOVA HEAD SPA — Script v4
   Features: i18n FR/EN, oils selector, slider, nav, reveal
   ============================================================ */

// ── i18n TRANSLATIONS ─────────────────────────────────────────
const translations = {
  en: {
    skip: "Skip to main content",
    cookie_title: "Privacy notice",
    cookie_text: 'This site does not use tracking cookies. Only essential cookies are used. <a href="confidentialite.html">Learn more</a>',
    cookie_accept: "Got it",
    cookie_policy: "Policy",
    nav_services: "Services",
    nav_tarifs: "Pricing",
    nav_oils: "Oils",
    nav_gift: "Gift card",
    nav_about: "Our story",
    nav_contact: "Contact",
    nav_book: "Book now",
    nav_privacy: "Privacy",
    hero_eyebrow: "Head spa · Treatments · Wellness",
    hero_title: 'Your moment<br>of <em>light.</em>',
    hero_subtitle: "Head spa, personalized treatments, and complete wellness.<br>For everyone who deserves a moment of light.",
    hero_cta: "Book an appointment",
    hero_discover: "Discover our services",
    strip_1: "Relaxation",
    strip_2: "Wellness",
    strip_3: "Glow",
    strip_4: "For everyone",
    services_label: "What we offer",
    services_title: "Our services",
    services_note: "Each treatment is tailored to your scalp — because no two are alike. Open to all.",
    svc_lumiere: "Light Treatment",
    svc_lumiere_desc: "Express consultation, relaxing essential oil massage, and tailored base treatment. 60 minutes.",
    svc_rituel: "Nova Ritual",
    svc_signature: "Signature",
    svc_rituel_desc: "Deep scalp and neck massage, premium targeted treatment, steam mask and cascade rinse. 90 minutes.",
    svc_revelation: "Scalp Revelation",
    svc_revelation_desc: "In-depth scalp analysis with precise diagnosis and personalized recommendations. Add-on to any treatment.",
    svc_duo: "Duo Glow",
    svc_duo_badge: "For two",
    svc_duo_desc: "Two Light Treatments simultaneously, for couples or friends. Wellness shared. 90 minutes.",
    oils_label: "Personalize your experience",
    oils_title: 'Choose your <em>oils.</em>',
    oils_subtitle: "Select your preferred scents before your appointment. We'll prepare your custom blend.",
    oil_lavande: "Lavender",
    oil_lavande_fx: "Soothing · Anti-stress",
    oil_eucalyptus: "Eucalyptus",
    oil_eucalyptus_fx: "Invigorating · Clarity",
    oil_menthe: "Peppermint",
    oil_menthe_fx: "Refreshing · Energy",
    oil_romarin: "Rosemary",
    oil_romarin_fx: "Stimulating · Growth",
    oil_teatree: "Tea Tree",
    oil_teatree_fx: "Purifying · Balance",
    oil_ylang: "Ylang-Ylang",
    oil_ylang_fx: "Relaxing · Sensorial",
    oils_chosen: "Your selection:",
    oils_note: "Mention your choices when booking or we'll prepare them for you.",
    cta_text: "By appointment only — to give you our full attention.",
    cta_btn: "Book now",
    about_label: "Our story",
    about_title: 'Care is<br><em>a calling.</em>',
    about_p1: "Nova was born from a deep conviction: self-care starts from the top. A growing family business, open to everyone — with the ambition to go far beyond head spa.",
    about_p2: "Giovanna Minoletti, certified practitioner, founded Nova in Napierville as a starting point. New services and new locations are in the works — because wellness should be accessible to all, everywhere.",
    val_1: "Personalized care",
    val_2: "Open to all",
    val_3: "Relaxing atmosphere",
    tarifs_label: "Pricing",
    tarifs_title: 'An investment <em>in you.</em>',
    tarif_lumiere: "Light Treatment",
    tarif_60: "60 minutes",
    tarif_l1: "Express scalp consultation",
    tarif_l2: "Relaxing essential oil massage",
    tarif_l3: "Tailored base treatment",
    tarif_l4: "Rinse and light styling",
    tarif_book: "Book",
    tarif_fav: "Favourite",
    tarif_rituel: "Nova Ritual",
    tarif_90: "90 minutes",
    tarif_r1: "In-depth personalized consultation",
    tarif_r2: "Deep scalp & neck massage",
    tarif_r3: "Targeted premium treatment",
    tarif_r4: "Nourishing steam mask",
    tarif_r5: "Cascade rinse & styling included",
    extras_title: "À la carte",
    ext_massage: "Neck & shoulder massage",
    ext_hydra: "Hydration treatment",
    ext_diag: "Scalp diagnosis",
    ext_keratine: "Keratin smoothing",
    ext_devis: "On quote",
    forf_5: "Loyalty Card — 5 treatments",
    forf_5_desc: "Save $50 · Valid 12 months",
    forf_abo: "Monthly Subscription",
    forf_abo_desc: "2 treatments/month · Save $20/month",
    gift_label: "Gift Nova",
    gift_title: 'The best gift?<br>A moment <em>just for yourself.</em>',
    gift_desc: "Gift cards available in any amount. Birthday, holiday, or just because someone deserves it.",
    gift_free: "Custom amount",
    gift_cta: "Order · (579) 366-0433",
    gift_note: "By phone or in studio",
    resa_label: "Appointment",
    resa_title: 'Your moment of light<br><em>starts here.</em>',
    step_1: "Choose your treatment",
    step_2: "Select your oils",
    step_3: "Pick a date",
    step_4: "Release your tension",
    resa_cta: "Book an appointment →",
    resa_phone: 'Or call us: <a href="tel:5793660433">(579) 366-0433</a>',
    contact_label: "Find us",
    contact_title: "Visit the studio",
    contact_sub: '<strong>261A, rue de l\'Église, Napierville, QC</strong><br>By appointment · Monday to Saturday',
    addr_label: "Address",
    phone_label: "Phone",
    map_link: "Open in Google Maps →",
    form_first: "First name",
    form_last: "Last name",
    form_email: "Email",
    form_msg: "Message",
    form_notice: 'Your data is used only to respond to your message. <a href="confidentialite.html">Privacy policy</a>',
    form_send: "Send",
    footer_tag: "Head spa · Treatments · Wellness — For everyone — Expanding",
    footer_map: "📍 261A, rue de l'Église, Napierville — Open in Google Maps",
    footer_rights: "All rights reserved."
  }
};

// Store original FR text
const frTexts = {};

function initI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    frTexts[el.getAttribute('data-i18n')] = el.innerHTML;
  });
}

function setLang(lang) {
  document.documentElement.lang = lang;
  const toggle = document.getElementById('lang-toggle');

  if (lang === 'en') {
    toggle.textContent = 'FR';
    toggle.setAttribute('aria-label', 'Passer en français');
    toggle.setAttribute('title', 'Français');
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations.en[key]) el.innerHTML = translations.en[key];
    });
  } else {
    toggle.textContent = 'EN';
    toggle.setAttribute('aria-label', 'Switch to English');
    toggle.setAttribute('title', 'English');
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (frTexts[key]) el.innerHTML = frTexts[key];
    });
  }

  localStorage.setItem('nova_lang', lang);
}

// ── NAV SCROLL ────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HERO LOADED ───────────────────────────────────────────────
window.addEventListener('load', () => {
  const hero = document.querySelector('.hero');
  if (hero) hero.classList.add('is-loaded');
});

// ── SCROLL REVEAL ─────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => obs.observe(el));

// ── MOBILE MENU ───────────────────────────────────────────────
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

  navMenu.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      navbar.classList.remove('is-nav-open');
      document.body.style.overflow = '';
    });
  });
}

// ── LANG TOGGLE ───────────────────────────────────────────────
initI18n();
const langToggle = document.getElementById('lang-toggle');
let currentLang = localStorage.getItem('nova_lang') || 'fr';

if (currentLang === 'en') setLang('en');

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'fr' ? 'en' : 'fr';
  setLang(currentLang);
});

// ── COOKIE CONSENT ────────────────────────────────────────────
function acceptCookies() {
  const banner = document.getElementById('cookie-consent');
  if (banner) banner.remove();
  localStorage.setItem('nova_cookie_consent', 'accepted');
}
(function() {
  if (localStorage.getItem('nova_cookie_consent')) {
    const banner = document.getElementById('cookie-consent');
    if (banner) banner.remove();
  }
})();

// ── SMOOTH SCROLL ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + scrollY - 80,
        behavior: 'smooth'
      });
    }
  });
});

// ── FORM SUBMIT ───────────────────────────────────────────────
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const origText = btn.textContent;
  btn.textContent = currentLang === 'en' ? 'Message sent ✓' : 'Message envoyé ✓';
  btn.style.background = 'var(--gold)';
  btn.style.color = 'var(--bg-dark)';
  setTimeout(() => {
    btn.textContent = origText;
    btn.style.background = '';
    btn.style.color = '';
    e.target.reset();
  }, 3000);
}

// ── OILS SELECTOR ─────────────────────────────────────────────
(function() {
  const checkboxes = document.querySelectorAll('input[name="oils"]');
  const selectionDiv = document.getElementById('oils-selection');
  const tagsDiv = document.getElementById('oils-tags');
  if (!checkboxes.length) return;

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateOilSelection);
  });

  function updateOilSelection() {
    const selected = Array.from(checkboxes).filter(cb => cb.checked);

    if (selected.length > 0) {
      selectionDiv.hidden = false;
      tagsDiv.innerHTML = selected.map(cb => {
        const card = cb.closest('.oil-card');
        const name = card.querySelector('.oil-card__name').textContent;
        return `<span class="oils__tag">${name}</span>`;
      }).join('');
    } else {
      selectionDiv.hidden = true;
      tagsDiv.innerHTML = '';
    }
  }
})();

// ── SALON SLIDER ──────────────────────────────────────────────
(function() {
  const track = document.getElementById('slider-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');
  if (!track) return;

  const slides = track.querySelectorAll('.salon-slider__slide');
  let current = 0;
  const total = slides.length;

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'salon-slider__dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.salon-slider__dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo((current - 1 + total) % total));
  nextBtn.addEventListener('click', () => goTo((current + 1) % total));

  setInterval(() => goTo((current + 1) % total), 5000);
})();
