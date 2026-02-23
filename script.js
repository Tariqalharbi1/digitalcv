document.addEventListener('DOMContentLoaded', function () {
  var root = getComputedStyle(document.documentElement);
  var accent = root.getPropertyValue('--accent').trim() || '#2563eb';
  var nav = document.querySelector('.nav');
  var links = document.querySelector('.nav-links');
  // Hamburger menu and related styles removed; navigation is always visible.
  var langBtn = document.getElementById('lang-toggle');
  var currentLang = localStorage.getItem('lang') || 'en';
  var words = [];
  function applyLang(l) {
    currentLang = l;
    var homeLink = document.querySelector('.nav-links a.link-home') || document.querySelector('.nav-links a[href="#home"]');
    var firstRect = null;
    if (homeLink) {
      firstRect = homeLink.getBoundingClientRect();
      homeLink.style.transition = 'none';
      homeLink.style.transform = 'none';
    }
    document.documentElement.setAttribute('lang', l);
    document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
    var nodes = document.querySelectorAll('[data-en]');
    nodes.forEach(function (el) {
      var text = el.getAttribute(l === 'ar' ? 'data-ar' : 'data-en');
      if (text != null) el.textContent = text;
    });
    document.title = l === 'ar' ? 'طارق | السيرة' : 'Tariq | Portfolio';
    words = l === 'ar'
      ? ['طالب علوم حاسب', 'محلل بيانات', 'مهتم بالذكاء الاصطناعي']
      : ['Computer Science Student', 'Data Analyst', 'AI Enthusiast'];
    if (langBtn) langBtn.textContent = l === 'ar' ? 'AR' : 'EN';
    localStorage.setItem('lang', l);
    if (homeLink && firstRect) {
      var lastRect = homeLink.getBoundingClientRect();
      var dx = firstRect.left - lastRect.left;
      var dy = firstRect.top - lastRect.top;
      homeLink.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      // force reflow
      // eslint-disable-next-line no-unused-expressions
      homeLink.offsetWidth;
      homeLink.style.transition = 'transform .35s ease';
      homeLink.style.transform = 'translate(0,0)';
    }
    var animTargets = [];
    var headerEl = document.querySelector('header');
    if (headerEl) animTargets.push(headerEl);
    var heroEl = document.querySelector('.hero');
    if (heroEl) animTargets.push(heroEl);
    var aboutEl = document.getElementById('about');
    if (aboutEl) animTargets.push(aboutEl);
    var skillsEl = document.getElementById('skills');
    if (skillsEl) animTargets.push(skillsEl);
    var projectsEl = document.getElementById('projects');
    if (projectsEl) animTargets.push(projectsEl);
    var contactEl = document.getElementById('contact');
    if (contactEl) animTargets.push(contactEl);
    var footerEl = document.querySelector('footer');
    if (footerEl) animTargets.push(footerEl);
    animTargets.forEach(function (el) {
      el.animate(
        [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 600, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'both' }
      );
    });
  }
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      applyLang(currentLang === 'en' ? 'ar' : 'en');
    });
  }
  applyLang(currentLang);
  var hero = document.querySelector('.hero-content');
  var typeEl = document.createElement('div');
  typeEl.style.marginTop = '0.75rem';
  typeEl.style.fontSize = 'clamp(1rem,2.5vw,1.25rem)';
  typeEl.style.color = accent;
  typeEl.style.fontWeight = '600';
  typeEl.setAttribute('aria-live', 'polite');
  if (hero) hero.appendChild(typeEl);
  var w = 0, i = 0, deleting = false;
  function typeLoop() {
    var current = words[w];
    if (!deleting) {
      typeEl.textContent = current.slice(0, i + 1);
      i++;
      if (i === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1200);
        return;
      }
    } else {
      typeEl.textContent = current.slice(0, i - 1);
      i--;
      if (i === 0) {
        deleting = false;
        w = (w + 1) % words.length;
      }
    }
    var speed = deleting ? 45 : 75;
    setTimeout(typeLoop, speed);
  }
  typeLoop();
  var fadeTargets = Array.from(document.querySelectorAll('#about, #skills, #projects'));
  fadeTargets.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, easing: 'cubic-bezier(0.2,0.8,0.2,1)', fill: 'both' });
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        if (entry.target.id === 'skills') {
          var items = entry.target.querySelectorAll('.skill-item');
          items.forEach(function (it, idx) {
            it.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 500, easing: 'cubic-bezier(0.2,0.8,0.2,1)', fill: 'both', delay: idx * 90 });
          });
        }
        if (entry.target.id === 'projects') {
          var cards = entry.target.querySelectorAll('.project-card');
          cards.forEach(function (it, idx) {
            it.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 500, easing: 'cubic-bezier(0.2,0.8,0.2,1)', fill: 'both', delay: idx * 90 });
          });
        }
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  fadeTargets.forEach(function (el) { io.observe(el); });
  var sections = Array.from(document.querySelectorAll('section[id]'));
  var linkMap = {};
  Array.from(document.querySelectorAll('.nav-links a')).forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.startsWith('#')) linkMap[href.slice(1)] = a;
  });
  function setActive(id) {
    var keys = Object.keys(linkMap);
    keys.forEach(function (k) {
      var a = linkMap[k];
      if (k === id) {
        a.classList.add('nav-link-active');
        a.setAttribute('aria-current', 'page');
      } else {
        a.classList.remove('nav-link-active');
        a.removeAttribute('aria-current');
      }
    });
  }
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.1 });
  sections.forEach(function (s) { spy.observe(s); });
});
