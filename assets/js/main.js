// Mobile nav toggle — minimal, keyboard-accessible.
// No third-party scripts. No tracking. No cookies.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.setAttribute('aria-expanded', 'false');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close menu when a link inside is activated (mobile UX).
  nav.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.matches && t.matches('a')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
