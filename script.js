// Supabase Configuration
const SUPABASE_URL = 'https://ujcqwbkxbkvastfkbxas.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqY3F3Ymt4Ymt2YXN0ZmtieGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNDY1ODQsImV4cCI6MjA5MzYyMjU4NH0.5PhXC8QKIrAxMXg9uMHufPIb2EtULINLsway4IHu3qQ';

let supabaseClient = null;
if (typeof window !== 'undefined' && window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Notification system
function injectNotificationStyles() {
  if (document.getElementById('vantade-notif-styles')) return;
  const s = document.createElement('style');
  s.id = 'vantade-notif-styles';
  s.textContent = `
    .vantade-notif {
      position: fixed; top: 24px; right: 24px; z-index: 99999;
      padding: 16px 24px; border-radius: 12px; color: #fff;
      font-weight: 600; font-size: 15px; max-width: 360px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2);
      animation: vNotifIn 0.4s ease forwards;
    }
    .vantade-notif.success { background: #0D9488; }
    .vantade-notif.error   { background: #dc2626; }
    .vantade-notif.hide    { animation: vNotifOut 0.4s ease forwards; }
    @keyframes vNotifIn  { from { opacity:0; transform:translateX(80px); } to { opacity:1; transform:translateX(0); } }
    @keyframes vNotifOut { from { opacity:1; transform:translateX(0);    } to { opacity:0; transform:translateX(80px); } }
  `;
  document.head.appendChild(s);
}

function showNotification(message, type = 'success') {
  injectNotificationStyles();
  const el = document.createElement('div');
  el.className = `vantade-notif ${type}`;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => {
    el.classList.add('hide');
    setTimeout(() => el.remove(), 450);
  }, 4200);
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navList  = document.querySelector('.nav-list');

if (navToggle && navList) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navList.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', open);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header') && navList.classList.contains('active')) {
      navList.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Smooth scroll for data-target links
document.querySelectorAll('[data-target]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.dataset.target;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', window.location.pathname + window.location.search);
  });
});

// Header shadow on scroll
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 50
      ? '0 4px 20px rgba(0,0,0,0.12)'
      : 'none';
  }, { passive: true });
}

// Active nav link highlighting
function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link[data-target]');
  let current = '';
  sections.forEach(sec => {
    if (sec.getBoundingClientRect().top <= 130) current = sec.id;
  });
  links.forEach(link => link.classList.toggle('active', link.dataset.target === current));
}
window.addEventListener('scroll', highlightActiveNav, { passive: true });

// Supabase insert helper
async function insertContactSubmission(payload) {
  if (!supabaseClient) {
    console.warn('Supabase not initialised — check CDN script loaded before script.js');
    return { error: new Error('Supabase not initialised') };
  }
  return await supabaseClient
    .from('contact_submissions')
    .insert([{ ...payload, submitted_at: new Date().toISOString() }]);
}

// Hero quick form
const heroQuickForm = document.getElementById('heroQuickForm');
if (heroQuickForm) {
  heroQuickForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = heroQuickForm.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const fd = new FormData(heroQuickForm);
    const { error } = await insertContactSubmission({
      name:    fd.get('name')    || null,
      email:   fd.get('email')   || null,
      message: fd.get('message') || null,
      source:  window.location.pathname
    });

    if (error) {
      showNotification('Something went wrong. Please try again.', 'error');
      console.error(error);
    } else {
      showNotification('Thank you! We will reach out soon.');
      heroQuickForm.reset();
    }
    btn.textContent = orig;
    btn.disabled = false;
  });
}

// Contact banner inline form
const contactBannerForm = document.getElementById('contactForm');
if (contactBannerForm) {
  contactBannerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactBannerForm.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const fd = new FormData(contactBannerForm);
    const { error } = await insertContactSubmission({
      name:     fd.get('name')       || null,
      phone:    fd.get('mobile')     || null,
      email:    fd.get('email')      || null,
      services: fd.get('technology') || null,
      source:   window.location.pathname
    });

    if (error) {
      showNotification('Something went wrong. Please try again.', 'error');
      console.error(error);
    } else {
      showNotification('Thank you! We will be in touch shortly.');
      contactBannerForm.reset();
    }
    btn.textContent = orig;
    btn.disabled = false;
  });
}

// Main contact form (full)
const mainContactForm = document.getElementById('mainContactForm');
if (mainContactForm) {
  mainContactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = mainContactForm.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const fd = new FormData(mainContactForm);
    const { error } = await insertContactSubmission({
      name:    fd.get('name')    || null,
      email:   fd.get('email')   || null,
      company: fd.get('company') || null,
      phone:   fd.get('phone')   || null,
      message: fd.get('message') || null,
      services: fd.get('service') || null,
      budget:  fd.get('budget')  || null,
      source:  window.location.pathname
    });

    if (error) {
      showNotification('Something went wrong. Please try again.', 'error');
      console.error(error);
    } else {
      showNotification('Thank you! Your message has been sent.');
      mainContactForm.reset();
    }
    btn.textContent = orig;
    btn.disabled = false;
  });
}

// Newsletter forms
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn   = form.querySelector('button[type="submit"]');
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value.trim()) return;
    const orig = btn.textContent;
    btn.textContent = 'Subscribing…';
    btn.disabled = true;

    if (!supabaseClient) {
      showNotification('Newsletter service unavailable.', 'error');
      btn.textContent = orig;
      btn.disabled = false;
      return;
    }

    const { error } = await supabaseClient
      .from('newsletter_subscribers')
      .insert([{ email: input.value.trim(), subscribed_at: new Date().toISOString() }]);

    if (error && error.code === '23505') {
      showNotification('You are already subscribed!');
    } else if (error) {
      showNotification('Something went wrong. Please try again.', 'error');
      console.error(error);
    } else {
      showNotification('Thank you for subscribing!');
      form.reset();
    }
    btn.textContent = orig;
    btn.disabled = false;
  });
});

// Scroll reveal animations
const revealTargets = document.querySelectorAll(
  '.project-card, .team-card, .team-card-link, .service-card-v2, .why-card, .skill-card, .partner-logo, .hero-content, .hero-image-wrap'
);
revealTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));
