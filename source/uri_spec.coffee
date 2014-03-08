"use strict"

describe 'URI', ()->
  describe '@parse', ()->
    it 'requires a valid uri'
    it 'returns a uri as a URI instance'
    it 'turns uri path into an array'
    it 'parses array params'
    it 'parses hash params'
    it 'parses mixed array and hash params'

  describe '@stringify', ()->
    it 'requires a valid URI instance'
    it 'returns URI instance as a string'
    it 'stringifies array params'
    it 'stringifies hash params'
    it 'stringifies mixed hash and array params'

