// Directory filter: progressive enhancement, the page works without it.
(function () {
  var input = document.querySelector("[data-filter]");
  if (!input) return;
  var items = document.querySelectorAll("[data-search]");
  var sections = document.querySelectorAll("[data-cat]");
  var count = document.querySelector("[data-count]");
  var stop = /\b(a|an|the|my|for|to|of|with|and|i|want|do|make|ai|tool|tools)\b/g;
  function run() {
    var words = input.value.toLowerCase().replace(stop, " ").split(/\s+/).filter(Boolean);
    var shown = 0;
    items.forEach(function (el) {
      var hay = el.getAttribute("data-search");
      var hit = words.every(function (w) { return hay.indexOf(w) !== -1 || hay.indexOf(w.replace(/s$/, "")) !== -1; });
      el.hidden = !hit; if (hit) shown++;
    });
    sections.forEach(function (s) { s.hidden = !s.querySelector("[data-search]:not([hidden])"); });
    if (count) count.textContent = words.length ? shown + " tool" + (shown === 1 ? "" : "s") + " found" : "";
  }
  var q = new URLSearchParams(location.search).get("q");
  if (q) input.value = q;
  input.addEventListener("input", run);
  run();
})();
