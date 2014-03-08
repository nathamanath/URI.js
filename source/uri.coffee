do(window)->
  "use strict"

  class URI
    constructor: (a)->
      @protocol = a.protocol || null
      @host = a.hostname || null
      @port = a.port || null
      @path = a.pathname.split('/') || null
      @params = a.search || null
      @hash = a.hash || null

      @

    @parse: (href=window.location.href)->
      a = document.createElement('a')
      a.href = href

      new @ a

    @stringify: (uri)->
      out = "#{uri.protocol}#{uri.host}"

      out += port if port = uri.port
      out += path.join('/') if path = uri.path
      out += params if params = uri.params
      out += hash if hash = uri.hash

      out

