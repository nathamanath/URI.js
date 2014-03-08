(function() {
  (function(window) {
    "use strict";
    var URI;
    return URI = (function() {
      function URI(a) {
        this.protocol = a.protocol || null;
        this.host = a.hostname || null;
        this.port = a.port || null;
        this.path = a.pathname.split('/') || null;
        this.params = a.search || null;
        this.hash = a.hash || null;
        this;
      }

      URI.parse = function(href) {
        var a;
        if (href == null) {
          href = window.location.href;
        }
        a = document.createElement('a');
        a.href = href;
        return new this(a);
      };

      URI.stringify = function(uri) {
        var hash, out, params, path, port;
        out = "" + uri.protocol + uri.host;
        if (port = uri.port) {
          out += port;
        }
        if (path = uri.path) {
          out += path.join('/');
        }
        if (params = uri.params) {
          out += params;
        }
        if (hash = uri.hash) {
          out += hash;
        }
        return out;
      };

      return URI;

    })();
  })(window);

}).call(this);
