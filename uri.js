(function() {
  'use strict';
  (function(window) {

    /**
     * @fileoverview URI
     * @author <a href="http://nathansplace.co.uk">NathanG</a>
     * @version 0.0.1
     */

    /**
     * @class URI
     */
      var castValue,
          deepMerge,
          emptyObject,
          hasNestedKeys,
          keyValueAsJs,
          nestedKeysAsArray,
          nestedKeysAsJs,
          parseParams,
          toString,
          validUriObject,
          valueType;

      var pathnameToPath = function(pathname){
        return pathname.substring(1).split('/');
      };

      function URI(a) {
        this.protocol = a.protocol || null;
        this.subdomain = a.subdomain || null;
        this.host = a.hostname || null;
        this.port = a.port && (a.port * 1) !== 0 ? a.port : null;
        this.path = a.pathname !== '/' ? pathnameToPath(a.pathname) : [];
        this.params = a.search ? parseParams(a.search) : {};
        this.hash = a.hash.substring(1) || null;
        return this;
      }


      /**
       * Parses uri string to uri object
       * @memberOf URI
       * @Param {string} uri - A uri string.
       */

      URI.parse = function(href) {
        var a;
        if (typeof href === 'undefined') {
          href = window.location.href;
        }
        if (!(href.match(/^(ftp|http|https|file):\/\/[^ "]+$/))) {
          throw new Error('URI.parse requires a valid uri.');
        }
        a = document.createElement('a');
        a.href = href;
        return new URI(a);
      };


      /**
       * Stringifies a uri object
       * @memberOf URI
       * @param {object} uriObject - A valid uri js object.
       */

      URI.stringify = function(uri) {
        var out,
            hash = uri.hash,
            port = uri.port,
            path = uri.path;

        if(!validUriObject(uri)){
          throw new Error('URI.stringify requires valid uri object.');
        }

        out = uri.protocol + '//' + uri.host + '/';

        if(port){ out += port; }
        if(path){ out += path.join('/'); }

        if (!emptyObject(uri.params)) {
          var output = [],
          _ref = uri.params;
          for(var k in _ref) {
            if(_ref.hasOwnProperty(k)){
              var v = _ref[k];
              output.push(toString(k, v));
            }
          }
          out += '?' + (output.join('&'));
        }

        if(hash){ out += '#' + hash; }

        return out;
      };

      validUriObject = function(uri) {
        var key, keys, valid, _i, _len;
        keys = ['protocol', 'port', 'path', 'params', 'hash'];
        valid = true;
        for(_i = 0, _len = keys.length; _i < _len; _i++) {
          key = keys[_i];
          if (!uri.hasOwnProperty(key)) {
            valid = false;
          }
        }
        return valid;
      };

      toString = function(key, value) {
        var out, v, _i, _len;
        out = [];
        if (value instanceof Array) {
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            v = value[_i];
            out.push(toString(key + '[]', v));
          }
        } else if (typeof value === 'object') {
          for(var k in value){
            if(value.hasOwnProperty(k)){
              v = value[k];
              out.push(toString(key + '[' + k + ']', v));
            }
          }
        } else {
          return key + '=' + value;
        }
        return out.join('&');
      };

      emptyObject = function(object) {
        return Object.getOwnPropertyNames(object).length === 0;
      };

      deepMerge = function(destination, object) {
        var k, v;
        for(k in object){
          if(object.hasOwnProperty(k)){
            v = object[k];
            if (destination[k] instanceof Array && v instanceof Array) {
              destination[k] = destination[k].concat(v);
            } else if (typeof destination[k] === 'object' && typeof v === 'object') {
              destination[k] = deepMerge(destination[k], v);
            } else {
              destination[k] = v;
            }
          }
        }
        return destination;
      };

      valueType = function(value) {
        if (value.match(/^(true|false)+$/)) {
          return 'bool';
        }
        if (value.match(/^[0-9]*[.]*[0-9]+$/)) {
          return 'num';
        }
        return 'str';
      };

      castValue = function(value) {
        switch (valueType(value)) {
        case 'bool':
          return !!value;
        case 'num':
          return parseFloat(value);
        default:
          return value;
        }
      };

      hasNestedKeys = function(key) {
        return key.match(/\[/);
      };

      nestedKeysAsArray = function(key) {
        var keys, splitKeys;
        keys = [];
        splitKeys = key.match(/([a-zA-Z0-9]+)(\[[0-9a-zA-z]*\])/);
        keys.push(splitKeys[1]);
        keys = keys.concat(splitKeys[2].match(/\[([a-zA-Z0-9]*)\]/g));
        return keys;
      };

      nestedKeysAsJs = function(keys, value) {
        var key, out, _i;
        for (_i = keys.length - 1; _i >= 0; _i += -1) {
          key = keys[_i];
          if (key === '[]') {
            out = [value];
          } else {
            out = {};
            out[key.replace(/\[|\]/g, '')] = value;
          }
          value = out;
        }
        return value;
      };

      keyValueAsJs = function(key, value) {
        var out;
        out = {};
        out[key] = castValue(value);
        return out;
      };

      parseParams = function(search) {
        var keys, output, pair, param, params, value, _i, _len;
        params = search.split('&');
        output = {};
        for (_i = 0, _len = params.length; _i < _len; _i++) {
          param = params[_i];
          pair = param.replace('?', '').split('=');
          if (hasNestedKeys(pair[0])) {
            keys = nestedKeysAsArray(pair[0]);
            value = nestedKeysAsJs(keys, castValue(pair[1]));
          } else {
            value = keyValueAsJs(pair[0], pair[1]);
          }
          output = deepMerge(output, value);
        }
        return output;
      };

    window.URI = URI;
  })(window);
}).call(this);

