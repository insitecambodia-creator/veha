(function () {
  'use strict';

  /* n8n webhook that receives trial requests (Webhook node, method POST).
     Paste the Production URL here. While empty, the form tells visitors to phone instead.
     The webhook must allow this site's origin (Webhook node > Options > Allowed Origins). */
  var LEAD_ENDPOINT = '';

  /* ---------- Motion ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calm && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll(
      '.section-head, .notebook .split > div:first-child, .pairs > div, .till, .feature-list li, .note, .plan, .extras, .photo-row .ph, .clients, .faq h2, details, .trial-grid > *'
    ).forEach(function (el) {
      var sibs = el.parentElement ? [].slice.call(el.parentElement.children) : [];
      el.style.setProperty('--d', Math.min(sibs.indexOf(el), 5) * 0.07 + 's');
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* ---------- Language ---------- */
  var KM = JSON.parse(document.getElementById('km-data').textContent);

  var nodes = document.querySelectorAll('[data-i18n]');
  var EN = {};
  nodes.forEach(function (n) { EN[n.getAttribute('data-i18n')] = n.innerHTML; });

  function setLang(lang) {
    document.documentElement.lang = lang;
    nodes.forEach(function (n) {
      var k = n.getAttribute('data-i18n');
      n.innerHTML = (lang === 'km' && KM[k]) ? KM[k] : EN[k];
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    try { localStorage.setItem('veha-lang', lang); } catch (e) {}
  }
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });
  var saved = null;
  try { saved = localStorage.getItem('veha-lang'); } catch (e) {}
  if (saved === 'km') setLang('km');

  /* ---------- Mobile nav ---------- */
  var nav = document.getElementById('nav');
  var menuBtn = document.querySelector('.menu-btn');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- Demo till ---------- */
  var MENU = [
    { id: 'latte', name: 'Iced latte', price: 2.5, c: 'a' },
    { id: 'capp', name: 'Cappuccino', price: 2.75, c: 'b' },
    { id: 'coco', name: 'Coconut coffee', price: 2.25, c: 'c' },
    { id: 'amer', name: 'Iced americano', price: 2.0, c: 'd' },
    { id: 'crois', name: 'Butter croissant', price: 1.5, c: 'a', out: true }
  ];
  var bill = [];
  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) { return '$' + n.toFixed(2); };

  var itemsEl = $('items');
  MENU.forEach(function (m) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'item';
    b.dataset.c = m.c;
    b.setAttribute('role', 'listitem');
    b.innerHTML = '<span>' + m.name + '</span><small>' + (m.out ? 'Out of stock today' : money(m.price)) + '</small>';
    if (m.out) b.disabled = true;
    else b.addEventListener('click', function () { addItem(m); });
    itemsEl.appendChild(b);
  });

  function addItem(m) {
    $('done').hidden = true;
    var sizeInput = document.querySelector('input[name=size]:checked');
    var size = parseFloat(sizeInput.value);
    var extras = [].slice.call(document.querySelectorAll('input[name=extra]:checked'));
    var add = extras.reduce(function (s, e) { return s + parseFloat(e.value); }, 0);
    bill.push({
      name: m.name,
      detail: [size ? 'Large' : 'Medium'].concat(extras.map(function (e) { return e.dataset.name; })).join(', '),
      price: m.price + size + add
    });
    extras.forEach(function (e) { e.checked = false; });
    render();
  }

  function render() {
    var list = $('lines');
    list.innerHTML = '';
    bill.forEach(function (l, i) {
      var li = document.createElement('li');
      var left = document.createElement('div');
      var n = document.createElement('span'); n.className = 'what'; n.textContent = l.name;
      var d = document.createElement('span'); d.className = 'sub'; d.textContent = l.detail;
      left.appendChild(n); left.appendChild(d);
      var right = document.createElement('div');
      right.style.textAlign = 'right';
      var p = document.createElement('span'); p.className = 'what'; p.textContent = money(l.price);
      var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'rm'; rm.textContent = 'Remove';
      rm.setAttribute('aria-label', 'Remove ' + l.name);
      rm.addEventListener('click', function () { bill.splice(i, 1); render(); });
      right.appendChild(p); right.appendChild(rm);
      li.appendChild(left); li.appendChild(right);
      list.appendChild(li);
    });
    var sub = bill.reduce(function (s, l) { return s + l.price; }, 0);
    var disc = $('disc').checked ? sub * 0.1 : 0;
    $('sub').textContent = money(sub);
    $('discRow').hidden = !disc;
    $('discAmt').textContent = '−' + money(disc);
    $('total').textContent = money(sub - disc);
    $('empty').hidden = bill.length > 0;
    $('charge').disabled = $('clear').disabled = bill.length === 0;
  }
  $('disc').addEventListener('change', render);
  $('clear').addEventListener('click', function () { bill = []; $('disc').checked = false; render(); });
  $('charge').addEventListener('click', function () {
    bill = []; $('disc').checked = false; render(); $('done').hidden = false;
  });
  render();

  /* ---------- Lead form ---------- */
  var form = $('lead');
  var msg = $('formMsg');
  function show(text, ok) {
    msg.textContent = text; msg.className = 'form-msg' + (ok ? ' ok' : ''); msg.hidden = false;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [].slice.call(form.querySelectorAll('[required]')).filter(function (f) { return !f.value.trim(); });
    form.querySelectorAll('input').forEach(function (f) { f.removeAttribute('aria-invalid'); });
    if (bad.length) {
      bad.forEach(function (f) { f.setAttribute('aria-invalid', 'true'); });
      bad[0].focus();
      show('Please fill in your business name, your name and a phone number.', false);
      return;
    }
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    if (data._gotcha) return;
    delete data._gotcha;

    if (!LEAD_ENDPOINT) {
      show('Our online form is not switched on yet. Please call 093 923 030 and we will set up your trial.', false);
      return;
    }
    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    data.lang = document.documentElement.lang;
    data.page = location.href;
    data.submittedAt = new Date().toISOString();
    fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      form.reset();
      show('Thank you. We have your details and will call you to set up your free trial.', true);
    }).catch(function () {
      show('We could not send your request. Please try again or call 093 923 030.', false);
    }).then(function () { btn.disabled = false; });
  });
})();
