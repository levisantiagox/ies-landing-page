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

  }

  // ============================================
  // 3. GSAP + ScrollTrigger Setup
  // ============================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis with ScrollTrigger (single RAF via GSAP ticker)
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

  var stickyTicking = false;
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

  function onStickyScroll() {
    if (!stickyTicking) {
      requestAnimationFrame(function () {
        updateStickyCta();
        stickyTicking = false;
      });
      stickyTicking = true;
    }
  }

  window.addEventListener('scroll', onStickyScroll, { passive: true });
  window.addEventListener('resize', onStickyScroll, { passive: true });

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
  // 7. Form Submission — GHL API
  // ============================================
  var GHL_LOCATION_ID = 'MB0FQsSH7cixhHGS0hq0';
  var GHL_PIT = 'pit-7264cdc8-3a9d-4faa-88b8-5095be6f3c9d';
  var GHL_API = 'https://services.leadconnectorhq.com';

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

      // Honeypot check — if filled, silently reject (bot)
      var honeypot = form.querySelector('#company_url');
      if (honeypot && honeypot.value) {
        console.log('[IES] Honeypot triggered — submission blocked.');
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'SUBMITTING...';
      submitBtn.disabled = true;

      var payload = {
        firstName: form.first_name.value.trim(),
        lastName: form.last_name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        companyName: form.organisation.value.trim(),
        website: form.website.value.trim() || undefined,
        locationId: GHL_LOCATION_ID,
        tags: ['cracka workshop'],
        source: 'Cracka Systems - IES Landing Page'
      };

      var ghlHeaders = {
        'Authorization': 'Bearer ' + GHL_PIT,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      };

      // Step 1: Create/update contact with tag
      fetch(GHL_API + '/contacts/', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify(payload)
      })
      .then(function (res) {
        if (!res.ok) throw new Error('GHL contact error: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var contactId = data.contact.id;

        // Step 2: Create opportunity in Online Tradies Workshop pipeline
        return fetch(GHL_API + '/opportunities/', {
          method: 'POST',
          headers: ghlHeaders,
          body: JSON.stringify({
            pipelineId: 'mwois8wGmq2K2tyGuV3j',
            pipelineStageId: '32d46166-94ee-4424-8fa3-21cc484665fa',
            locationId: GHL_LOCATION_ID,
            contactId: contactId,
            name: payload.firstName + ' ' + payload.lastName + ' — Cracka Workshop',
            status: 'open',
            source: 'Cracka Systems - IES Landing Page'
          })
        });
      })
      .then(function (res) {
        if (!res.ok) throw new Error('GHL opportunity error: ' + res.status);
        return res.json();
      })
      .then(function () {
        trackEvent('workshop_register');
        window.location.href = 'thank-you/';
      })
      .catch(function (err) {
        console.error('[IES] Form submission failed:', err);
        submitBtn.textContent = 'SOMETHING WENT WRONG — TRY AGAIN';
        submitBtn.disabled = false;
        submitBtn.style.background = '#ff4444';
        setTimeout(function () {
          submitBtn.textContent = 'YES, SAVE MY SEAT (IT\'S FREE)';
          submitBtn.style.background = '';
        }, 3000);
      });
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
