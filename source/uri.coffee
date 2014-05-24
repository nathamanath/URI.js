do(window)->
  "use strict"

  # TODO: AMD suport
  # TODO: SRP yo! Seperate parse uri object and stringify out into own objects,
  # with uri as a facade
  # TODO: parse subdomains

  ###*
   * @fileoverview URI
   * @author <a href="http://nathansplace.co.uk">NathanG</a>
   * @version 0.0.1
  ###

  ###*
   * @class URI
  ###

  class window.URI
    constructor: (a)->
      @protocol = a.protocol || null
      @subdomain = a.subdomain || null
      @host = a.hostname || null
      @port = if a.port && (a.port * 1) != 0 then a.port else null

      @path = if a.pathname != '/'
        a.pathname.substring(1).split('/')
      else
        []

      @params = if a.search then parseParams(a.search) else {}
      @hash = a.hash.substring(1) || null

      @

    ###*
     * Parses uri string to uri object
     * @memberOf URI
     * @Param {string} uri - A uri string.
    ###

    @parse: (href=window.location.href)->
      unless(href.match(/^(ftp|http|https|file):\/\/[^ "]+$/))
        throw new Error('URI.parse requires a valid uri.')

      a = document.createElement('a')
      a.href = href
      new @(a)

    ###*
     * Stringifies a uri object
     * @memberOf URI
     * @param {object} uriObject - A valid uri js object.
    ###

    @stringify: (uri)->
      unless validUriObject(uri)
        throw new Error('URI.stringify requires valid uri object.')

      out = "#{uri.protocol}//#{uri.host}/"
      out += port if port = uri.port
      out += path.join('/') if path = uri.path

      if !emptyObject(uri.params)
        output = []
        for k, v of uri.params
          output.push toString(k, v)
        out += "?#{output.join('&')}"

      out += "##{hash}" if hash = uri.hash

      out

    validUriObject = (uri)->
      keys = ['protocol', 'port', 'path', 'params', 'hash']
      valid = true

      for key in keys
        valid = false unless uri.hasOwnProperty(key)

      return valid

    toString = (key, value)->
      out = []

      if value instanceof Array
        for v in value
          out.push toString("#{key}[]", v)
      else if typeof value is 'object'
        for k, v of value
          out.push toString("#{key}[#{k}]", v)
      else
        return "#{key}=#{value}"

      return out.join('&')

    emptyObject = (object)->
      Object.getOwnPropertyNames(object).length is 0

    deepMerge = (destination, object)->
      for k, v of object
        if(destination[k] instanceof Array &&  v instanceof Array)
          destination[k] = destination[k].concat(v)
        else if(typeof destination[k] is 'object' && typeof v is 'object')
          destination[k] = deepMerge(destination[k], v)
        else
          destination[k] = v
      destination

    valueType = (value)->
      return 'bool' if value.match(/^(true|false)+$/)
      return 'num' if value.match(/^[0-9]*[.]*[0-9]+$/) # int / float
      return 'str'

    castValue = (value)->
      switch valueType(value)
        when 'bool'
          return !!value
        when 'num'
          return parseFloat value
        else
          return value

    hasNestedKeys = (key)->
      key.match(/\[/)

    nestedKeysAsArray = (key)->
      keys = []
      splitKeys = key.match(/([a-zA-Z0-9]+)(\[[0-9a-zA-z]*\])/)
      keys.push splitKeys[1]
      keys = keys.concat(splitKeys[2].match(/\[([a-zA-Z0-9]*)\]/g))

    nestedKeysAsJs = (keys, value)->
      for key in keys by -1
        if key is '[]'
          out = [value]
        else
          out = {}
          out[key.replace(/\[|\]/g, '')] = value
        value = out
      value

    keyValueAsJs = (key, value)->
      out = {}
      out[key] = castValue(value)
      out

    parseParams = (search)->
      params = search.split('&')
      output = {}

      for param in params
        pair = param.replace('?', '').split('=')

        if hasNestedKeys(pair[0])
          keys = nestedKeysAsArray(pair[0])
          value = nestedKeysAsJs(keys, castValue(pair[1]))
        else
          value = keyValueAsJs(pair[0], pair[1])

        output = deepMerge(output, value)

      output

