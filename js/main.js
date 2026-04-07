/* ============================================
   IES Landing Page — Main JavaScript
   GSAP + Lenis + Dynamic Date + Tracking
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // 1. Dynamic Date — Next Thursday
  // ============================================
  function getNextThursday() {
    var now = new Date();
    var day = now.getDay(); // 0=Sun, 4=Thu
    var daysUntil = (4 - day + 7) % 7;
    // If today is Thursday, next Thursday is 7 days away
    if (daysUntil === 0) daysUntil = 7;
    var next = new Date(now);
    next.setDate(now.getDate() + daysUntil);
    return next;
  }

  function formatDate(d) {
    var months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function injectDynamicDate() {
    var dateStr = formatDate(getNextThursday());
    var els = document.querySelectorAll('.dynamic-date');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = dateStr;
    }
    // Update meta description
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content',
        'Free live workshop for metal roofers, fencers, gate fabricators and roof restorers. Watch a working enquiry-to-estimate system get built live in 44 minutes. Thursday ' + dateStr + ' at 4pm AEST.'
      );
    }
  }

  injectDynamicDate();

  // ============================================
  // 2. Lenis Smooth Scroll
  // ============================================
  var lenis = null;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ============================================
  // 3. GSAP + ScrollTrigger Setup
  // ============================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis with ScrollTrigger
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // Skip animations if reduced motion
    if (prefersReduced) {
      gsap.globalTimeline.timeScale(1000);
    }

    // --- Top bar slide in ---
    var topBar = document.getElementById('top-bar');
    if (topBar) {
      gsap.to(topBar, {
        duration: 0.6,
        ease: 'power2.out',
        onStart: function () { topBar.classList.add('is-visible'); }
      });
    }

    // --- Hero H1 word-by-word reveal ---
    var heroLines = document.querySelectorAll('.hero__line');
    if (heroLines.length) {
      gsap.from(heroLines, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3
      });
    }

    // --- Hero subhead fade in ---
    var heroSubhead = document.querySelector('.hero__subhead');
    if (heroSubhead) {
      gsap.from(heroSubhead, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.9,
        ease: 'power2.out'
      });
    }

    // --- Hero proof line slide in ---
    var heroProof = document.querySelector('.hero__proof');
    if (heroProof) {
      gsap.from(heroProof, {
        opacity: 0,
        x: -40,
        duration: 0.6,
        delay: 1.2,
        ease: 'power2.out'
      });
    }

    // --- Hero visual parallax ---
    var heroVisual = document.querySelector('.hero__visual');
    if (heroVisual) {
      gsap.to(heroVisual, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // --- Section reveals ---
    var revealHeadings = document.querySelectorAll('[data-gsap="reveal"]');
    revealHeadings.forEach(function (el) {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // --- Problem punches stagger ---
    var punches = document.querySelectorAll('.punch');
    if (punches.length) {
      gsap.from(punches, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.punches',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        onComplete: function () {
          punches.forEach(function (p) { p.classList.add('is-visible'); });
        }
      });
    }

    // --- Case study cards stagger + number counter ---
    var caseCards = document.querySelectorAll('.case-card');
    if (caseCards.length) {
      gsap.from(caseCards, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.case-grid',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        onComplete: function () {
          caseCards.forEach(function (c) { c.classList.add('is-visible'); });
        }
      });
    }

    // --- Outcome blocks slide in from left ---
    var outcomeBlocks = document.querySelectorAll('.outcome-block');
    if (outcomeBlocks.length) {
      gsap.from(outcomeBlocks, {
        x: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.outcome-blocks',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        onComplete: function () {
          outcomeBlocks.forEach(function (b) { b.classList.add('is-visible'); });
        }
      });
    }

    // --- Bonus items stagger ---
    var bonusItems = document.querySelectorAll('.bonus-item');
    if (bonusItems.length) {
      gsap.from(bonusItems, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.bonus-list',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        onComplete: function () {
          bonusItems.forEach(function (b) { b.classList.add('is-visible'); });
        }
      });
    }
  }

  // ============================================
  // 4. Sticky Mobile CTA visibility
  // ============================================
  var stickyCta = document.getElementById('sticky-mobile-cta');
  var heroSection = document.getElementById('hero');
  var registerSection = document.getElementById('register');

  function updateStickyCta() {
    if (!stickyCta || !heroSection || !registerSection) return;
    if (window.innerWidth > 640) {
      stickyCta.classList.remove('is-visible');
      stickyCta.setAttribute('aria-hidden', 'true');
      return;
    }

    var heroBottom = heroSection.getBoundingClientRect().bottom;
    var registerTop = registerSection.getBoundingClientRect().top;
    var viewportHeight = window.innerHeight;

    if (heroBottom < 0 && registerTop > viewportHeight) {
      stickyCta.classList.add('is-visible');
      stickyCta.setAttribute('aria-hidden', 'false');
    } else {
      stickyCta.classList.remove('is-visible');
      stickyCta.setAttribute('aria-hidden', 'true');
    }
  }

  window.addEventListener('scroll', updateStickyCta, { passive: true });
  window.addEventListener('resize', updateStickyCta, { passive: true });

  // ============================================
  // 5. FAQ Accordion
  // ============================================
  var faqButtons = document.querySelectorAll('.faq-item__question');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-item__answer');
      var isOpen = item.getAttribute('data-open') === 'true';

      // Close all others
      document.querySelectorAll('.faq-item').forEach(function (other) {
        if (other !== item) {
          other.setAttribute('data-open', 'false');
          other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-item__answer').hidden = true;
        }
      });

      // Toggle this one
      item.setAttribute('data-open', isOpen ? 'false' : 'true');
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      answer.hidden = isOpen;
    });
  });

  // ============================================
  // 6. Tracking Events
  // ============================================
  function trackEvent(eventName) {
    // Facebook Pixel
    if (typeof fbq === 'function') {
      fbq('trackCustom', eventName);
    }
    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', eventName);
    }
    // Console log for testing
    console.log('[IES Track]', eventName);
  }

  // Track all elements with data-track attribute
  var trackEls = document.querySelectorAll('[data-track]');
  trackEls.forEach(function (el) {
    el.addEventListener('click', function () {
      trackEvent(el.getAttribute('data-track'));
    });
  });

  // ============================================
  // 7. Form Submission (placeholder)
  // ============================================
  var form = document.getElementById('register-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      var fields = form.querySelectorAll('[required]');
      var valid = true;
      fields.forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#ff4444';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      trackEvent('workshop_register');

      // TODO: Replace with actual GHL form submission
      // For now, show success feedback
      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'REGISTERED! CHECK YOUR EMAIL.';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      console.log('[IES] Form submitted. Replace this with GHL API call.');
    });
  }

  // ============================================
  // 8. Smooth scroll for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      if (lenis) {
        lenis.scrollTo(target, { offset: -60 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
