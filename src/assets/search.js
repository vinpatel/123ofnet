// Directory search. Progressive enhancement: every page works without it.
(function () {
  var STOP = /\b(a|an|the|my|for|to|of|with|and|i|want|do|make|ai|tool|tools|best|app|apps)\b/g;
  function words(q) { return q.toLowerCase().replace(STOP, " ").split(/\s+/).filter(Boolean); }
  function hit(hay, ws) {
    return ws.every(function (w) { return hay.indexOf(w) !== -1 || hay.indexOf(w.replace(/s$/, "")) !== -1; });
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var q = new URLSearchParams(location.search).get("q") || "";
  var count = document.querySelector("[data-count]");

  // Category pages: filter the tools already on the page.
  var local = document.querySelector("[data-filter]");
  if (local) {
    var items = document.querySelectorAll("[data-search]");
    var runLocal = function () {
      var ws = words(local.value), shown = 0;
      items.forEach(function (el) { var h = hit(el.getAttribute("data-search"), ws); el.hidden = !h; if (h) shown++; });
      if (count) count.textContent = ws.length ? shown + " of " + items.length + " tools" : "";
    };
    if (q) local.value = q;
    local.addEventListener("input", runLocal);
    runLocal();
  }

  // Directory page: search every tool, loading the index on first use.
  var all = document.querySelector("[data-search-all]");
  if (all) {
    var out = document.querySelector("[data-results]"), browse = document.querySelector("[data-browse]");
    var index = null, loading = null;
    var load = function () {
      loading = loading || fetch(all.getAttribute("data-search-all")).then(function (r) { return r.json(); }).then(function (d) {
        index = d.map(function (t) { return { t: t, hay: (t[0] + " " + t[2] + " " + t[4]).toLowerCase() }; });
      });
      return loading;
    };
    var runAll = function () {
      var ws = words(all.value);
      if (!ws.length) { out.innerHTML = ""; browse.hidden = false; if (count) count.textContent = ""; return; }
      load().then(function () {
        var res = index.filter(function (x) { return hit(x.hay, ws); });
        browse.hidden = true;
        if (count) count.textContent = res.length + " tool" + (res.length === 1 ? "" : "s") + " found";
        out.innerHTML = res.slice(0, 100).map(function (x) {
          var t = x.t;
          return '<div class="listing"><h3><a href="' + esc(t[1]) + '" rel="noopener">' + esc(t[0]) + '</a></h3><p>' + esc(t[2]) +
            '</p><span class="url">' + esc(t[1].replace(/^https?:\/\/(www\.)?/, "")) + '</span> &middot; <a class="small" href="/directory/' + t[3] + '/">' + esc(t[4]) + '</a></div>';
        }).join("") + (res.length > 100 ? '<p class="small center">Showing the first 100. Add another word to narrow it down.</p>' : "");
      });
    };
    all.addEventListener("focus", load, { once: true });
    all.addEventListener("input", runAll);
    if (q) { all.value = q; runAll(); }
  }
})();
