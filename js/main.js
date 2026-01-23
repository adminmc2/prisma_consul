/* ========================================
   PRISMA Consul - Main JavaScript
   Minimal & Performance-focused
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check if touch device
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // Initialize all modules
  if (!isTouchDevice) {
    initCustomCursor();
    initCTAHoverEffect();
    initHeroEyes();
  }

  initLanguageSwitcher();
  initMobileMenu();
  initHeaderScroll();
  initSmoothScroll();
  initRevealAnimations();
  initCounterAnimation();
  initContactForm();
  initVideoScroll();
  initTransitionStatic();
});

/* ----------------------------------------
   Custom Cursor - Triangle that follows mouse
   ---------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  let isVisible = false;

  // Seguir el mouse y mostrar cursor
  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate3d(${e.clientX - 8}px, ${e.clientY - 2}px, 0)`;
    if (!isVisible) {
      cursor.style.opacity = '1';
      isVisible = true;
    }
  });

  // Ocultar cursor cuando sale de la ventana
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    isVisible = false;
  });

  // Ocultar triángulo pequeño solo en elementos del menú (mostrar mano)
  const menuElements = document.querySelectorAll('.header__nav-link');
  menuElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
      if (isVisible) {
        cursor.style.opacity = '1';
      }
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
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.header__nav-link');

  if (!menuBtn || !nav) return;

  const openMenu = () => {
    menuBtn.classList.add('active');
    nav.classList.add('active');
    header.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    menuBtn.classList.remove('active');
    nav.classList.remove('active');
    header.classList.remove('menu-open');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', () => {
    if (nav.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuBtn.contains(e.target) && nav.classList.contains('active')) {
      closeMenu();
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
   Video + Servicios Scroll Effect - Estilo QClay
   3 Fases:
   1. Video escala de 80% a 100%
   2. Video sube y desaparece, servicios aparece
   3. Scroll horizontal de servicios cards
   ---------------------------------------- */
function initVideoScroll() {
  const container = document.getElementById('videoServiciosContainer');
  const videoSection = document.getElementById('videoSection');
  const serviciosSection = document.getElementById('servicios');
  const serviciosCards = document.getElementById('serviciosCards');
  const header = document.getElementById('header');

  if (!container || !videoSection || !serviciosSection) return;

  const videoWrapper = videoSection.querySelector('.video-section__wrapper');
  if (!videoWrapper) return;

  // Calcular el ancho total para scroll horizontal
  let totalCardsWidth = 0;
  let wrapperWidth = 0;

  const calculateDimensions = () => {
    if (serviciosCards) {
      totalCardsWidth = serviciosCards.scrollWidth;
      wrapperWidth = window.innerWidth;
      console.log('totalCardsWidth:', totalCardsWidth, 'wrapperWidth:', wrapperWidth);
    }
  };

  calculateDimensions();
  window.addEventListener('resize', calculateDimensions);

  const updateAnimation = () => {
    const rect = container.getBoundingClientRect();
    const containerHeight = container.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Progreso total del scroll (0 a 1)
    const totalProgress = Math.max(0, Math.min(1, -rect.top / (containerHeight - viewportHeight)));

    // Fase 1: 0% - 20% → Video escala de 80% a 100%
    // Fase 2: 20% - 35% → Video sube y desaparece
    // Fase 3: 35% - 50% → PAUSA - servicios visible sin moverse
    // Fase 4: 50% - 85% → Scroll horizontal de servicios
    // Fase 5: 85% - 100% → PAUSA de lectura en Analytics (última card)

    const phase1End = 0.20;
    const phase2End = 0.35;
    const phase3End = 0.50; // Pausa inicial
    const phase4End = 0.85; // Fin del scroll horizontal

    // Header transparente solo durante fase 1 y 2 (video visible)
    // En fase 3+ (servicios) el header vuelve a ser visible con fondo
    if (header && totalProgress > 0 && totalProgress < phase2End) {
      header.classList.add('header--transparent');
    } else if (header) {
      header.classList.remove('header--transparent');
    }

    if (totalProgress <= phase1End) {
      // FASE 1: Video escala
      const phase1Progress = totalProgress / phase1End;

      // Escalar de 80% a 100%
      const currentWidth = 80 + (20 * phase1Progress);
      const currentRadius = 16 - (16 * phase1Progress);

      videoWrapper.style.width = `${currentWidth}vw`;
      videoWrapper.style.maxWidth = 'none';
      videoWrapper.style.borderRadius = `${currentRadius}px`;

      if (phase1Progress > 0.9) {
        videoWrapper.style.height = '100vh';
        videoWrapper.style.aspectRatio = 'unset';
      } else {
        videoWrapper.style.height = '';
        videoWrapper.style.aspectRatio = '16 / 9';
      }

      // Video visible, servicios oculto
      videoSection.style.transform = 'translateY(0)';
      videoSection.style.opacity = '1';
      serviciosSection.style.opacity = '0';

    } else if (totalProgress <= phase2End) {
      // FASE 2: Video sube y desaparece
      const phase2Progress = (totalProgress - phase1End) / (phase2End - phase1End);

      // Video sube (de 0 a -100vh)
      const videoY = -100 * phase2Progress;
      videoSection.style.transform = `translateY(${videoY}vh)`;
      videoSection.style.opacity = `${1 - phase2Progress}`;

      // Servicios aparece
      serviciosSection.style.opacity = `${phase2Progress}`;

      // Mantener video a pantalla completa
      videoWrapper.style.width = '100vw';
      videoWrapper.style.height = '100vh';
      videoWrapper.style.borderRadius = '0';
      videoWrapper.style.aspectRatio = 'unset';

      // Cards sin movimiento horizontal
      if (serviciosCards) {
        serviciosCards.style.transform = 'translateX(0)';
      }

    } else if (totalProgress <= phase3End) {
      // FASE 3: PAUSA - Servicios visible, sin movimiento
      // El usuario puede ver el contenido inicial

      videoSection.style.transform = 'translateY(-100vh)';
      videoSection.style.opacity = '0';
      serviciosSection.style.opacity = '1';

      // Cards quietas
      if (serviciosCards) {
        serviciosCards.style.transform = 'translateX(0)';
      }

    } else if (totalProgress <= phase4End) {
      // FASE 4: Scroll horizontal de servicios
      const phase4Progress = (totalProgress - phase3End) / (phase4End - phase3End);

      // Video completamente arriba
      videoSection.style.transform = 'translateY(-100vh)';
      videoSection.style.opacity = '0';

      // Servicios visible
      serviciosSection.style.opacity = '1';

      // Scroll horizontal de cards
      if (serviciosCards) {
        const maxScroll = totalCardsWidth - wrapperWidth;
        const scrollX = -maxScroll * phase4Progress;
        serviciosCards.style.transform = `translateX(${scrollX}px)`;
      }

    } else {
      // FASE 5: PAUSA de lectura en Analytics (última card visible)
      // El scroll horizontal se mantiene al final mientras el usuario sigue scrolleando

      videoSection.style.transform = 'translateY(-100vh)';
      videoSection.style.opacity = '0';
      serviciosSection.style.opacity = '1';

      // Cards en posición final (Analytics visible)
      if (serviciosCards) {
        const maxScroll = totalCardsWidth - wrapperWidth;
        serviciosCards.style.transform = `translateX(${-maxScroll}px)`;
      }
    }
  };

  // Ejecutar en scroll con requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateAnimation();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Transition Marquee - aparece al final de servicios, desaparece en transition-static
  const transitionMarquee = document.getElementById('transitionMarquee');
  const transitionStatic = document.getElementById('transitionStatic');

  if (transitionMarquee && transitionStatic) {
    const checkTransition = () => {
      const containerRect = container.getBoundingClientRect();
      const staticRect = transitionStatic.getBoundingClientRect();

      // Mostrar cuando el container está casi terminando y antes de que la sección estática entre en pantalla
      const showMarquee = containerRect.bottom < window.innerHeight * 1.2 &&
                          staticRect.top > window.innerHeight * 0.5;

      if (showMarquee) {
        transitionMarquee.classList.add('active');
      } else {
        transitionMarquee.classList.remove('active');
      }
    };

    window.addEventListener('scroll', () => {
      requestAnimationFrame(checkTransition);
    }, { passive: true });
  }

  // Ejecutar una vez al cargar
  updateAnimation();
}

/* ----------------------------------------
   Transition Static - Título se mueve + Tarjeta aparece
   Fases:
   1. Título centrado (estado inicial) - SOLO visible cuando la sección está en pantalla
   2. Al hacer scroll, título se mueve a top-left y se hace pequeño
   3. CUANDO título está en posición final, tarjeta aparece DE GOLPE desde la derecha
   ---------------------------------------- */
function initTransitionStatic() {
  const section = document.getElementById('transitionStatic');
  const title = document.getElementById('transitionTitle');
  const card = document.getElementById('transitionCard');

  if (!section || !title || !card) return;

  // Posición final del título (ajustada - más abajo)
  const finalTop = 200; // px desde arriba (más abajo, dentro de la tarjeta)
  const finalLeft = 60; // px desde la izquierda
  const finalScale = 0.35;

  const updateTransition = () => {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;

    // IMPORTANTE: Ocultar todo si la sección NO está visible
    // La sección empieza cuando rect.top < viewportHeight
    if (rect.top >= viewportHeight) {
      // Sección todavía no visible - OCULTAR TODO
      title.style.opacity = '0';
      title.style.pointerEvents = 'none';
      card.style.opacity = '0';
      return;
    }

    // Sección ya pasó completamente
    if (rect.bottom <= 0) {
      title.style.opacity = '0';
      title.style.pointerEvents = 'none';
      card.style.opacity = '0';
      return;
    }

    // Sección está visible - mostrar título
    title.style.opacity = '1';
    title.style.pointerEvents = 'auto';

    // Calcular progreso del scroll dentro de la sección
    // 0 = sección acaba de entrar, 1 = fin de la sección
    const scrollProgress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - viewportHeight)));

    // Fase 1: 0% - 40% → Título se mueve de centro a top-left (sin tarjeta)
    // Fase 2: 40% - 45% → Tarjeta aparece DE GOLPE desde la derecha (muy rápido)
    // Fase 3: 45% - 100% → Todo en posición

    const phase1End = 0.40;
    const phase2End = 0.45;

    if (scrollProgress <= phase1End) {
      // FASE 1: Solo el título se mueve de centro a top-left
      const phase1Progress = scrollProgress / phase1End;
      const easeProgress = easeOutCubic(phase1Progress);

      // Calcular valores actuales
      const currentScale = 1 + (finalScale - 1) * easeProgress;

      // Posición: de centro a top-left
      const topPx = (viewportHeight * 0.5) * (1 - easeProgress) + finalTop * easeProgress;
      const leftPx = (window.innerWidth * 0.5) * (1 - easeProgress) + finalLeft * easeProgress;

      // Transform: de translate(-50%, -50%) a translate(0, 0)
      const translateX = -50 * (1 - easeProgress);
      const translateY = -50 * (1 - easeProgress);

      title.style.position = 'fixed';
      title.style.top = `${topPx}px`;
      title.style.left = `${leftPx}px`;
      title.style.transform = `translate(${translateX}%, ${translateY}%) scale(${currentScale})`;
      title.style.transformOrigin = 'top left';

      // Tarjeta COMPLETAMENTE oculta durante fase 1
      card.style.transform = 'translateX(100%)';
      card.style.opacity = '0';

    } else if (scrollProgress <= phase2End) {
      // FASE 2: Título en posición final, tarjeta entra MUY RÁPIDO desde la derecha
      const phase2Progress = (scrollProgress - phase1End) / (phase2End - phase1End);
      const easeProgress = easeOutQuart(phase2Progress);

      // Título en posición final
      title.style.position = 'fixed';
      title.style.top = `${finalTop}px`;
      title.style.left = `${finalLeft}px`;
      title.style.transform = `translate(0, 0) scale(${finalScale})`;
      title.style.transformOrigin = 'top left';

      // Tarjeta entra desde la derecha MUY RÁPIDO
      const cardX = 100 * (1 - easeProgress);
      card.style.transform = `translateX(${cardX}%)`;
      card.style.opacity = '1';

    } else {
      // FASE 3: Todo en posición final
      title.style.position = 'fixed';
      title.style.top = `${finalTop}px`;
      title.style.left = `${finalLeft}px`;
      title.style.transform = `translate(0, 0) scale(${finalScale})`;
      title.style.transformOrigin = 'top left';

      card.style.transform = 'translateX(0)';
      card.style.opacity = '1';
    }
  };

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateTransition();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Ejecutar una vez al cargar
  updateTransition();
}


