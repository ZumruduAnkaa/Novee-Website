/* ============================================================
   NOVÉE VERSBAR — Hoofd JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. HAMBURGER MENU ── */
  const hamburger   = document.querySelector('.hamburger');
  const mobileMenu  = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (hamburger && mobileMenu) {

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', !isOpen);

      // Vergrendel body scrollen als menu open is
      document.body.style.overflow = isOpen ? '' : '';
    });

    // Sluit menu bij klik op link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Sluit menu bij klik buiten
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ── 2. NAVBAR SCROLL EFFECT ── */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // direct checken
  }


  /* ── 3. ACTIEVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });


  /* ── 4. MENU PAGINA — STICKY TABS ── */
  const menuTabs       = document.querySelectorAll('.menu-tab');
  const menuCategories = document.querySelectorAll('.menu-category');

  if (menuTabs.length > 0) {

    // Klik op tab → scroll naar categorie
    menuTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = document.getElementById(tab.dataset.target);
        if (target) {
          const navH    = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
          const menuNavH = document.querySelector('.menu-nav-wrap')?.offsetHeight || 0;
          const offset  = navH + menuNavH + 16;
          const top     = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    // Scroll → highlight actieve tab
    const observerOptions = {
      rootMargin: `-${80 + 64}px 0px -60% 0px`,
      threshold: 0,
    };

    const tabObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          menuTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.target === id);
          });
        }
      });
    }, observerOptions);

    menuCategories.forEach(cat => tabObserver.observe(cat));
  }


  /* ── 5. FADE-IN ANIMATIE BIJ SCROLLEN ── */
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => fadeObserver.observe(el));
  }


  /* ── 6. PARALLAX HERO (alleen desktop) ── */
  const heroBg = document.querySelector('.hero-bg');

  if (heroBg) {
    // Parallax enkel op niet-touch apparaten (= geen mobiel)
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (!isTouchDevice) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          heroBg.style.transform = `translateY(${scrollY * 0.25}px)`;
        }
      }, { passive: true });
    } else {
      // Op mobiel: geen transform, background-attachment: scroll (niet fixed)
      heroBg.style.transform = 'none';
    }
  }


  /* ── 7. OPENINGSUREN — HUIDIGE DAG MARKEREN ── */
  const hoursRows = document.querySelectorAll('.hours-table tr');

  if (hoursRows.length > 0) {
    // 0=Zo, 1=Ma, 2=Di, 3=Wo, 4=Do, 5=Vr, 6=Za
    const jsDay = new Date().getDay();
    // Volgorde in tabel: Ma, Di, Wo, Do, Vr, Za, Zo → index 0-6
    // Mapping: js 0=Zo→6, 1=Ma→0, 2=Di→1, ...
    const tableIndex = jsDay === 0 ? 6 : jsDay - 1;

    hoursRows.forEach((row, i) => {
      if (i === tableIndex) row.classList.add('today');
    });
  }


  /* ── 7. SCROLL TO TOP BUTTON ── */
  const scrollTopBtn = document.getElementById('scrollTop');

  if (scrollTopBtn) {
    // Toon/verberg knop op basis van scrollpositie
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    // Scroll naar boven bij klik
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ── 8. SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
