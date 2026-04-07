/* ============================================
   CRO Stitch Elements — JavaScript
   Scroll progress, social proof toasts,
   stitch reveal on scroll
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // 1. Scroll Progress Bar (RAF-throttled)
  // ============================================
  var progressBar = document.getElementById('scroll-progress');
  var progressTicking = false;

  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  function onProgressScroll() {
    if (!progressTicking) {
      requestAnimationFrame(function () {
        updateProgress();
        progressTicking = false;
      });
      progressTicking = true;
    }
  }

  window.addEventListener('scroll', onProgressScroll, { passive: true });
  updateProgress();

  // ============================================
  // 2. Social Proof Toasts
  // ============================================
  var toast = document.getElementById('social-proof-toast');
  var toastName = toast ? toast.querySelector('.toast__name') : null;
  var toastAction = toast ? toast.querySelector('.toast__action') : null;

  var proofNames = [
    'A roofer in Ipswich',
    'A fencer in Penrith',
    'A gate fabricator in Logan',
    'A roof restorer in Campbelltown',
    'A metal roofer in Geelong',
    'A fencing contractor in Caboolture',
    'A fabricator in Dandenong',
    'A roofer in Townsville',
    'A fencer in Wollongong',
    'A gate builder in Rockingham',
    'A roof restorer in Toowoomba',
    'A metal roofer in Bendigo',
    'A fencing business in Cairns',
    'A fabricator in Frankston',
    'A roofer in Mackay'
  ];

  var proofActions = [
    'Registered just now',
    'Saved their seat 3 minutes ago',
    'Just signed up',
    'Registered 12 minutes ago',
    'Saved their seat',
    'Registered 25 minutes ago',
    'Just locked in a spot',
    'Signed up 8 minutes ago'
  ];

  function randomProofEntry() {
    var name = proofNames[Math.floor(Math.random() * proofNames.length)];
    var action = proofActions[Math.floor(Math.random() * proofActions.length)];
    return { name: name, action: action };
  }

  var toastTimer = null;
  var toastHideTimer = null;
  var toastsPaused = false;

  function showToast() {
    if (!toast || !toastName || !toastAction || toastsPaused) return;

    // Clear any pending hide
    if (toastHideTimer) clearTimeout(toastHideTimer);

    var entry = randomProofEntry();
    toastName.textContent = entry.name;
    toastAction.textContent = entry.action;

    toast.classList.add('is-visible');
    toast.setAttribute('aria-hidden', 'false');

    // Hide after 4 seconds
    toastHideTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
      toast.setAttribute('aria-hidden', 'true');
      toastHideTimer = null;
    }, 4000);

  }

  function scheduleNextToast() {
    // Clear any existing scheduled toast to prevent duplicates
    if (toastTimer) clearTimeout(toastTimer);
    if (toastsPaused) return;

    var delay = 15000 + Math.random() * 10000; // 15-25s
    toastTimer = setTimeout(function () {
      showToast();
      scheduleNextToast();
    }, delay);
  }

  setTimeout(function () {
    showToast();
    scheduleNextToast();
  }, 8000);

  // Pause toasts when user is on the registration form
  var registerSection = document.getElementById('register');
  if (registerSection) {
    var registerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          toastsPaused = true;
          if (toastTimer) clearTimeout(toastTimer);
          if (toastHideTimer) clearTimeout(toastHideTimer);
          toast.classList.remove('is-visible');
          toast.setAttribute('aria-hidden', 'true');
        } else {
          toastsPaused = false;
          scheduleNextToast();
        }
      });
    }, { threshold: 0.3 });
    registerObserver.observe(registerSection);
  }

  // ============================================
  // 3. Stitch Connectors — Fade in on scroll
  // ============================================
  var stitchEls = document.querySelectorAll('.stitch-connector, .stitch-micro-cta');

  if (stitchEls.length && typeof IntersectionObserver !== 'undefined') {
    var stitchObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          stitchObserver.unobserve(entry.target); // one-shot, then release
        }
      });
    }, { threshold: 0.5 });

    stitchEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      stitchObserver.observe(el);
    });
  }

  // ============================================
  // 4. Urgency — Seat count animation
  // ============================================
  var seatsEl = document.getElementById('seats-remaining');

  if (seatsEl) {
    var seatsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = parseInt(seatsEl.textContent, 10);
          var current = 11;
          var interval = setInterval(function () {
            current--;
            seatsEl.textContent = current;
            if (current <= target) clearInterval(interval);
          }, 120);
          seatsObserver.disconnect(); // fully release observer
        }
      });
    }, { threshold: 0.5 });

    seatsObserver.observe(seatsEl);
  }

  // ============================================
  // 5. Vimeo Player Controls
  // ============================================
  var unmuteBtn = document.getElementById('unmute-btn');
  var playPauseBtn = document.getElementById('playpause-btn');
  var vimeoIframe = document.getElementById('hero-vimeo');

  if (vimeoIframe && typeof Vimeo !== 'undefined') {
    var player = new Vimeo.Player(vimeoIframe);
    var isMuted = true;
    var isPlaying = true;

    // Mute / Unmute
    if (unmuteBtn) {
      unmuteBtn.addEventListener('click', function () {
        if (isMuted) {
          player.setMuted(false);
          player.setVolume(1);
          isMuted = false;
          unmuteBtn.querySelector('.icon-muted').style.display = 'none';
          unmuteBtn.querySelector('.icon-unmuted').style.display = 'block';
        } else {
          player.setMuted(true);
          isMuted = true;
          unmuteBtn.querySelector('.icon-muted').style.display = 'block';
          unmuteBtn.querySelector('.icon-unmuted').style.display = 'none';
        }
      });
    }

    // Play / Pause
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', function () {
        if (isPlaying) {
          player.pause();
          isPlaying = false;
          playPauseBtn.querySelector('.icon-pause').style.display = 'none';
          playPauseBtn.querySelector('.icon-play').style.display = 'block';
        } else {
          player.play();
          isPlaying = true;
          playPauseBtn.querySelector('.icon-pause').style.display = 'block';
          playPauseBtn.querySelector('.icon-play').style.display = 'none';
        }
      });
    }
  }

})();
