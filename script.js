/* ==========================================================================
   GD ACADEMY — INTERACTIVE SCRIPT & EVENT HANDLERS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgressBar.style.width = `${progress}%`;
    }
  });

  // 2. Cursor Glow Position Tracking
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // 3. Header Scrolled State & Active Section Highlighting
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Mobile Menu Toggle & Auto-Close on Click
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-links');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // 5. Course Arena Tab Switcher
  const arenaTabBtns = document.querySelectorAll('.arena-tab-btn');
  const arenaPanels = document.querySelectorAll('.arena-panel');

  arenaTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-arena-tab');

      arenaTabBtns.forEach(b => b.classList.remove('active'));
      arenaPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.querySelector(`.arena-panel[data-arena-panel="${targetTab}"]`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // 6. FAQ Accordion Handler
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    const title = card.querySelector('.faq-title');
    title.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      faqCards.forEach(c => c.classList.remove('open'));
      if (!isOpen) {
        card.classList.add('open');
      }
    });
  });

  // 7. Enquiry Modal Popup Handler
  const enquiryModal = document.getElementById('enquiryModal');
  const enquiryModalClose = document.getElementById('enquiryModalClose');
  const openEnquiryBtns = document.querySelectorAll('.open-enquiry-modal');

  openEnquiryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (enquiryModal) {
        enquiryModal.classList.add('open');
      }
    });
  });

  if (enquiryModalClose) {
    enquiryModalClose.addEventListener('click', () => {
      enquiryModal.classList.remove('open');
    });
  }

  if (enquiryModal) {
    enquiryModal.addEventListener('click', (e) => {
      if (e.target === enquiryModal) {
        enquiryModal.classList.remove('open');
      }
    });
  }

  // 8. Enquiry Form WhatsApp Direct Routing
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(enquiryForm);
      const name = formData.get('student_name');
      const phone = formData.get('student_phone');
      const course = formData.get('student_course');

      const whatsappText = `Hello GD Academy,%0A%0AI want to enquire about admission.%0A%0A👤 *Name:* ${encodeURIComponent(name)}%0A📞 *Phone:* ${encodeURIComponent(phone)}%0A📚 *Program:* ${encodeURIComponent(course)}`;
      const whatsappUrl = `https://wa.me/919961908544?text=${whatsappText}`;

      window.open(whatsappUrl, '_blank');
      enquiryModal.classList.remove('open');
      enquiryForm.reset();
    });
  }

  // 9. Lightbox Modal for Portfolio & Placement Proof Images
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img');
      if (img && lightboxModal && lightboxImage) {
        lightboxImage.src = img.src;
        lightboxModal.classList.add('open');
      }
    });
  });

  if (lightboxModal) {
    lightboxModal.addEventListener('click', () => {
      lightboxModal.classList.remove('open');
    });
  }
});
