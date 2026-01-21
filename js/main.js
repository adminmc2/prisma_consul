/* ========================================
   PRISMA Consul - Main JavaScript
   Minimal & Performance-focused
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initCustomCursor();
  initLanguageSwitcher();
  initMobileMenu();
  initHeaderScroll();
  initSmoothScroll();
  initRevealAnimations();
  initCounterAnimation();
  initContactForm();
  initCTAHoverEffect();
  initHeroEyes();
  initVideoScroll();
});

/* ----------------------------------------
   Custom Cursor - Triangle that follows mouse
   ---------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  // Seguir el mouse
  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate3d(${e.clientX - 8}px, ${e.clientY - 2}px, 0)`;
  });

  // Mostrar/ocultar cursor cuando entra/sale de la ventana
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  // Ocultar triángulo pequeño solo en elementos del menú (mostrar mano)
  const menuElements = document.querySelectorAll('.header__nav-link');
  menuElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.opacity = '1';
    });
  });
}

/* ----------------------------------------
   Language Switcher - Real Translation
   ---------------------------------------- */
function initLanguageSwitcher() {
  const switcher = document.getElementById('langSwitcher');
  if (!switcher) return;

  // Check saved language preference
  const savedLang = localStorage.getItem('prisma-lang') || 'es';
  if (savedLang === 'en') {
    switcher.classList.add('en');
    switchLanguage('en');
  }

  switcher.addEventListener('click', () => {
    switcher.classList.toggle('en');
    const lang = switcher.classList.contains('en') ? 'en' : 'es';
    switchLanguage(lang);
    localStorage.setItem('prisma-lang', lang);
  });
}

function switchLanguage(lang) {
  // Find all elements with data-es and data-en attributes
  const elements = document.querySelectorAll('[data-es][data-en]');

  elements.forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      // Special handling for CTA button with dot inside
      if (el.classList.contains('header__cta')) {
        const dot = el.querySelector('.header__cta-dot');
        if (dot) {
          // Clear and rebuild: dot + text
          el.innerHTML = '';
          el.appendChild(dot);
          el.appendChild(document.createTextNode(text));
          return;
        }
      }

      // Special handling for nav links with link-slide structure
      if (el.classList.contains('header__nav-link')) {
        const linkSlide = el.querySelector('.link-slide');
        const linkHidden = el.querySelector('.link-hidden');
        if (linkSlide && linkHidden) {
          // Update hidden text
          linkHidden.textContent = text;
          // Update both spans in link-slide
          const spans = linkSlide.querySelectorAll('span');
          spans.forEach(span => {
            span.textContent = text;
          });
          return;
        }
      }

      // Check if text contains HTML
      if (text.includes('<')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    }
  });

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Update eye marker rotating text
  const svgEs = document.querySelector('.hero-eye-marker__text--es');
  const svgEn = document.querySelector('.hero-eye-marker__text--en');
  if (svgEs && svgEn) {
    if (lang === 'en') {
      svgEs.style.display = 'none';
      svgEn.style.display = 'block';
    } else {
      svgEs.style.display = 'block';
      svgEn.style.display = 'none';
    }
  }
}

/* ----------------------------------------
   Mobile Menu Toggle
   ---------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.header__nav-link');

  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuBtn.contains(e.target) && nav.classList.contains('active')) {
      menuBtn.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ----------------------------------------
   Header Scroll Effect
   ---------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class when past 50px
    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ----------------------------------------
   Smooth Scroll for Anchor Links
   ---------------------------------------- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ----------------------------------------
   Reveal Animations on Scroll
   ---------------------------------------- */
function initRevealAnimations() {
  // Add reveal class to elements
  const revealElements = document.querySelectorAll(
    '.section-header, .servicio-card, .nosotros__content, .stats-card, .contact-form'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  // Create intersection observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        // Add staggered delay for service cards
        if (entry.target.classList.contains('servicio-card')) {
          const cards = document.querySelectorAll('.servicio-card');
          cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
          });
        }
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ----------------------------------------
   Counter Animation for Stats
   ---------------------------------------- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stats-card__number[data-count]');
  if (!counters.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-count'), 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

/* ----------------------------------------
   Contact Form Handling
   ---------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    try {
      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Log data for now (replace with actual API call)
      console.log('Form data:', data);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success state
      submitBtn.textContent = '¡Enviado!';
      submitBtn.style.background = 'linear-gradient(135deg, #32CD32, #228B22)';
      form.reset();

      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      submitBtn.textContent = 'Error. Reintentar';
      submitBtn.style.background = 'linear-gradient(135deg, #FF6B6B, #EE5A5A)';

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }
  });

  // Input focus effects
  const inputs = form.querySelectorAll('.form-input, .form-textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
}

/* ----------------------------------------
   CTA Button Hover Effect - Movimiento parallax
   ---------------------------------------- */
function initCTAHoverEffect() {
  const ctaButton = document.querySelector('.header__cta');
  if (!ctaButton) return;

  ctaButton.addEventListener('mousemove', (e) => {
    const rect = ctaButton.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Movimiento sutil del botón (efecto parallax)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const moveX = (x - centerX) / 8;
    const moveY = (y - centerY) / 8;

    ctaButton.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  ctaButton.addEventListener('mouseleave', () => {
    ctaButton.style.transform = 'translate(0, 0)';
  });
}

/* ----------------------------------------
   Hero Eyes Animation - Sigue el mouse
   ---------------------------------------- */
function initHeroEyes() {
  const eyesContainer = document.querySelector('.hero-eyes');
  const eyes = document.querySelectorAll('.hero-eye');
  if (!eyesContainer || !eyes.length) return;

  // Seguir el mouse
  document.addEventListener('mousemove', (e) => {
    eyes.forEach(eye => {
      const rect = eye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;

      // Calcular distancia y limitar movimiento
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxMove = 5; // Máximo movimiento en px

      let moveX = (deltaX / distance) * Math.min(maxMove, distance / 20);
      let moveY = (deltaY / distance) * Math.min(maxMove, distance / 20);

      // Evitar NaN cuando el mouse está exactamente en el centro
      if (isNaN(moveX)) moveX = 0;
      if (isNaN(moveY)) moveY = 0;

      eye.style.setProperty('--pupil-x', `${moveX}px`);
      eye.style.setProperty('--pupil-y', `${moveY}px`);
    });
  });

  // Estados de parpadeo
  const blink = () => {
    eyesContainer.setAttribute('data-state', 'close');
    setTimeout(() => {
      eyesContainer.removeAttribute('data-state');
    }, 150);
  };

  // Parpadear aleatoriamente cada 2-5 segundos
  const scheduleBlink = () => {
    const delay = 2000 + Math.random() * 3000;
    setTimeout(() => {
      blink();
      scheduleBlink();
    }, delay);
  };

  scheduleBlink();
}

/* ----------------------------------------
   Video Scroll Effect - Estilo QClay
   El video escala de pequeño a pantalla completa
   ---------------------------------------- */
function initVideoScroll() {
  const videoSection = document.getElementById('videoSection');
  if (!videoSection) return;

  const videoWrapper = videoSection.querySelector('.video-section__wrapper');
  if (!videoWrapper) return;

  const updateVideoScale = () => {
    const rect = videoSection.getBoundingClientRect();
    const sectionHeight = videoSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Calcular progreso del scroll dentro de la sección
    // 0 = inicio de la sección, 1 = fin de la sección
    const scrollProgress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - viewportHeight)));

    // Escalar de 80% a 100% del viewport
    const startWidth = 80; // porcentaje inicial
    const endWidth = 100; // porcentaje final
    const currentWidth = startWidth + (endWidth - startWidth) * scrollProgress;

    // Border radius de 16px a 0
    const startRadius = 16;
    const endRadius = 0;
    const currentRadius = startRadius - (startRadius - endRadius) * scrollProgress;

    // Aplicar estilos
    videoWrapper.style.width = `${currentWidth}vw`;
    videoWrapper.style.maxWidth = 'none';
    videoWrapper.style.borderRadius = `${currentRadius}px`;

    // Cuando está a pantalla completa, hacer el video 100vh
    if (scrollProgress > 0.95) {
      videoWrapper.style.height = '100vh';
      videoWrapper.style.aspectRatio = 'unset';
    } else {
      videoWrapper.style.height = '';
      videoWrapper.style.aspectRatio = '16 / 9';
    }
  };

  // Ejecutar en scroll con requestAnimationFrame para mejor rendimiento
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateVideoScale();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Ejecutar una vez al cargar
  updateVideoScale();
}
