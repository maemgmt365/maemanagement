/* Mae Management — shared behaviors (theme, topbar, reveal, progress, year) */
(function () {
  var root = document.documentElement;
  var KEY = "mae-theme";

  function sync() {
    var dark = root.getAttribute("data-theme") === "dark";
    var sun = document.querySelector("[data-sun]"), moon = document.querySelector("[data-moon]");
    if (sun && moon) { sun.className = dark ? "inactive" : "active"; moon.className = dark ? "active" : "inactive"; }
  }
  try { var saved = localStorage.getItem(KEY); if (saved) root.setAttribute("data-theme", saved); } catch (e) {}
  sync();
  var tg = document.getElementById("themeToggle");
  if (tg) tg.addEventListener("click", function () {
    var n = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", n);
    try { localStorage.setItem(KEY, n); } catch (e) {}
    sync();
  });

  // topbar shrink + scroll progress
  var bar = document.getElementById("navbar"), prog = document.getElementById("progress");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (bar) bar.classList.toggle("shrink", y > 24);
    if (prog) {
      var h = document.documentElement;
      prog.style.width = (y / (h.scrollHeight - h.clientHeight) * 100) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // reveal on scroll
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    // safety net: anything already on screen (or above it) shows even if the observer never fires
    var sweep = function () {
      var h = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { if (el.getBoundingClientRect().top < h) el.classList.add("in"); });
    };
    window.addEventListener("load", function () { setTimeout(sweep, 400); });
    window.addEventListener("scroll", sweep, { passive: true });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  // auto year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
