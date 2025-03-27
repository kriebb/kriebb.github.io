source "https://rubygems.org"

# Remove the github-pages gem
# gem "github-pages", group: :jekyll_plugins

# Add Jekyll directly
gem "jekyll", "~> 4.3.2"
gem 'csv'
gem 'logger'
gem 'base64'
gem 'minima'
# For Windows development
gem 'wdm', '>= 0.1.0' if Gem.win_platform?
source 'https://rubygems.org'

gem 'guard'
gem 'guard-shell'
# Common plugins
group :jekyll_plugins do
  gem 'jekyll-sass-converter', "~> 2.2.0"  # Updated version
  gem 'jekyll-seo-tag'
  gem 'jekyll-sitemap'
  gem 'jekyll-feed'
  gem 'jekyll-polyglot', '~> 1.9.0'        # Latest version
end

# For testing and local development
group :development, :test do
  gem 'html-proofer'
end