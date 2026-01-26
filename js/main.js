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

  // No ejecutar animaciones de scroll en móvil - CSS maneja el layout estático
  const isMobile = window.innerWidth <= 480;
  if (isMobile) {
    // En móvil, mostrar servicios sin animaciones (video ya está controlado por CSS)
    if (serviciosSection) {
      serviciosSection.style.opacity = '1';
      serviciosSection.style.transform = 'none';
    }
    if (serviciosCards) {
      serviciosCards.style.transform = 'none';
    }
    return;
  }

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

    // Ocultar servicios cuando transition-static entra en viewport
    const transitionStaticSection = document.getElementById('transitionStatic');
    if (transitionStaticSection) {
      const staticRect = transitionStaticSection.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const stickyContainer = document.querySelector('.video-servicios-container__sticky');

      // Fade out servicios cuando transition-static entra
      if (staticRect.top < viewportH) {
        const fadeProgress = Math.max(0, Math.min(1, (viewportH - staticRect.top) / (viewportH * 0.3)));

        if (stickyContainer) {
          stickyContainer.style.opacity = `${1 - fadeProgress}`;
          if (fadeProgress >= 0.9) {
            stickyContainer.style.visibility = 'hidden';
            stickyContainer.style.zIndex = '-1';
          }
        }
        serviciosSection.style.opacity = `${1 - fadeProgress}`;
        if (fadeProgress >= 0.9) {
          serviciosSection.style.visibility = 'hidden';
          serviciosSection.style.zIndex = '-1';
        }
      } else {
        if (stickyContainer) {
          stickyContainer.style.visibility = 'visible';
          stickyContainer.style.opacity = '1';
          stickyContainer.style.zIndex = '';
        }
        serviciosSection.style.opacity = '1';
        serviciosSection.style.visibility = 'visible';
        serviciosSection.style.zIndex = '';
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

  // Animación simple para móvil
  const isMobile = window.innerWidth <= 480;
  if (isMobile) {
    let done = false;

    const updateMobileTransition = () => {
      if (done) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionVisible = rect.top < viewportHeight * 0.8;

      if (sectionVisible) {
        done = true;
        card.classList.add('mobile-visible');
      }
    };

    window.addEventListener('scroll', updateMobileTransition, { passive: true });
    return;
  }

  // Función para resetear estados de personas/roles/info
  const resetPersonStates = () => {
    const bg1 = document.querySelector('.transition-static__bg--1');
    const bg2 = document.querySelector('.transition-static__bg--2');
    const bg3 = document.querySelector('.transition-static__bg--3');
    const person1 = document.querySelector('.transition-static__person--1');
    const person2 = document.querySelector('.transition-static__person--2');
    const person3 = document.querySelector('.transition-static__person--3');
    const roles1 = document.querySelector('.transition-static__roles--1');
    const roles2 = document.querySelector('.transition-static__roles--2');
    const roles3 = document.querySelector('.transition-static__roles--3');
    const info1 = document.querySelector('.transition-static__info--1');
    const info2 = document.querySelector('.transition-static__info--2');
    const info3 = document.querySelector('.transition-static__info--3');
    const closingSection = document.getElementById('transitionClosing');
    const header = document.getElementById('header');

    // Resetear a estado inicial (persona 1 activa)
    if (bg1) bg1.classList.add('active');
    if (bg2) bg2.classList.remove('active');
    if (bg3) bg3.classList.remove('active');
    if (person1) { person1.classList.add('active'); person1.classList.remove('exiting'); }
    if (person2) { person2.classList.remove('active'); person2.classList.remove('exiting'); }
    if (person3) { person3.classList.remove('active'); person3.classList.remove('exiting'); }
    if (roles1) roles1.classList.add('active');
    if (roles2) roles2.classList.remove('active');
    if (roles3) roles3.classList.remove('active');
    if (info1) info1.classList.add('active');
    if (info2) info2.classList.remove('active');
    if (info3) info3.classList.remove('active');
    if (closingSection) closingSection.classList.remove('active');
    if (header) header.classList.remove('header--quote-active');
  };

  const updateTransition = () => {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;

    // El título solo debe aparecer cuando la sección está visible
    const sectionInViewport = rect.top < viewportHeight && rect.bottom > 0;
    const showTitle = sectionInViewport && rect.top < viewportHeight * 0.5;

    if (!showTitle) {
      title.style.opacity = '0';
      title.style.pointerEvents = 'none';
      card.style.width = '0px';
      card.style.opacity = '0';

      // Resetear estado de personas cuando la sección no es visible
      resetPersonStates();
      return;
    }

    // Calcular progreso
    const startPoint = viewportHeight * 0.5;
    const scrolled = startPoint - rect.top;
    const scrollProgress = Math.max(0, Math.min(1, scrolled / sectionHeight));

    // Fases:
    // Fase 0: 0% - 8% → Título aparece centrado (fade in)
    // Fase 1: 8% - 50% → SIMULTÁNEO: Título se encoge y va a izquierda + Tarjeta crece desde derecha
    // Fase 2: 50% - 100% → Tarjeta completa, título desaparecido

    const phase0End = 0.08;
    const phase1End = 0.50;

    if (scrollProgress <= phase0End) {
      // FASE 0: Título aparece centrado
      const progress = scrollProgress / phase0End;

      title.style.opacity = `${progress}`;
      title.style.pointerEvents = 'auto';
      title.style.position = 'fixed';
      title.style.top = '50%';
      title.style.left = '50%';
      title.style.transform = 'translate(-50%, -50%) scale(1)';

      // Tarjeta pequeña/oculta a la derecha
      card.style.opacity = '0';
      card.style.width = '0px';

      // Resetear estados de personas
      resetPersonStates();

    } else if (scrollProgress <= phase1End) {
      // FASE 1: Título se encoge y mueve a izquierda + Tarjeta crece desde derecha
      const progress = (scrollProgress - phase0End) / (phase1End - phase0End);
      const ease = easeOutCubic(progress);

      // TÍTULO: Se encoge (1 → 0.2) y se mueve a la izquierda hasta salir
      const titleScale = 1 - (ease * 0.8); // 1 → 0.2
      const titleLeft = 50 - (ease * 80); // 50% → -30% (sale por izquierda)
      const titleOpacity = 1 - ease; // desaparece gradualmente

      title.style.opacity = `${titleOpacity}`;
      title.style.pointerEvents = 'none';
      title.style.position = 'fixed';
      title.style.top = '50%';
      title.style.left = `${titleLeft}%`;
      title.style.transform = `translate(-50%, -50%) scale(${titleScale})`;

      // TARJETA: Crece desde la derecha (pequeña → toda la pantalla)
      const maxWidth = window.innerWidth - 40; // ancho máximo con margen
      const cardWidth = ease * maxWidth;
      card.style.opacity = '1';
      card.style.width = `${cardWidth}px`;

      // Resetear estados de personas (todavía no se muestran)
      resetPersonStates();

    } else {
      // FASE 2+: Tarjeta completa, título desaparecido
      title.style.opacity = '0';
      title.style.pointerEvents = 'none';

      card.style.opacity = '1';
      card.style.width = 'calc(100% - 40px)';

      // Obtener elementos de las capas
      const bg1 = document.querySelector('.transition-static__bg--1');
      const bg2 = document.querySelector('.transition-static__bg--2');
      const bg3 = document.querySelector('.transition-static__bg--3');
      const person1 = document.querySelector('.transition-static__person--1');
      const person2 = document.querySelector('.transition-static__person--2');
      const person3 = document.querySelector('.transition-static__person--3');
      const roles1 = document.querySelector('.transition-static__roles--1');
      const roles2 = document.querySelector('.transition-static__roles--2');
      const roles3 = document.querySelector('.transition-static__roles--3');
      const info1 = document.querySelector('.transition-static__info--1');
      const info2 = document.querySelector('.transition-static__info--2');
      const info3 = document.querySelector('.transition-static__info--3');
      const closingSection = document.getElementById('transitionClosing');
      const quoteProgressBar = document.getElementById('quoteProgressBar');
      const header = document.getElementById('header');

      // Calcular distancia al final de la sección (en pixels)
      const distanceToBottom = rect.bottom - viewportHeight;

      // Definir umbrales en pixels para las transiciones
      // Cada persona tiene 1 viewport height de espacio
      const closingThreshold = viewportHeight * 0.3;   // 30% del viewport = closing
      const person3Threshold = viewportHeight * 1.3;   // 130% = persona 3 (1vh de espacio)
      const person2Threshold = viewportHeight * 2.3;   // 230% = persona 2 (1vh de espacio)
      // Persona 1 = todo lo demás (> 230%)

      if (distanceToBottom < closingThreshold) {
        // CLOSING QUOTE SECTION
        if (bg1) bg1.classList.remove('active');
        if (bg2) bg2.classList.remove('active');
        if (bg3) bg3.classList.remove('active');
        if (person1) { person1.classList.remove('active'); person1.classList.add('exiting'); }
        if (person2) { person2.classList.remove('active'); person2.classList.add('exiting'); }
        if (person3) { person3.classList.remove('active'); person3.classList.add('exiting'); }
        if (roles1) roles1.classList.remove('active');
        if (roles2) roles2.classList.remove('active');
        if (roles3) roles3.classList.remove('active');
        if (info1) info1.classList.remove('active');
        if (info2) info2.classList.remove('active');
        if (info3) info3.classList.remove('active');

        if (closingSection) {
          closingSection.classList.add('active');
          if (header) header.classList.add('header--quote-active');

          // Progreso del quote (0 a 1)
          const quoteProgress = Math.max(0, Math.min(1, 1 - (distanceToBottom / closingThreshold)));

          // Barra de progreso - crece y se vuelve blanca
          if (quoteProgressBar) {
            quoteProgressBar.style.height = `${quoteProgress * 100}%`;
            quoteProgressBar.style.background = `rgba(255, 255, 255, ${quoteProgress})`;
          }

          // Texto principal - iluminar palabra por palabra
          const quoteText = document.getElementById('quoteText');
          if (quoteText) {
            // Envolver palabras en spans si no están ya
            if (!quoteText.classList.contains('words-wrapped')) {
              const text = quoteText.textContent.trim();
              const words = text.split(/\s+/);
              quoteText.innerHTML = words.map(word => `<span class="quote-word">${word}</span>`).join(' ');
              quoteText.classList.add('words-wrapped');
            }

            // Iluminar palabras según el progreso
            const wordSpans = quoteText.querySelectorAll('.quote-word');
            const totalWords = wordSpans.length;
            const wordsToHighlight = Math.floor(quoteProgress * totalWords);

            wordSpans.forEach((span, index) => {
              if (index < wordsToHighlight) {
                // Palabra iluminada (blanca)
                span.style.color = 'rgba(255, 255, 255, 1)';
                span.style.fontWeight = '400';
              } else {
                // Palabra gris
                span.style.color = 'rgba(100, 110, 130, 0.5)';
                span.style.fontWeight = '300';
              }
            });
          }

          // Subtítulo - también se ilumina con el scroll (cada línea)
          const quoteSubtitleLines = document.querySelectorAll('.quote-subtitle__line');
          if (quoteSubtitleLines.length > 0) {
            const subOpacity = 0.3 + (quoteProgress * 0.7);
            quoteSubtitleLines.forEach(line => {
              line.style.color = `rgba(255, 255, 255, ${subOpacity})`;
            });
          }
        }
      } else if (distanceToBottom < person3Threshold) {
        // PERSONA 3
        if (bg1) bg1.classList.remove('active');
        if (bg2) bg2.classList.remove('active');
        if (bg3) bg3.classList.add('active');
        if (person1) { person1.classList.remove('active'); person1.classList.add('exiting'); }
        if (person2) { person2.classList.remove('active'); person2.classList.add('exiting'); }
        if (person3) { person3.classList.add('active'); person3.classList.remove('exiting'); }
        if (roles1) roles1.classList.remove('active');
        if (roles2) roles2.classList.remove('active');
        if (roles3) roles3.classList.add('active');
        if (info1) info1.classList.remove('active');
        if (info2) info2.classList.remove('active');
        if (info3) info3.classList.add('active');
        if (closingSection) closingSection.classList.remove('active');
        if (header) header.classList.remove('header--quote-active');
      } else if (distanceToBottom < person2Threshold) {
        // PERSONA 2
        if (bg1) bg1.classList.remove('active');
        if (bg2) bg2.classList.add('active');
        if (bg3) bg3.classList.remove('active');
        if (person1) { person1.classList.remove('active'); person1.classList.add('exiting'); }
        if (person2) { person2.classList.add('active'); person2.classList.remove('exiting'); }
        if (person3) { person3.classList.remove('active'); person3.classList.remove('exiting'); }
        if (roles1) roles1.classList.remove('active');
        if (roles2) roles2.classList.add('active');
        if (roles3) roles3.classList.remove('active');
        if (info1) info1.classList.remove('active');
        if (info2) info2.classList.add('active');
        if (info3) info3.classList.remove('active');
        if (closingSection) closingSection.classList.remove('active');
        if (header) header.classList.remove('header--quote-active');
      } else {
        // PERSONA 1 (default)
        if (bg1) bg1.classList.add('active');
        if (bg2) bg2.classList.remove('active');
        if (bg3) bg3.classList.remove('active');
        if (person1) { person1.classList.add('active'); person1.classList.remove('exiting'); }
        if (person2) { person2.classList.remove('active'); person2.classList.remove('exiting'); }
        if (person3) { person3.classList.remove('active'); person3.classList.remove('exiting'); }
        if (roles1) roles1.classList.add('active');
        if (roles2) roles2.classList.remove('active');
        if (roles3) roles3.classList.remove('active');
        if (info1) info1.classList.add('active');
        if (info2) info2.classList.remove('active');
        if (info3) info3.classList.remove('active');
        if (closingSection) closingSection.classList.remove('active');
        if (header) header.classList.remove('header--quote-active');
      }
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

  updateTransition();
}

// =============================================
// Contacto Section - Reveal Animation (scroll-based)
// =============================================
function initContactoReveal() {
  const contactoSection = document.querySelector('.contacto');
  if (!contactoSection) return;

  const invitation = contactoSection.querySelector('.contacto__invitation');
  const formWrapper = contactoSection.querySelector('.contacto__form-wrapper');

  if (!invitation || !formWrapper) return;

  let hasRevealed = false;

  const updateContactoReveal = () => {
    if (hasRevealed) return;

    const rect = contactoSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const headerHeight = 80; // Altura del header fijo

    // Solo revelar cuando el TOP de la sección esté por debajo del header
    // Es decir, cuando rect.top sea menor que headerHeight + un margen
    // Esto significa que la sección ya pasó el header y está visible
    const triggerPoint = headerHeight + 150; // 150px después del header

    if (rect.top < triggerPoint && rect.top > -rect.height) {
      invitation.classList.add('revealed');
      formWrapper.classList.add('revealed');
      hasRevealed = true;
    }
  };

  window.addEventListener('scroll', updateContactoReveal, { passive: true });
  // NO hacer check inicial - solo activar con scroll
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initContactoReveal);


