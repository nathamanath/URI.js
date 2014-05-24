require 'coffee-script'
require 'coffeelint'
require 'listen'
require 'uglifier'

SOURCE_DIR = './source'
BUILD_DIR = './build'
TEST_DIR = './test/unit'

def source_files
  @source_files ||= Dir["#{SOURCE_DIR}/*.coffee"]
end

def file_names
  @file_names ||= source_files.map do |file|
    "#{File.basename(file, '.coffee')}"
  end
end

def js_files
  @js_files ||= file_names.map do |file|
    if file.match(/_spec/)
      "#{TEST_DIR}/#{file}.js"
    else
      "#{BUILD_DIR}/#{file}.js"
    end
  end
end

# Set default task
task default: :js

# Task js depends on all of js_files being up to date
task js: js_files

task :watch do
  puts "|  Watching #{SOURCE_DIR} for changes."
  puts '|  Hit `ctrl + c` to stop'
  sh 'rake js'

  listener = Listen.to SOURCE_DIR do
    puts '|  Something changed...'
    sh 'rake js'
  end

  listener.start
  sleep
end

task :clean do
  sh "rm #{BUILD_DIR}/*.js"
end

task :test do
  sh 'mocha-phantomjs -R dot test/index.html'
end

# Generate file rules for each js file we want to compile
# This teaches rake how to create a js file from a coffee file
source_files.each do |coffee_file|
  if coffee_file.match(/_spec\.coffee/)
    js_file = "#{TEST_DIR}/#{File.basename(coffee_file, '.coffee')}.js"
  else
    js_file = "#{BUILD_DIR}/#{File.basename(coffee_file, '.coffee')}.js"
  end

  # js_file can be created by running block on coffee_file
  file js_file => coffee_file do
    coffee = File.read coffee_file
    compiled = CoffeeScript.compile coffee

    puts "|  Linting #{coffee_file}"
    Coffeelint.run_test coffee_file

    puts "|  Compiling #{coffee_file} into #{js_file}"

    File.open(js_file, 'w') do |file|
      file.puts compiled
      puts "|  Done."
    end
  end
end

