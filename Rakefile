require 'html-proofer'

desc 'Build the site'
task :build do
  sh 'bundle exec jekyll build'
end

desc 'Test the built site'
task :test => [:build] do
  options = {
    :allow_hash_href => true,
    :checks => ['links', 'images', 'scripts'],
    :disable_external => true,
    :assume_extension => true
  }
  HTMLProofer.check_directory('./_site', options).run
end

desc 'Serve the site locally'
task :serve do
  sh 'bundle exec jekyll serve'
end

# Default task
task :default => [:test]