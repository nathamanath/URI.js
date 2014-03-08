module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json'),
    coffee:
      compile:
        files:
          'build/uri.js': 'source/uri.coffee',
      test:
        files:
          'test/unit/uri_spec.js': 'source/uri_spec.coffee'
    coffeelint:
      app: ['source/uri.coffee']
      tests:
        files:
          src:
            ['source/uri_spec.coffee']
      options:
        'no_trailing_whitespace':
          level: 'error'
    docco:
      options:
        layout: 'parallel'
        output: 'docs/'
        single:
          files:
            src: ['source/uri_spec.coffee']
    watch:
      scripts:
        files: ['source/uri.coffee'],
        tasks: ['default']
      tests:
        files: ['source/uri_spec.coffee']
        tasks: ['test']
    exec:
      test:
        command: 'mocha-phantomjs -R dot test/index.html'
    uglify:
      dist:
        files:
          'build/uri.min.js': 'build/uri.js'

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-docco-multi')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-exec')
  grunt.loadNpmTasks('grunt-contrib-uglify')

  grunt.registerTask('test', ['coffeelint:tests', 'coffee:test', 'exec:test'])
  grunt.registerTask('default', ['coffeelint:app', 'coffee:compile'])
  grunt.registerTask('dist', ['test', 'default', 'uglify', 'docco'])
