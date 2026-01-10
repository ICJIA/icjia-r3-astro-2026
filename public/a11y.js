/* jQuery Accessibility Quick Fixes */

(function (a) {
  a.fn.replaceTagName = function (f) {
    var g = [],
      h = this.length;
    while (h--) {
      var k = document.createElement(f),
        b = this[h],
        d = b.attributes;
      for (var c = d.length - 1; c >= 0; c--) {
        var j = d[c];
        k.setAttribute(j.name, j.value);
      }
      k.innerHTML = b.innerHTML;
      a(b).after(k).remove();
      g[h - 1] = k;
    }
    return a(g);
  };

  a.fn.replaceEmptyElements = function (replacementText) {
    if ($(this).innerHTML) return;
    const el = document.createElement("span");
    el.innerHTML = replacementText;
    el.classList.add("aria-hidden");
    $(this).append(el);
  };

  a.fn.removeRedundantAttributes = function (attr) {
    $(this).removeAttr(attr);
  };

  a.fn.addAriaLabel = function (text) {
    $(this).attr(
      "aria-label",
      "Click this to toggle between showing and hiding news article"
    );
  };
})(window.jQuery);

/* DoIT Accessibility Snippet */

/*<![CDATA[*/

(function () {
  var sz = document.createElement("script");
  sz.type = "text/javascript";
  sz.async = true;
  sz.src = "//siteimproveanalytics.com/js/siteanalyze_6123065.js";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(sz, s);
})();

/*]]>*/
