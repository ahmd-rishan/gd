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
  initBlogCarousel();
  initBlogModal();
  initTestimonialsCarousel();
  initToolsCarousel();
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

/* 10. Blog Carousel Functionality */
function initBlogCarousel() {
  const carousel = document.getElementById('blogCarousel');
  if (!carousel) return;

  const track = document.getElementById('blogTrack');
  const cards = track ? track.querySelectorAll('.blog-card') : [];
  const prevBtn = document.getElementById('blogPrev');
  const nextBtn = document.getElementById('blogNext');
  const dotsContainer = document.getElementById('blogDots');

  if (!track || !cards.length) return;

  let currentIndex = 0;

  function getCardsPerView() {
    const width = window.innerWidth;
    if (width <= 767) return 1;
    if (width <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    const perView = getCardsPerView();
    return Math.max(0, cards.length - perView);
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    const dotCount = maxIdx + 1;

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to blog slide ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
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
    const gap = parseFloat(window.getComputedStyle(track).gap) || 28;
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
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex <= 0) ? getMaxIndex() : currentIndex - 1;
      updateCarousel();
    });
  }

  // Touch Swipe Support
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
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
  });

  window.addEventListener('resize', () => {
    buildDots();
    updateCarousel();
  });

  buildDots();
  updateCarousel();
}

/* 11. Blog Modal Article Reader */
function initBlogModal() {
  const modal = document.getElementById('blogModal');
  if (!modal) return;

  const closeBtn = document.getElementById('blogModalClose');
  const titleEl = document.getElementById('blogModalTitle');
  const categoryEl = document.getElementById('blogModalCategory');
  const dateEl = document.getElementById('blogModalDate');
  const imageEl = document.getElementById('blogModalImage');
  const bodyEl = document.getElementById('blogModalBody');

  const blogArticles = {
    "1": {
      title: "Digital Marketing Trends in 2026: What Businesses Need to Know",
      category: "Digital Marketing",
      date: "August 11, 2026",
      image: "images/blog-1-trends.webp",
      content: `
        <p>As we navigate through 2026, the landscape of digital marketing has undergone a dramatic transformation driven by rapid artificial intelligence adoption, evolving search engine algorithms, and shifting consumer behavior. For businesses in Kerala and globally, understanding these <strong>Digital Marketing Trends in 2026</strong> is essential for maintaining brand visibility and driving sustainable growth.</p>
        
        <h2>1. AI-Driven Search & Answer Engine Optimization (AEO)</h2>
        <p>Traditional search engine results pages (SERPs) are increasingly giving way to instant AI-generated answers. Search engines now summarize top sources to answer user queries directly. To stay competitive, modern digital marketing strategy must focus on Answer Engine Optimization (AEO) by structuring content with direct factual answers, structured schema markup, and clear topical authority.</p>

        <h2>2. Short-Form Video Dominance</h2>
        <p>Short-form video content on platforms like Instagram Reels, YouTube Shorts, and Meta ad networks continues to command the highest engagement rates across demographics. High-performing brands rely on authentic storytelling, quick visual hooks, and direct customer value rather than over-polished corporate ads.</p>

        <h2>3. First-Party Data & Privacy-First Tracking</h2>
        <p>With third-party tracking restrictions now universally enforced, successful digital marketers prioritize building first-party data assets through newsletter subscriptions, custom web tools, and interactive brand experiences. Transparent data collection builds consumer trust while enabling hyper-personalized email and WhatsApp marketing automation.</p>

        <div class="blog-takeaways-box">
          <h4>Key Actionable Takeaways</h4>
          <ul>
            <li>Optimize content for direct Q&A formats to capture AI search summaries.</li>
            <li>Invest in short-form vertical video storytelling across social channels.</li>
            <li>Prioritize first-party lead capture to insulate against ad tracking changes.</li>
            <li>Enrol in practical hands-on training to master 2026 marketing tools.</li>
          </ul>
        </div>

        <h2>Practical Application for Regional & Local Brands</h2>
        <p>Whether you manage an e-commerce brand or local business in Malappuram or Manjeri, deploying targeted Meta Ads paired with high-intent Google Search campaigns yields the highest Return on Ad Spend (ROAS). Enrolling in practical industry training at GD Academy helps marketers master these real-world execution skills.</p>
      `
    },
    "2": {
      title: "How AI Is Changing Digital Marketing in 2026",
      category: "Artificial Intelligence",
      date: "August 10, 2026",
      image: "images/blog-2-ai.webp",
      content: `
        <p>Artificial Intelligence is no longer just a buzzword—it is the foundational infrastructure behind modern customer acquisition. Understanding <strong>AI in Digital Marketing</strong> enables modern teams to automate routine tasks, analyze complex audience segments, and scale creative output without compromising brand quality.</p>

        <h2>AI Content Creation & Creative Workflow</h2>
        <p>Generative AI tools assist copywriters, graphic designers, and video editors by accelerating draft creation, generating ad copy variations, and automating video subtitling. However, raw AI output requires human strategic oversight to ensure brand voice, accuracy, and emotional resonance.</p>

        <h2>Predictive Analytics & Smart Ad Campaign Bidding</h2>
        <p>Ad platforms like Google Ads and Meta Ads utilize machine learning algorithms to optimize bid strategies, predict conversion likelihood, and serve dynamic ad creatives tailored to individual user intent in real time.</p>

        <div class="blog-takeaways-box">
          <h4>How Marketers Should Use AI Effectively</h4>
          <ul>
            <li>Use AI for research, structuring outlines, and generating creative variations.</li>
            <li>Maintain strict human editorial control to prevent generic AI content.</li>
            <li>Leverage AI audience insights to refine targeting parameters.</li>
            <li>Combine AI efficiency with authentic human storytelling.</li>
          </ul>
        </div>

        <h2>Human Creativity + AI Efficiency</h2>
        <p>The most successful digital marketing strategies in 2026 do not replace human talent with AI; instead, they empower skilled practitioners with AI tools to execute campaigns faster and with greater strategic precision.</p>
      `
    },
    "3": {
      title: "How to Build a Successful Digital Marketing Strategy for Your Business",
      category: "Strategy & Growth",
      date: "August 08, 2026",
      image: "images/blog-3-strategy.webp",
      content: `
        <p>A well-defined <strong>Digital Marketing Strategy</strong> serves as a clear roadmap for customer acquisition, brand awareness, and revenue growth. Without a structured plan, marketing budgets are often spent on disjointed tactics that fail to generate meaningful ROI.</p>

        <h2>Step 1: Identify Audience & Customer Intent</h2>
        <p>Begin by analyzing customer demographics, online search behavior, pain points, and preferred media channels. Understanding user intent ensures your messaging resonates effectively at every stage of the buyer journey.</p>

        <h2>Step 2: Establish Measurable Marketing Objectives</h2>
        <p>Define clear Key Performance Indicators (KPIs) such as cost-per-lead (CPL), conversion rate, organic search traffic, and ad return on investment (ROAS).</p>

        <h2>Step 3: Build an Integrated Omnichannel Campaign</h2>
        <p>Combine organic Search Engine Optimization (SEO) with high-converting Google Search Ads and Meta Social Media Ads. Retarget website visitors across channels to maximize conversion opportunities.</p>

        <div class="blog-takeaways-box">
          <h4>Essential Elements of a 2026 Strategy</h4>
          <ul>
            <li>Clear audience segmentation and customer journey mapping.</li>
            <li>High-converting landing page user experience (UX).</li>
            <li>Continuous campaign analytics and conversion funnel optimization.</li>
          </ul>
        </div>

        <h2>Step 4: Analyze Analytics & Optimize Continuously</h2>
        <p>Utilize Web Analytics and heatmaps to measure user interactions, identify drop-off points, and iteratively optimize landing pages to boost overall conversion performance.</p>
      `
    },
    "4": {
      title: "SEO in 2026: How Search Is Changing and What Businesses Should Do",
      category: "SEO & AEO",
      date: "August 05, 2026",
      image: "images/blog-4-seo.webp",
      content: `
        <p>Search engine optimization has evolved far beyond keyword density and backlink volume. In 2026, successful <strong>SEO in 2026</strong> requires adapting to AI Search Overviews, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO).</p>

        <h2>Understanding AEO & Generative Engine Optimization (GEO)</h2>
        <p>AI engines summarize web pages to deliver direct answers to searchers. GEO involves structuring web content with clear subheadings, bullet points, concise definitions, and authoritative data sources that AI models prefer to cite.</p>

        <h2>E-E-A-T & Helpful Content Principles</h2>
        <p>Search engines prioritize Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T). Demonstrating real-world project experience, genuine student outcomes, and expert mentorship builds long-term search visibility.</p>

        <div class="blog-takeaways-box">
          <h4>Core SEO Priorities for 2026</h4>
          <ul>
            <li>Optimize for user search intent and direct conversational questions.</li>
            <li>Ensure fast mobile load times, WebP images, and clean HTML structure.</li>
            <li>Dominate hyper-local search queries for regional business growth.</li>
          </ul>
        </div>

        <h2>Local SEO & Technical Health</h2>
        <p>For regional businesses in Malappuram and Manjeri, optimizing Google Business Profiles, localized landing pages, and technical site performance ensures high placement in local map packs and high-intent local searches.</p>
      `
    }
  };

  const openTriggers = document.querySelectorAll('.open-blog-modal');
  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-blog-target');
      const article = blogArticles[targetId];
      if (!article) return;

      titleEl.textContent = article.title;
      categoryEl.textContent = article.category;
      dateEl.textContent = article.date;
      imageEl.src = article.image;
      imageEl.alt = article.title;
      bodyEl.innerHTML = article.content;

      modal.classList.add('open');
      document.body.classList.add('blog-modal-open');
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.classList.remove('blog-modal-open');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* 12. Testimonials Responsive Carousel */
function initTestimonialsCarousel() {
  const carousel = document.getElementById('testimonialCarousel');
  if (!carousel) return;

  const track = document.getElementById('testimonialTrack');
  const cards = track ? track.querySelectorAll('.quote-card') : [];
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsContainer = document.getElementById('testimonialDots');

  if (!track || !cards.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  function getCardsPerView() {
    const width = window.innerWidth;
    if (width <= 767) return 1;
    if (width <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    const perView = getCardsPerView();
    return Math.max(0, cards.length - perView);
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    const dotCount = maxIdx + 1;

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
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
    const gap = parseFloat(window.getComputedStyle(track).gap) || 28;
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
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  window.addEventListener('resize', () => {
    buildDots();
    updateCarousel();
  });

  buildDots();
  updateCarousel();
  startAutoplay();
}

/* 13. Industry Stack Tools Responsive Carousel */
function initToolsCarousel() {
  const carousel = document.getElementById('toolsCarousel');
  if (!carousel) return;

  const track = document.getElementById('toolsTrack');
  const cards = track ? track.querySelectorAll('.tool-card') : [];
  const prevBtn = document.getElementById('toolsPrev');
  const nextBtn = document.getElementById('toolsNext');
  const dotsContainer = document.getElementById('toolsDots');

  if (!track || !cards.length) return;

  let currentIndex = 0;

  function getCardsPerView() {
    const width = window.innerWidth;
    if (width <= 767) return 1;
    if (width <= 1024) return 2;
    return 4;
  }

  function getMaxIndex() {
    const perView = getCardsPerView();
    return Math.max(0, cards.length - perView);
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    const dotCount = maxIdx + 1;

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to tool slide ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
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
    const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
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
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex <= 0) ? getMaxIndex() : currentIndex - 1;
      updateCarousel();
    });
  }

  // Touch & Drag Support
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
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
  });

  window.addEventListener('resize', () => {
    buildDots();
    updateCarousel();
  });

  buildDots();
  updateCarousel();
}
