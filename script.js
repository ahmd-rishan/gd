/* ==========================================================================
   GD ACADEMY — INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initCursorGlow();
  initMobileMenu();
  initCourseArenaTabs();
  initFaqAccordion();
  initModals();
  initLightbox();
  initPlacementsCarousel();
  initJourneyCounters();
});

/* 01. Scroll Progress Bar */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* 02. Cursor Glow Effect */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.innerWidth <= 768) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }, { passive: true });
}

/* 03. Mobile Navigation Menu Toggle */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('mobile-open');
    toggle.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      toggle.classList.remove('active');
    });
  });
}

/* 04. Course Explorer Arena Tabs */
function initCourseArenaTabs() {
  const tabBtns = document.querySelectorAll('.arena-tab-btn');
  const panels = document.querySelectorAll('.arena-panel');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-arena-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.querySelector(`.arena-panel[data-arena-panel="${targetTab}"]`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
}

/* 05. FAQ Accordion */
function initFaqAccordion() {
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(card => {
    const title = card.querySelector('.faq-title');
    if (!title) return;

    title.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');

      faqCards.forEach(c => c.classList.remove('open'));

      if (!isOpen) {
        card.classList.add('open');
      }
    });
  });
}

/* 06. Modals (Enquiry Form & Direct WhatsApp Integration) */
function initModals() {
  const openBtns = document.querySelectorAll('.open-enquiry-modal');
  const modal = document.getElementById('enquiryModal');
  const closeBtn = document.getElementById('enquiryModalClose');
  const form = document.getElementById('enquiryForm');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('student_name') || 'Student';
      const phone = formData.get('student_phone') || '';
      const course = formData.get('student_course') || 'General Counselling';

      const message = `Hello GD Academy! I submitted an enquiry on your website.\n\nName: ${name}\nPhone: ${phone}\nProgram: ${course}`;
      const encoded = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/919961908544?text=${encoded}`;

      modal.classList.remove('open');
      form.reset();
      window.open(whatsappUrl, '_blank');
    });
  }
}

/* 07. Portfolio Lightbox Modal */
function initLightbox() {
  const triggers = document.querySelectorAll('.lightbox-trigger img');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImage');

  if (!modal || !modalImg) return;

  triggers.forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalImg.alt = img.alt || 'GD Academy Project Showcase';
      modal.classList.add('open');
    });
  });

  modal.addEventListener('click', () => {
    modal.classList.remove('open');
  });
}

/* 08. Placements Carousel Controller */
function initPlacementsCarousel() {
  const track = document.getElementById('placementTrack');
  const prevBtn = document.getElementById('placementPrev');
  const nextBtn = document.getElementById('placementNext');
  const dotsContainer = document.getElementById('placementDots');
  const wrapper = document.getElementById('placementCarousel');

  if (!track) return;

  const cards = Array.from(track.children);
  const totalCards = cards.length;
  let currentIndex = 0;
  let autoplayTimer = null;

  function getCardsPerView() {
    const w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 1024) return 2.5;
    return 4;
  }

  function getMaxIndex() {
    const perView = getCardsPerView();
    return Math.max(0, Math.ceil(totalCards - perView));
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    const dotCount = Math.max(1, maxIdx + 1);

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) currentIndex = maxIdx;
    if (currentIndex < 0) currentIndex = 0;

    const firstCard = cards[0];
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    if (dotsContainer) {
      const dots = Array.from(dotsContainer.children);
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex >= getMaxIndex()) ? 0 : currentIndex + 1;
      updateCarousel();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex <= 0) ? getMaxIndex() : currentIndex - 1;
      updateCarousel();
      resetAutoplay();
    });
  }

  // Touch Swipe Support
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!isSwiping) return;
    const diff = startX - currentX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        currentIndex = (currentIndex >= getMaxIndex()) ? 0 : currentIndex + 1;
      } else {
        currentIndex = (currentIndex <= 0) ? getMaxIndex() : currentIndex - 1;
      }
      updateCarousel();
    }
    isSwiping = false;
    startAutoplay();
  });

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      currentIndex = (currentIndex >= getMaxIndex()) ? 0 : currentIndex + 1;
      updateCarousel();
    }, 4500);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
  }

  window.addEventListener('resize', () => {
    buildDots();
    updateCarousel();
  });

  buildDots();
  updateCarousel();
  startAutoplay();
}

/* 09. Digital Journey Counters Animation */
function initJourneyCounters() {
  const section = document.getElementById('digital-journey');
  if (!section) return;

  const counters = section.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let animated = false;

  const animateCounters = () => {
    if (animated) return;
    animated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      if (prefersReducedMotion) {
        counter.textContent = target;
        return;
      }

      const duration = target > 50 ? 1800 : 1500;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeProgress * target);

        counter.textContent = currentCount;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  } else {
    animateCounters();
  }
}
