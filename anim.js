(function () {
  puppeteer = {};
  puppeteer.animations = {};
  puppeteer._allGroups = [];
  puppeteer._allElements = [];
  puppeteer._allGroupElements = [];
  puppeteer._allElementsSet = new Set();
  puppeteer._windowOffset = 0;
  puppeteer._scrollUp = false;

  puppeteer._update = function () {
    puppeteer._allElementsSet.forEach(function (elem) {
      var rect = elem.getBoundingClientRect();
      var anim = elem.getAttribute('p-animation');
      var animMethod = puppeteer.snakeToCamel(anim);

      if (rect.top < window.innerHeight && rect.top > 0 && !puppeteer._scrollUp) {
        if (!elem.visible) {
          eval(`puppeteer.animations.${animMethod}(elem)`);
          elem.visible = true;
        }
      } else if (puppeteer._scrollUp && rect.top > window.innerHeight) {
        elem.visible = false;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    puppeteer._allElements = document.querySelectorAll('[p-animation]');
    puppeteer._allElements.forEach(function (e) {
      puppeteer._allElementsSet.add(e);
    });

    // puppeteer._update();
  });

  document.addEventListener('scroll', function (e) {
    console.log('Scroll')

    if (window.pageYOffset < puppeteer._windowOffset) {
      puppeteer._scrollUp = true;
    } else {
      puppeteer._scrollUp = false;
    }

    puppeteer._windowOffset = window.pageYOffset;
    // puppeteer._update();
  });

  puppeteer.snakeToCamel = function (s) {
    return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
  }
})();