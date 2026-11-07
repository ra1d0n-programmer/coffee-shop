// ===== БУРГЕР =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.classList.toggle('is-active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== ЯЗЫКОВОЙ ПЕРЕКЛЮЧАТЕЛЬ =====
const lang = document.getElementById('lang');
const langBtn = document.getElementById('langBtn');

if (lang && langBtn) {
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = lang.classList.toggle('is-open');
    langBtn.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.lang__item').forEach(btn => {
    btn.addEventListener('click', () => {
      applyLang(btn.dataset.lang);
      lang.classList.remove('is-open');
      langBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!lang.contains(e.target)) {
      lang.classList.remove('is-open');
      langBtn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      lang.classList.remove('is-open');
      langBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===== ХЕДЕР ПРИ СКРОЛЛЕ =====
const header = document.querySelector('.header');

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ===== ПЛАВНЫЙ СКРОЛЛ =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || targetId.length < 2) return;
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const headerHeight = header ? header.offsetHeight : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

// ===== ФОРМА =====
let currentDict = null;
window.addEventListener('langchange', (e) => { currentDict = e.detail.dict; });

const bookingForm = document.getElementById('bookingForm');
const formNote = document.getElementById('formNote');

if (bookingForm && formNote) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const t = (key, fallback) => (currentDict && currentDict[key]) || fallback;
    const data = {
      name: bookingForm.name.value.trim(),
      phone: bookingForm.phone.value.trim(),
      date: bookingForm.date.value,
      time: bookingForm.time.value,
      guests: bookingForm.guests.value,
    };

    if (!data.name || !data.phone || !data.date || !data.time || !data.guests) {
      formNote.textContent = t('form.error', 'Заполни все поля 🙏');
      formNote.style.color = '#e07a5f';
      return;
    }

    formNote.textContent = t('form.sending', 'Отправляем...');
    formNote.style.color = '#a89a8c';

    setTimeout(() => {
      const template = t('form.success', 'Спасибо, {name}! Перезвоним в течение 15 минут ☕');
      formNote.textContent = template.replace('{name}', data.name);
      formNote.style.color = '#d4a373';
      bookingForm.reset();
    }, 900);
  });
}

// ===== МАСКА ТЕЛЕФОНА =====
const phoneInput = document.querySelector('input[name="phone"]');

if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('8')) value = '7' + value.slice(1);
    if (!value.startsWith('7')) value = '7' + value;
    value = value.slice(0, 11);

    let formatted = '+7';
    if (value.length > 1) formatted += ' (' + value.slice(1, 4);
    if (value.length >= 5) formatted += ') ' + value.slice(4, 7);
    if (value.length >= 8) formatted += '-' + value.slice(7, 9);
    if (value.length >= 10) formatted += '-' + value.slice(9, 11);

    e.target.value = formatted;
  });

  phoneInput.addEventListener('focus', (e) => {
    if (!e.target.value) e.target.value = '+7 ';
  });

  phoneInput.addEventListener('blur', (e) => {
    if (e.target.value === '+7 ' || e.target.value === '+7') e.target.value = '';
  });
}

// ===== АНИМАЦИЯ =====
const animatedElements = document.querySelectorAll(
  '.about__inner, .menu__grid, .gallery__grid, .booking__inner, .disclaimer__inner'
);

if (animatedElements.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  animatedElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// ===== МИНИМАЛЬНАЯ ДАТА =====
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}