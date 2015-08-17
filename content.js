(function() {
  'use strict';
  var ClickContainer = (function() {
    var mouse = { ox: null, oy: null },
        spaceHeld, hasScrolled, container, listenersActive = false;
    var listeners = {
      keyup: function(event) {
        if (event.which === 32) {
          spaceHeld = hasScrolled = false;
          container.style.display = 'none';
          mouse.ox = mouse.oy = null;
        }
      },
      keydown: function(event) {
        if (event.which === 32) {
          event.preventDefault();
          container.style.display = 'block';
          spaceHeld = true;
        }
      },
      mousemove: function(event) {
        if (spaceHeld && !hasScrolled) {
          if (mouse.ox === null || mouse.oy === null) {
            mouse.ox = document.body.scrollLeft + event.x;
            mouse.oy = document.body.scrollTop  + event.y;
          }
          document.body.scrollLeft = mouse.ox - event.x;
          document.body.scrollTop  = mouse.oy - event.y;
        }
      },
      mousewheel: function(event) {
        if (spaceHeld) {
          hasScrolled = true;
          document.body.style.zoom = (+document.body.style.zoom || 1) +
            (event.deltaY < 0 ? 1 : -1) * 0.1;
        }
        return true;
      },
      mousedown: function(event) {
        if (spaceHeld) {
          event.preventDefault();
          document.body.style.zoom = 1;
        }
      }
    };
    return {
      init: function() {
        if (listenersActive)
          this.stop();
        container = document.createElement('div');
        container.id = 'click-container';
        document.body.appendChild(container);
        Object.getOwnPropertyNames(listeners).forEach(function(name) {
          document.addEventListener(name, listeners[name], false);
        });
        listenersActive = true;
      },
      stop: function() {
        if (listenersActive)
          container.remove();
        Object.getOwnPropertyNames(listeners).forEach(function(name) {
          document.removeEventListener(name, listeners[name], false);
        });
        listenersActive = false;
      },
    };
  })();

  function documentIsImage() {
    return document.contentType.indexOf('image/') === 0 ||
      (location.host === 'i.imgur.com' && /\.gifv([#?].*)?$/.test(location.href));
  }

  function waitForLoad(callback, constructor) {
    if (document.readyState !== 'loading' && document.activeElement) {
      callback.call(constructor);
      return;
    }
    setTimeout(function() {
      waitForLoad(callback, constructor);
    }, 5);
  }

  if (documentIsImage()) {
    chrome.runtime.sendMessage({});
    waitForLoad(function() {
      ClickContainer.init();
    });
  }
})();
