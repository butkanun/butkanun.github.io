(function () {
  'use strict';

  var root = document.documentElement;

  // CSS'in "JS çalışıyor" durumunu bilmesi için
  root.classList.add('js');

  // ---------- Sayfanın dili ve düğme metinleri ----------
  var lang = (root.getAttribute('lang') || 'tr').slice(0, 2).toLowerCase();
  var TEXT = {
    tr: {
      menu: 'Menü',
      close: 'Kapat',
      copied: 'Kopyalandı',
      selected: 'Seçildi',
      toLight: 'Açık temaya geç',
      toDark: 'Koyu temaya geç',
      light: 'Açık tema',
      dark: 'Koyu tema'
    },
    en: {
      menu: 'Menu',
      close: 'Close',
      copied: 'Copied',
      selected: 'Selected',
      toLight: 'Switch to light theme',
      toDark: 'Switch to dark theme',
      light: 'Light theme',
      dark: 'Dark theme'
    }
  };
  var T = TEXT[lang] || TEXT.tr;

  var nav = document.getElementById('nav');
  var menuBtn = document.querySelector('.menu-btn');

  // ---------- Mobil menü ----------
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? T.close : T.menu;
  }

  if (nav && menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });

    // Bir bağlantıya tıklanınca menü kapansın
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    // Esc tuşu ile kapat
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuBtn.focus();
      }
    });
  }

  // ---------- Açık / koyu tema ----------
  var themeBtn = document.querySelector('.theme-btn');
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  // Seçim yapılmadıysa sistem temasına uy
  function currentTheme() {
    var chosen = root.getAttribute('data-theme');
    if (chosen === 'dark' || chosen === 'light') return chosen;
    return darkQuery && darkQuery.matches ? 'dark' : 'light';
  }

  function syncTheme() {
    var dark = currentTheme() === 'dark';
    themeBtn.setAttribute('aria-label', dark ? T.toLight : T.toDark);
    themeBtn.setAttribute('title', dark ? T.light : T.dark);
    // SVG'de .hidden özelliği çalışmaz, özniteliği doğrudan değiştir
    themeBtn.querySelector('.icon-sun').toggleAttribute('hidden', !dark);
    themeBtn.querySelector('.icon-moon').toggleAttribute('hidden', dark);

    // Telefonda tarayıcı çubuğunun rengi de temaya uysun
    var bg = getComputedStyle(document.body).backgroundColor;
    Array.prototype.forEach.call(document.querySelectorAll('meta[name="theme-color"]'), function (m) {
      m.setAttribute('content', bg);
    });
  }

  if (themeBtn) {
    themeBtn.hidden = false;
    syncTheme();

    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.classList.add('tema-gecis');
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('tema', next); } catch (e) {}
      syncTheme();
      setTimeout(function () { root.classList.remove('tema-gecis'); }, 400);
    });

    if (darkQuery) {
      if (darkQuery.addEventListener) darkQuery.addEventListener('change', syncTheme);
      else if (darkQuery.addListener) darkQuery.addListener(syncTheme);
    }

    // Tema dışarıdan değişirse (ör. barındıran sayfa) düğme de güncellensin
    if ('MutationObserver' in window) {
      new MutationObserver(syncTheme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }
  }

  // ---------- Dil seçimi (TR / EN) ----------
  // İki sayfadaki bölüm kimlikleri: diğer dile geçince aynı bölümde açılsın
  var SECTIONS = [
    ['hakkimda', 'about'],
    ['deneyim', 'experience'],
    ['projeler', 'projects'],
    ['yetenekler', 'skills'],
    ['egitim', 'education'],
    ['sertifikalar', 'certificates'],
    ['iletisim', 'contact']
  ];

  // Ekranın üst yarısına gelmiş son bölüm
  function visibleSectionId() {
    var sections = document.querySelectorAll('main section[id]');
    if (!sections.length) return null;

    // Sayfanın sonundaysan son bölüm (İletişim) yukarı kadar çıkamaz, onu say
    var bottom = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 2;
    if (bottom && window.pageYOffset > 0) return sections[sections.length - 1].id;

    var limit = window.innerHeight * 0.45;
    var found = null;
    Array.prototype.forEach.call(sections, function (s) {
      if (s.getBoundingClientRect().top <= limit) found = s.id;
    });
    return found;
  }

  Array.prototype.forEach.call(document.querySelectorAll('.lang a[hreflang]'), function (link) {
    var href = link.getAttribute('href');

    // Bilgisayarda dosyaya çift tıklayıp açınca klasör yerine sayfa açılsın
    if (location.protocol === 'file:' && /\/$/.test(href)) {
      link.setAttribute('href', href + 'index.html');
    }

    var target = link.getAttribute('hreflang');
    if (target === lang) return;

    link.addEventListener('click', function () {
      var id = visibleSectionId();
      var from = lang === 'en' ? 1 : 0;
      var to = target === 'en' ? 1 : 0;
      var mapped = null;
      SECTIONS.forEach(function (pair) {
        if (pair[from] === id) mapped = pair[to];
      });
      var base = link.getAttribute('href').split('#')[0];
      link.setAttribute('href', mapped ? base + '#' + mapped : base);
    });
  });

  // ---------- Altbilgideki yıl ----------
  var year = document.getElementById('yil');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- E-posta ve telefonu kopyala ----------
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    var target = document.getElementById(btn.getAttribute('data-copy'));
    if (!target) return;

    var label = btn.textContent;
    var timer;
    btn.hidden = false;

    function show(text) {
      btn.textContent = text;
      clearTimeout(timer);
      timer = setTimeout(function () { btn.textContent = label; }, 2500);
    }

    // Pano izni yoksa metni seçili bırak, kullanıcı kendisi kopyalasın
    function selectText() {
      var range = document.createRange();
      range.selectNodeContents(target);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      show(T.selected);
    }

    btn.addEventListener('click', function () {
      var text = target.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { show(T.copied); }, selectText);
      } else {
        selectText();
      }
    });
  });

  // ---------- Hangi bölümdeysen menüde işaretle ----------
  if (nav && 'IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var byId = {};

    links.forEach(function (link) {
      byId[link.getAttribute('href').slice(1)] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.removeAttribute('aria-current'); });
        var active = byId[entry.target.id];
        if (active) active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    // En üste dönünce menüde işaretli bölüm kalmasın
    var hero = document.getElementById('top');
    if (hero) observer.observe(hero);
  }
})();
