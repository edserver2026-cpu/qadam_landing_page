/* Qadam landing — interactions */
(function () {
  'use strict';

  var DICT = window.QADAM_I18N || {};
  var DEFAULT_LANG = 'kk';
  var STORAGE_KEY = 'qadam.lang';

  /* ---------------- i18n ---------------- */
  function applyLang(lang) {
    var dict = DICT[lang] || DICT[DEFAULT_LANG];
    if (!dict) return;

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = dict[el.dataset.i18n];
      if (value === undefined) return;
      if (el.hasAttribute('data-i18n-html')) el.innerHTML = value;
      else el.textContent = value;
    });

    if (dict['meta.title']) document.title = dict['meta.title'];
    var desc = document.querySelector('meta[name="description"]');
    if (desc && dict['meta.desc']) desc.setAttribute('content', dict['meta.desc']);

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function initialLang() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (stored && DICT[stored]) return stored;
    return DEFAULT_LANG;
  }

  var selects = document.querySelectorAll('.lang-select');
  var lang = initialLang();

  selects.forEach(function (select) {
    select.value = lang;
    select.addEventListener('change', function () {
      /* keep the header and the mobile-menu switcher in sync */
      selects.forEach(function (other) { other.value = select.value; });
      applyLang(select.value);
      closeMobileMenu();
    });
  });
  applyLang(lang);

  /* ---------------- MVP modal ---------------- */
  var modal = document.getElementById('mvp-modal');
  var lastFocused = null;

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    var ok = modal.querySelector('.btn');
    if (ok) ok.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  /* every sign-up / log-in / plan button opens the MVP notice */
  document.addEventListener('click', function (e) {
    var cta = e.target.closest('[data-cta]');
    if (cta) {
      e.preventDefault();
      closeMobileMenu();
      openModal();
      return;
    }
    if (e.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); closeMobileMenu(); }
  });

  /* ---------------- sticky header shadow ---------------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- mobile menu ---------------- */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobile-menu');

  function closeMobileMenu() {
    if (!mobileMenu || mobileMenu.hidden) return;
    mobileMenu.hidden = true;
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      var willOpen = mobileMenu.hidden;
      mobileMenu.hidden = !willOpen;
      burger.setAttribute('aria-expanded', String(willOpen));
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobileMenu);
    });
  }

  /* ---------------- FAQ: one open at a time ---------------- */
  var faqItems = document.querySelectorAll('.faq details');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
})();
