"use strict"

BASE_URI = 'http://nathansplace.co.uk/'

uriObject = (args={})->
  out = {}
  out.protocol = args.protocol ||'http:'
  out.subdomain = args.subdomain || null
  out.host = args.host || 'nathansplace.co.uk'
  out.port = args.port || null
  out.path = args.path || []
  out.params = args.params || {}
  out.hash = args.hash || null

  out

WITH_SUBDOMAINS = [
  'www.google.com',
  'test.g.com.au',
  'sub.domain.g.com.au',
  't.e.s.t.ing.co.uk'
]

WITHOUT_SUBDOMAINS = [
  'google.com',
  'google.co.uk',
  'google.com.au',
  'g.com',
  'g.co.uk'
]

describe 'URI', ()->
  describe 'Object definition', ->
    describe 'AMD environment', ->
      it 'defines an AMD module'
    describe 'not AMD', ->
      it 'defines window.URI', ()->
        window.URI.should.eql URI

  describe '@parse', ()->
    it 'requires a valid uri', ()->
      fn = ()->
        URI.parse('not a uri folks')

      expect(fn).to.throw 'URI.parse requires a valid uri.'

    it 'parses current uri by default', ()->
      URI.parse().should.eql URI.parse(window.location.href)

    it 'returns a basic uri as a URI instance', ()->
      URI.parse(BASE_URI).should.eql uriObject()

    it 'parses uri path into an array', ()->
      URI.parse("#{BASE_URI}projects/javascript/uri-js").should.eql uriObject
        path: ['projects', 'javascript', 'uri-js'],

    describe 'params', ()->
      it 'parses array params', ()->
        URI.parse("#{BASE_URI}?array[]=1&array[]=2")
        .should.eql uriObject
          params:
            array: [1, 2]

      it 'parses hash params', ()->
        URI.parse("#{BASE_URI}?object[bunny]=oscar&object[chickens]=true")
        .should.eql uriObject
          params:
            object:
              bunny: 'oscar',
              chickens: true

      it 'parses nested array and hash params', ()->
        URI.parse("#{BASE_URI}?array[][hash][key]=value").should.eql uriObject
          params:
            array: [
              hash:
                key: "value"
            ]

      it 'parses boolean params', ()->
        URI.parse("#{BASE_URI}?nathan=true").should.eql uriObject
          params:
            nathan: true

      it 'parses integer params', ()->
        URI.parse("#{BASE_URI}?integer=1").should.eql uriObject
          params:
            integer: 1

      it 'parses float params', ()->
        URI.parse("#{BASE_URI}?float=1.23").should.eql uriObject
          params:
            float: 1.23

      it 'parses string params', ()->
        URI.parse("#{BASE_URI}?nathan=person").should.eql uriObject
          params:
            nathan: 'person'

      it 'parses params with mixed types in nested objects and arrays', ()->
        URI.parse("#{BASE_URI}?a[]=1&a[][o]=true&b[q][]=string&b[q][]=string")
        .should.eql uriObject
          params:
            a: [
              1,
              {o: true}
            ],
            b:
              q: ['string', 'string']

    it 'parses uri with hash', ()->
      URI.parse("#{BASE_URI}#hashyo").should.eql uriObject({hash: 'hashyo'})

    it 'parses uri with subdomain'

  describe '@stringify', ()->
    it 'requires a valid URI instance', ()->
      fn = ()->
        URI.stringify({valid: false})

      expect(fn).to.throw 'URI.stringify requires valid uri object.'
    it 'returns URI instance as a string', ()->
      URI.stringify(uriObject()).should.eql BASE_URI

    it 'stringifies string params', ()->
      URI.stringify(uriObject({params: {string: 'working'}}))
      .should.eql "#{BASE_URI}?string=working"

    it 'stringifies boolean params', ()->
      URI.stringify(uriObject({params: {true: true, false: false}}))
      .should.eql "#{BASE_URI}?true=true&false=false"

    it 'stringifies uri hashes', ()->
      URI.stringify(uriObject({hash: 'hash'})).should.eql "#{BASE_URI}#hash"

    it 'stringifies array params', ()->
      URI.stringify(uriObject({params: {array: [1,2,3]}}))
      .should.eql "#{BASE_URI}?array[]=1&array[]=2&array[]=3"

    it 'stringifies object params', ()->
      URI.stringify(uriObject({params: {object: {a: 1, b: true, c: 'three'}}}))
      .should.eql "#{BASE_URI}?object[a]=1&object[b]=true&object[c]=three"

    it 'stringifies nested array params', ()->
      URI.stringify(uriObject({params: {array: [[1,2,3]]}}))
      .should.eql "#{BASE_URI}?array[][]=1&array[][]=2&array[][]=3"

    it 'stringifies nested object params', ()->
      URI.stringify(uriObject({params: {o: {a: 1, b: 2, c: 3}}}))
      .should.eql "#{BASE_URI}?o[a]=1&o[b]=2&o[c]=3"

    it 'stringifies a complex mix of params', ()->
      URI.stringify(uriObject({params: a: [{a: true}, 2], o: {a: [1,2,3]}}))
        .should.eql "#{BASE_URI}?a[][a]=true&a[]=2&o[a][]=1&o[a][]=2&o[a][]=3"

