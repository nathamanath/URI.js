(function() {
  "use strict";
  var BASE_URI, WITHOUT_SUBDOMAINS, WITH_SUBDOMAINS, uriObject;

  BASE_URI = 'http://nathansplace.co.uk/';

  uriObject = function(args) {
    var out;
    if (args == null) {
      args = {};
    }
    out = {};
    out.protocol = args.protocol || 'http:';
    out.subdomain = args.subdomain || null;
    out.host = args.host || 'nathansplace.co.uk';
    out.port = args.port || null;
    out.path = args.path || [];
    out.params = args.params || {};
    out.hash = args.hash || null;
    return out;
  };

  WITH_SUBDOMAINS = ['www.google.com', 'test.g.com.au', 'sub.domain.g.com.au', 't.e.s.t.ing.co.uk'];

  WITHOUT_SUBDOMAINS = ['google.com', 'google.co.uk', 'google.com.au', 'g.com', 'g.co.uk'];

  describe('URI', function() {
    describe('Object definition', function() {
      describe('AMD environment', function() {
        return it('defines an AMD module');
      });
      return describe('not AMD', function() {
        return it('defines window.URI', function() {
          return window.URI.should.eql(URI);
        });
      });
    });
    describe('@parse', function() {
      it('requires a valid uri', function() {
        var fn;
        fn = function() {
          return URI.parse('not a uri folks');
        };
        return expect(fn).to["throw"]('URI.parse requires a valid uri.');
      });
      it('parses current uri by default', function() {
        return URI.parse().should.eql(URI.parse(window.location.href));
      });
      it('returns a basic uri as a URI instance', function() {
        return URI.parse(BASE_URI).should.eql(uriObject());
      });
      it('parses uri path into an array', function() {
        return URI.parse("" + BASE_URI + "projects/javascript/uri-js").should.eql(uriObject({
          path: ['projects', 'javascript', 'uri-js']
        }));
      });
      describe('params', function() {
        it('parses array params', function() {
          return URI.parse("" + BASE_URI + "?array[]=1&array[]=2").should.eql(uriObject({
            params: {
              array: [1, 2]
            }
          }));
        });
        it('parses hash params', function() {
          return URI.parse("" + BASE_URI + "?object[bunny]=oscar&object[chickens]=true").should.eql(uriObject({
            params: {
              object: {
                bunny: 'oscar',
                chickens: true
              }
            }
          }));
        });
        it('parses nested array and hash params', function() {
          return URI.parse("" + BASE_URI + "?array[][hash][key]=value").should.eql(uriObject({
            params: {
              array: [
                {
                  hash: {
                    key: "value"
                  }
                }
              ]
            }
          }));
        });
        it('parses boolean params', function() {
          return URI.parse("" + BASE_URI + "?nathan=true").should.eql(uriObject({
            params: {
              nathan: true
            }
          }));
        });
        it('parses integer params', function() {
          return URI.parse("" + BASE_URI + "?integer=1").should.eql(uriObject({
            params: {
              integer: 1
            }
          }));
        });
        it('parses float params', function() {
          return URI.parse("" + BASE_URI + "?float=1.23").should.eql(uriObject({
            params: {
              float: 1.23
            }
          }));
        });
        it('parses string params', function() {
          return URI.parse("" + BASE_URI + "?nathan=person").should.eql(uriObject({
            params: {
              nathan: 'person'
            }
          }));
        });
        return it('parses params with mixed types in nested objects and arrays', function() {
          return URI.parse("" + BASE_URI + "?a[]=1&a[][o]=true&b[q][]=string&b[q][]=string").should.eql(uriObject({
            params: {
              a: [
                1, {
                  o: true
                }
              ],
              b: {
                q: ['string', 'string']
              }
            }
          }));
        });
      });
      it('parses uri with hash', function() {
        return URI.parse("" + BASE_URI + "#hashyo").should.eql(uriObject({
          hash: 'hashyo'
        }));
      });
      return it('parses uri with subdomain');
    });
    return describe('@stringify', function() {
      it('requires a valid URI instance', function() {
        var fn;
        fn = function() {
          return URI.stringify({
            valid: false
          });
        };
        return expect(fn).to["throw"]('URI.stringify requires valid uri object.');
      });
      it('returns URI instance as a string', function() {
        return URI.stringify(uriObject()).should.eql(BASE_URI);
      });
      it('stringifies string params', function() {
        return URI.stringify(uriObject({
          params: {
            string: 'working'
          }
        })).should.eql("" + BASE_URI + "?string=working");
      });
      it('stringifies boolean params', function() {
        return URI.stringify(uriObject({
          params: {
            "true": true,
            "false": false
          }
        })).should.eql("" + BASE_URI + "?true=true&false=false");
      });
      it('stringifies uri hashes', function() {
        return URI.stringify(uriObject({
          hash: 'hash'
        })).should.eql("" + BASE_URI + "#hash");
      });
      it('stringifies array params', function() {
        return URI.stringify(uriObject({
          params: {
            array: [1, 2, 3]
          }
        })).should.eql("" + BASE_URI + "?array[]=1&array[]=2&array[]=3");
      });
      it('stringifies object params', function() {
        return URI.stringify(uriObject({
          params: {
            object: {
              a: 1,
              b: true,
              c: 'three'
            }
          }
        })).should.eql("" + BASE_URI + "?object[a]=1&object[b]=true&object[c]=three");
      });
      it('stringifies nested array params', function() {
        return URI.stringify(uriObject({
          params: {
            array: [[1, 2, 3]]
          }
        })).should.eql("" + BASE_URI + "?array[][]=1&array[][]=2&array[][]=3");
      });
      it('stringifies nested object params', function() {
        return URI.stringify(uriObject({
          params: {
            o: {
              a: 1,
              b: 2,
              c: 3
            }
          }
        })).should.eql("" + BASE_URI + "?o[a]=1&o[b]=2&o[c]=3");
      });
      return it('stringifies a complex mix of params', function() {
        return URI.stringify(uriObject({
          params: {
            a: [
              {
                a: true
              }, 2
            ],
            o: {
              a: [1, 2, 3]
            }
          }
        })).should.eql("" + BASE_URI + "?a[][a]=true&a[]=2&o[a][]=1&o[a][]=2&o[a][]=3");
      });
    });
  });

}).call(this);
