/* ========================================
   Molivor Studio — Main JavaScript
   Pure vanilla JS, no dependencies
   ======================================== */

(function () {
  'use strict';

  // --- Scroll Progress Bar ---
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var scrollTop  = window.scrollY;
      var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      var percent    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = percent + '%';
    }, { passive: true });
  }

  // --- Sticky Header ---
  function initStickyHeader() {
    var header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.classList.toggle('header--scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // --- Mobile Menu ---
  function initMobileMenu() {
    var hamburger  = document.querySelector('.hamburger');
    var mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('hamburger--open');
      mobileMenu.classList.toggle('mobile-menu--open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('hamburger--open');
        mobileMenu.classList.remove('mobile-menu--open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var targetId = link.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  // --- Scroll Reveal Animations ---
  // motion-fade-up (new) + .reveal (backwards-compat alias)
  function initRevealAnimations() {
    var elements = document.querySelectorAll('.motion-fade-up, .reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) {
        el.classList.add('is-visible', 'reveal--visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible', 'reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // --- Section-Reactive Color ---
  // Watches data-section elements; sets body[data-theme] as they enter
  // the viewport. CSS @property transitions --gold between sections.
  function initSectionTheme() {
    var sections = document.querySelectorAll('[data-section]');
    if (!sections.length) return;

    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          document.body.dataset.theme = entry.target.dataset.section;
        }
      });
    }, {
      threshold: 0.35   // fires when 35% of section is in view
    });

    sections.forEach(function (s) { observer.observe(s); });
  }

  // --- Accordion ---
  function initAccordion() {
    document.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item   = trigger.closest('.accordion__item');
        var body   = item.querySelector('.accordion__body');
        var isOpen = item.classList.contains('accordion__item--open');

        // Close all siblings in the same accordion
        var accordion = item.closest('.accordion');
        if (accordion) {
          accordion.querySelectorAll('.accordion__item--open').forEach(function (openItem) {
            if (openItem !== item) {
              openItem.classList.remove('accordion__item--open');
              openItem.querySelector('.accordion__body').style.maxHeight = '0';
              openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
            }
          });
        }

        if (isOpen) {
          item.classList.remove('accordion__item--open');
          body.style.maxHeight = '0';
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('accordion__item--open');
          body.style.maxHeight = body.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // --- Contact Form Submission ---
  function initFormValidation() {
    var form = document.querySelector('.form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll('.form__group[data-required]').forEach(function (group) {
        var input   = group.querySelector('.form__input, .form__textarea');
        var errorEl = group.querySelector('.form__error');

        group.classList.remove('form__group--error');

        if (!input.value.trim()) {
          group.classList.add('form__group--error');
          valid = false;
          return;
        }

        if (input.type === 'email' && input.value.trim()) {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            group.classList.add('form__group--error');
            if (errorEl) errorEl.textContent = 'Please enter a valid email address';
            valid = false;
          }
        }
      });

      var phoneInput = form.querySelector('#contact-phone');
      if (phoneInput && phoneInput.value.trim()) {
        var phoneGroup = phoneInput.closest('.form__group');
        var phoneRegex = /^[+]?[0-9\s-]{7,15}$/;
        var hasLetters = /[a-zA-Z]/.test(phoneInput.value);

        if (hasLetters || !phoneRegex.test(phoneInput.value.trim())) {
          phoneGroup.classList.add('form__group--error');
          valid = false;
        } else {
          phoneGroup.classList.remove('form__group--error');
        }
      }

      if (!valid) return;

      var btn         = form.querySelector('.btn');
      var originalHTML = btn.innerHTML;
      btn.textContent  = 'Sending…';
      btn.disabled     = true;
      btn.style.opacity = '0.7';

      var payload = new URLSearchParams(new FormData(form)).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload,
      })
        .then(function (res) {
          if (res.ok) {
            btn.textContent       = '✓ Message sent';
            btn.style.background  = 'var(--success)';
            btn.style.color       = '#fff';
            btn.style.opacity     = '1';
            setTimeout(function () {
              btn.innerHTML        = originalHTML;
              btn.style.background = '';
              btn.style.color      = '';
              btn.disabled         = false;
              form.reset();
            }, 3000);
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          btn.textContent       = 'Network error — try again';
          btn.style.background  = 'var(--error)';
          btn.style.color       = '#fff';
          btn.style.opacity     = '1';
          setTimeout(function () {
            btn.innerHTML        = originalHTML;
            btn.style.background = '';
            btn.style.color      = '';
            btn.disabled         = false;
          }, 3000);
        });
    });
  }

  // --- Newsletter Signup ---
  function initNewsletter() {
    document.querySelectorAll('.footer__newsletter').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var input        = form.querySelector('.footer__newsletter-input');
        var btn          = form.querySelector('.footer__newsletter-btn');
        var email        = input.value.trim();
        if (!email) return;

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          input.style.borderColor = 'var(--error)';
          setTimeout(function () { input.style.borderColor = ''; }, 2000);
          return;
        }

        var originalText = btn.textContent;
        btn.textContent  = '…';
        btn.disabled     = true;

        var payload = new URLSearchParams(new FormData(form)).toString();

        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: payload,
        })
          .then(function (res) {
            if (res.ok) {
              btn.textContent      = '✓';
              btn.style.background = 'var(--success)';
              btn.style.color      = '#fff';
              input.value          = '';
              input.placeholder    = 'Thanks!';
              setTimeout(function () {
                btn.textContent      = originalText;
                btn.style.background = '';
                btn.style.color      = '';
                btn.disabled         = false;
                input.placeholder    = 'Your email';
              }, 3000);
            } else {
              throw new Error('Subscription failed');
            }
          })
          .catch(function () {
            btn.textContent      = '✗';
            btn.style.background = 'var(--error)';
            setTimeout(function () {
              btn.textContent      = originalText;
              btn.style.background = '';
              btn.disabled         = false;
            }, 2000);
          });
      });
    });
  }

  // --- Active Nav Link ---
  function initActiveNav() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(function (link) {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('nav__link--active');
      }
    });
  }

  // --- Hero Clip-Wipe Entrance ---
  // Called after the preloader exits (or immediately if no preloader).
  // Adds .hero--ready to trigger the CSS clip-path transition on .hero__title.
  function fireHeroAnimation() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    // Small resting beat so the transition is perceivable
    setTimeout(function () {
      hero.classList.add('hero--ready');
    }, 120);
  }

  // --- Preloader ---
  function initPreloader() {
    var visited   = sessionStorage.getItem('molivor_visited');
    sessionStorage.setItem('molivor_visited', 'true');

    var preloader = document.getElementById('preloader');

    if (!preloader) {
      // No preloader on this page — fire hero animation right away
      fireHeroAnimation();
      return;
    }

    if (visited) {
      preloader.style.display = 'none';
      fireHeroAnimation();
      return;
    }

    var minTime  = 1500;
    var startTime = Date.now();

    window.addEventListener('load', function () {
      var elapsed   = Date.now() - startTime;
      var remaining = Math.max(0, minTime - elapsed);

      setTimeout(function () {
        preloader.classList.add('preloader--hidden');
        // Fire hero animation after preloader starts fading (0.6s transition)
        setTimeout(fireHeroAnimation, 400);
      }, remaining);
    });
  }

  // --- Initialize Everything ---
  function init() {
    initScrollProgress();
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initRevealAnimations();
    initSectionTheme();
    initAccordion();
    initFormValidation();
    initNewsletter();
    initActiveNav();
    initPreloader();
    initMediaKitModal();
    // Removed: initAmbientOrbs(), initCursorGlow()
  }

  // --- Media Kit Modal ---
  function initMediaKitModal() {
    var modal   = document.getElementById('media-kit-modal');
    var ctaButtons = document.querySelectorAll('[aria-controls="media-kit-modal"], #campus-ad-cta, .open-media-kit-modal');
    var closeBtn= document.getElementById('modal-close');
    var overlay = document.getElementById('modal-overlay');
    var form    = document.getElementById('media-kit-form');
    if (!modal) return;

    var activeTrigger = null;

    function openModal(e) {
      if (e) activeTrigger = e.currentTarget;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      var firstInput = modal.querySelector('input, select, button');
      if (firstInput) setTimeout(function() { firstInput.focus(); }, 50);
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (activeTrigger) activeTrigger.focus();
    }

    ctaButtons.forEach(function(cta) {
      cta.addEventListener('click', openModal);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay)  overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    // Form submission
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll('.form__group[data-required]').forEach(function(group) {
        var input = group.querySelector('.form__input');
        group.classList.remove('form__group--error');
        if (!input || !input.value.trim()) {
          group.classList.add('form__group--error');
          valid = false;
        }
        if (input && input.type === 'email' && input.value.trim()) {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            group.classList.add('form__group--error');
            valid = false;
          }
        }
      });

      if (!valid) return;

      var submitBtn = form.querySelector('[type="submit"]');
      var originalHTML = submitBtn.innerHTML;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      var payload = new URLSearchParams(new FormData(form)).toString();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload
      })
        .then(function(res) {
          if (res.ok) {
            submitBtn.textContent = '✓ Request sent — we\'ll be in touch!';
            submitBtn.style.background = 'var(--success)';
            submitBtn.style.opacity = '1';
            form.reset();
            setTimeout(function() {
              submitBtn.innerHTML = originalHTML;
              submitBtn.style.background = '';
              submitBtn.disabled = false;
              closeModal();
            }, 3000);
          } else { throw new Error(); }
        })
        .catch(function() {
          submitBtn.textContent = 'Network error — try again';
          submitBtn.style.background = 'var(--error)';
          submitBtn.style.opacity = '1';
          setTimeout(function() {
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
