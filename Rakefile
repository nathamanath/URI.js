require 'listen'
require 'uglifier'
require 'jshintrb/jshinttask'
require 'jasmine'

load 'jasmine/tasks/jasmine.rake'

SOURCE_FILE = File.expand_path('../uri.js', __FILE__)
TEST_DIR = File.expand_path('../spec', __FILE__)

# Set default task
task default: :js

# Task js depends on all of js_files being up to date
task js: [:lint, :'jasmine:ci', :minify]

desc 'Watch source for changes'
task :watch do
  puts "|  Watching for changes."
  puts '|  Hit `ctrl + c` to stop'

  js_listener = Listen.to SOURCE_FILE do
    sh 'rake js'
  end

  test_listener = Listen.to TEST_DIR do
    sh 'rake test'
  end

  test_listener.start
  js_listener.start
  sleep
end

desc 'Test js'
task :test do
  sh 'mocha-phantomjs -R dot test/index.html'
end

desc 'Lint js'
task lint: :jshint

desc 'Minify js'
task :minify do
  puts 'Minifying...'

  js = File.read(SOURCE_FILE)
  ugly = Uglifier.compile(js)

  File.open("#{File.basename(SOURCE_FILE, '.js')}.min.js", 'w') do |file|
    file.puts ugly
  end

  puts 'Done.'
end

Jshintrb::JshintTask.new :jshint do |t|
  t.pattern = SOURCE_FILE
  t.options ={
    bitwise: true,
    browser: true,
    camelcase: true,
    curly: true,
    eqeqeq: true,
    forin: true,
    indent: 2,
    immed: true,
    latedef: true,
    noarg: true,
    noempty: true,
    nonew: true,
    quotmark: true,
    regexp: true,
    undef: true,
    strict: true,
    trailing: true,
    undef: true,
    unused: true,
    maxparams: 4,
    maxdepth: 3,
    maxstatements: 10,
    maxlen: 80
  }
end

