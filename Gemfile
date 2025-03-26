source "https://rubygems.org"

# For GitHub Pages compatibility
gem "github-pages", group: :jekyll_plugins

# For Windows development
gem 'wdm', '>= 0.1.0' if Gem.win_platform?

# Common plugins
group :jekyll_plugins do
  gem 'jekyll-sass-converter', "~> 1.5.2"  # GitHub Pages compatible version
  gem 'jekyll-seo-tag'                     # Improves SEO
  gem 'jekyll-sitemap'                     # Generates sitemap.xml
  gem 'jekyll-feed'                        # Generates RSS feed
  gem 'jekyll-multiple-languages-plugin'
  gem 'jekyll-polyglot'
end

# For testing and local development
group :development, :test do
  gem 'html-proofer'                       # Test your rendered HTML files
end
