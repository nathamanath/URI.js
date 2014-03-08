(function() {
  "use strict";
  describe('URI', function() {
    describe('@parse', function() {
      it('requires a valid uri');
      it('returns a uri as a URI instance');
      it('turns uri path into an array');
      it('parses array params');
      it('parses hash params');
      return it('parses mixed array and hash params');
    });
    return describe('@stringify', function() {
      it('requires a valid URI instance');
      it('returns URI instance as a string');
      it('stringifies array params');
      it('stringifies hash params');
      return it('stringifies mixed hash and array params');
    });
  });

}).call(this);
