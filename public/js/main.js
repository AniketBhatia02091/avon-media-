/* ========================================
   Apex Studio — Main JavaScript
   Pure vanilla JS, no dependencies
   ======================================== */

(function () {
  'use strict';

  // --- Scroll Progress Bar ---
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = percent + '%';
    }, { passive: true });
  }

  // --- Sticky Header ---
  function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.classList.toggle('header--scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // --- Mobile Menu ---
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('hamburger--open');
      mobileMenu.classList.toggle('mobile-menu--open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('hamburger--open');
        mobileMenu.classList.remove('mobile-menu--open');
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
      var offset = 80;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  // --- Scroll Reveal Animations ---
  function initRevealAnimations() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('reveal--visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // --- Accordion ---
  function initAccordion() {
    document.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.accordion__item');
        var body = item.querySelector('.accordion__body');
        var isOpen = item.classList.contains('accordion__item--open');

        // Close all siblings in the same accordion
        var accordion = item.closest('.accordion');
        if (accordion) {
          accordion.querySelectorAll('.accordion__item--open').forEach(function (openItem) {
            if (openItem !== item) {
              openItem.classList.remove('accordion__item--open');
              openItem.querySelector('.accordion__body').style.maxHeight = '0';
            }
          });
        }

        // Toggle current
        if (isOpen) {
          item.classList.remove('accordion__item--open');
          body.style.maxHeight = '0';
        } else {
          item.classList.add('accordion__item--open');
          body.style.maxHeight = body.scrollHeight + 'px';
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
        var input = group.querySelector('.form__input, .form__textarea');
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

      // Validating Phone Number specifically
      var phoneInput = form.querySelector('#contact-phone');
      if (phoneInput && phoneInput.value.trim()) {
        var phoneGroup = phoneInput.closest('.form__group');
        // Allows +, -, space, and digits. Must be between 7 and 15 chars.
        // Also rejects if it contains letters (which the user specifically complained about)
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

      var btn = form.querySelector('.btn');
      var originalHTML = btn.innerHTML;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      var formData = new FormData(form);
      var payload = new URLSearchParams(formData).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload,
      })
        .then(function (res) {
          if (res.ok) {
            btn.textContent = '✓ Message sent!';
            btn.style.background = 'var(--success)';
            btn.style.opacity = '1';
            setTimeout(function () {
              btn.innerHTML = originalHTML;
              btn.style.background = '';
              btn.disabled = false;
              form.reset();
            }, 3000);
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          btn.textContent = 'Network error — try again';
          btn.style.background = '#ef4444';
          btn.style.opacity = '1';
          setTimeout(function () {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        });
    });
  }

  // --- Newsletter Signup ---
  function initNewsletter() {
    document.querySelectorAll('.footer__newsletter').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var input = form.querySelector('.footer__newsletter-input');
        var btn = form.querySelector('.footer__newsletter-btn');
        var email = input.value.trim();

        if (!email) return;

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          input.style.borderColor = '#ef4444';
          setTimeout(function () { input.style.borderColor = ''; }, 2000);
          return;
        }

        var originalText = btn.textContent;
        btn.textContent = '...';
        btn.disabled = true;

        var formData = new FormData(form);
        var payload = new URLSearchParams(formData).toString();

        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: payload,
        })
          .then(function (res) {
            if (res.ok) {
              btn.textContent = '✓';
              btn.style.background = 'var(--success)';
              input.value = '';
              input.placeholder = 'Thanks for subscribing!';
              setTimeout(function () {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                input.placeholder = 'Your email';
              }, 3000);
            } else {
              throw new Error('Subscription failed');
            }
          })
          .catch(function () {
            btn.textContent = '✗';
            btn.style.background = '#ef4444';
            setTimeout(function () {
              btn.textContent = originalText;
              btn.style.background = '';
              btn.disabled = false;
            }, 2000);
          });
      });
    });
  }

  // --- Active Nav Link ---
  function initActiveNav() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('nav__link--active');
      }
    });
  }

  // --- Dynamic Cursor Glow ---
  function initCursorGlow() {
    var glow = document.createElement('div');
    glow.classList.add('cursor-glow');
    document.body.appendChild(glow);

    var mouseX = 0;
    var mouseY = 0;
    var glowX = 0;
    var glowY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      // Smooth lerp
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;

      glow.style.transform = 'translate(' + (glowX - 300) + 'px, ' + (glowY - 300) + 'px)';
      requestAnimationFrame(animate);
    }

    animate();
  }

  // --- Ambient Orbs ---
  function initAmbientOrbs() {
    var container = document.createElement('div');
    container.classList.add('orb-container');

    var orb1 = document.createElement('div');
    orb1.classList.add('orb', 'orb--1');

    var orb2 = document.createElement('div');
    orb2.classList.add('orb', 'orb--2');

    var orb3 = document.createElement('div');
    orb3.classList.add('orb', 'orb--3');

    container.appendChild(orb1);
    container.appendChild(orb2);
    container.appendChild(orb3);

    document.body.prepend(container);
  }

  // --- Preloader ---
  function initPreloader() {
    // Always mark as visited for this session, regardless of page
    const visited = sessionStorage.getItem('apex_visited');
    sessionStorage.setItem('apex_visited', 'true');

    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Check if user has already visited in this session
    if (visited) {
      preloader.style.display = 'none';
      return;
    }

    // Mark as visited for this session
    sessionStorage.setItem('apex_visited', 'true');

    // Minimum display time for the animation (1.5s)
    const minTime = 1500;
    const startTime = Date.now();

    window.addEventListener('load', function () {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minTime - elapsedTime);

      setTimeout(function () {
        preloader.classList.add('preloader--hidden');
      }, remainingTime);
    });
  }

  // --- Initialize Everything ---
  function init() {
    initScrollProgress();
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initRevealAnimations();
    initAccordion();
    initFormValidation();
    initNewsletter();
    initActiveNav();
    initCursorGlow();
    initAmbientOrbs();
    initPreloader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

