(function(){
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
    return jasmine.objectContaining(out);
  };

  WITH_SUBDOMAINS = ['www.google.com', 'test.g.com.au', 'sub.domain.g.com.au', 't.e.s.t.ing.co.uk'];

  WITHOUT_SUBDOMAINS = ['google.com', 'google.co.uk', 'google.com.au', 'g.com', 'g.co.uk'];

  describe('URI', function(){
    describe('#parse', function(){
      it('requires a valid uri', function(){
        expect(function(){URI.parse('not a uri')}).toThrow();
      });

      it('parses current uri by default', function(){
        expect(URI.parse()).toEqual(URI.parse(window.location.href));
      });

      it('parses simple uri', function(){
        expect(URI.parse(BASE_URI)).toEqual(uriObject());
      });

      it('parses uri path', function(){
        expect(URI.parse(BASE_URI + 'a/b/c')).toEqual(uriObject({
          path: ['a', 'b', 'c']
        }));
      });

      it('parses array params', function(){
        expect(URI.parse(BASE_URI + '?a[]=1&a[]=2')).toEqual(uriObject({
          params: {
            a: [1, 2]
          }
        }));
      });

      it('parses params with ampersands in values', function() {
        expect(URI.parse(BASE_URI + '?category=big&tall')).toEqual(uriObject({
          params: {
            category: 'big&tall'
          }
        }));
      });

      it('parses hash params', function(){
        expect(URI.parse(BASE_URI + '?o[a_a-a]=bla&o[b]=true')).toEqual(uriObject({
          params: {
            o: {
              'a_a-a': 'bla', b: true
            }
          }
        }));
      });

      it('parses nested array and object params', function(){
        expect(URI.parse(BASE_URI + '?a[][o][key]=value')).toEqual(uriObject({
          params: {
            a: [
              {
                o: {
                  key: 'value'
                }
              }
            ]
          }
        }));
      });

      it('parses boolean params', function(){
        expect(URI.parse(BASE_URI + '?bool=true')).toEqual(uriObject({
          params: {
            bool: true
          }
        }));

        expect(URI.parse(BASE_URI + '?bool=false')).toEqual(uriObject({
          params: {
            bool: false
          }
        }));
      });

      it('parses int params', function(){
        expect(URI.parse(BASE_URI + '?int=1')).toEqual(uriObject({
          params: {
            int: 1
          }
        }));
      });

      it('parses float params', function(){
        expect(URI.parse(BASE_URI + '?float=1.234')).toEqual(uriObject({
          params: {
            float: 1.234
          }
        }));
      });

      it('parses string params', function(){
        expect(URI.parse(BASE_URI + '?string=string')).toEqual(uriObject({
          params: {
            string: 'string'
          }
        }));
      });

      it('parses params with mixed types in nested objects and arrays', function(){
        expect(URI.parse(BASE_URI + '?a[]=1&a[][o]=true&b[q][]=string&b[q][]=string')).toEqual(uriObject({
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

      it('parses uri hash', function(){
        expect(URI.parse(BASE_URI + '#hashyo').hash).toEqual('hashyo');
      });

      it('parses uri port', function(){
        expect(URI.parse('http://nathansplace.co.uk:1234').port).toEqual(1234);
      });
    });
  });

  describe('#stringify', function(){
    it('requires valid URI instance', function(){
      expect(function(){URI.stringify('invalid')}).toThrow();
    });

    it('parses simple URI', function(){
      var uri = URI.parse(BASE_URI);
      expect(URI.stringify(uri)).toEqual(BASE_URI);
    });

    it('parses string params', function(){
      var uri = URI.parse(BASE_URI + '?string=string');
      expect(URI.stringify(uri)).toEqual(BASE_URI + '?string=string');
    });

    it('parses bool params', function(){
      var url = BASE_URI + '?bool=true',
          uri = URI.parse(url);

      expect(URI.stringify(uri)).toEqual(url);
    });

    it('parses hash', function(){
      var url = BASE_URI + '#hash',
          uri = URI.parse(url);

      expect(URI.stringify(uri)).toEqual(url);
    });

    it('parses array params', function(){
      var url = BASE_URI + '?a[]=1&a[]=2',
          uri = URI.parse(url);

      expect(URI.stringify(uri)).toEqual(url);
    });

    it('parses object params', function(){
      var url = BASE_URI + '?o[a]=123',
          uri = URI.parse(url);

      expect(URI.stringify(uri)).toEqual(url);
    });

    it('parses nested array params', function(){
      var url = BASE_URI + '?a[][]=1&a[][]=2',
          uri = URI.parse(url);

      expect(URI.stringify(uri)).toEqual(url);
    });

    it('parses nested object params', function(){
      var url = BASE_URI + '?o[a]=1&o[b]=2',
          uri = URI.parse(url);

      expect(URI.stringify(uri)).toEqual(url);
    });

    it('parses mix of params', function(){
      var url = BASE_URI + '?a[][a]=true&a[]=2&o[a][]=1&o[a][]=2&o[a][]=3',
          uri = URI.parse(url);

      expect(URI.stringify(uri)).toEqual(url);
    });

    it('parses port', function(){
      var url = 'http://asdasd.asd:2222/',
          uri = URI.parse(url);

      expect(URI.stringify(uri)).toEqual(url);
    });
  });
})();

