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
