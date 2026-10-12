(function () {
  'use strict';

  // CSS'in "JS çalışıyor" durumunu bilmesi için
  document.documentElement.classList.add('js');

  var nav = document.getElementById('nav');
  var menuBtn = document.querySelector('.menu-btn');

  // ---------- Mobil menü ----------
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Kapat' : 'Menü';
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
  var root = document.documentElement;
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
    themeBtn.setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');
    themeBtn.setAttribute('title', dark ? 'Açık tema' : 'Koyu tema');
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

  // ---------- Altbilgideki yıl ----------
  var year = document.getElementById('yil');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- E-posta adresini kopyala ----------
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

    // Pano izni yoksa adresi seçili bırak, kullanıcı kendisi kopyalasın
    function selectText() {
      var range = document.createRange();
      range.selectNodeContents(target);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      show('Adres seçildi');
    }

    btn.addEventListener('click', function () {
      var text = target.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { show('Kopyalandı'); }, selectText);
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
  }
})();
