require 'jekyll/document'
require 'jekyll/page'

module Jekyll
  class MultilingualSitemap < Jekyll::Generator
    safe true
    priority :low
    
    def generate(site)
      # Only process the site if we're using the default language
      return unless site.config['lang'] == site.config['default_lang']
      
      # Create a new page for sitemap.xml
      site.pages << SitemapPage.new(site, site.source, site.config['languages'])
    end
  end
  
  class SitemapPage < Jekyll::Page
    def initialize(site, base, languages)
      @site = site
      @base = base
      @dir = "/"
      @name = "sitemap.xml"
      
      self.process(@name)
      self.content = ""
      self.data = {
        'layout' => nil,
        'languages' => languages,
        'sitemap_content' => true
      }
    end
    
    def render(layouts, site_payload)
      site_payload["page"] = data
      site_payload["page"]["content"] = content
      
      # Collect all pages and posts
      pages = @site.pages
      posts = @site.posts
      
      sitemap_content = %Q{<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
}
      
      # Add all pages
      all_pages = []
      pages.each do |page|
        next if page.data['sitemap'] == false
        next if page.data['sitemap_content'] || page.url.end_with?('.xml')
        
        all_pages << page
      end
      
      # Group pages by reference
      page_by_ref = {}
      all_pages.each do |page|
        if page.data['ref'] && page.data['lang']
          page_by_ref[page.data['ref']] ||= []
          page_by_ref[page.data['ref']] << page
        else
          page_by_ref["_#{page.url}"] = [page]
        end
      end
      
      # Generate sitemap entries
      page_by_ref.each do |_, pages_group|
        primary = pages_group.first
        sitemap_content += %Q{  <url>
    <loc>#{@site.config['url']}#{primary.url}</loc>
}
        
        # Add alternate language versions
        pages_group.each do |alternate|
          next if alternate == primary
          sitemap_content += %Q{    <xhtml:link rel="alternate" hreflang="#{alternate.data['lang']}" href="#{@site.config['url']}#{alternate.url}" />
}
        end
        
        sitemap_content += %Q{    <lastmod>#{(primary.data['updated'] || site.time).strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
  </url>
}
      end
      
      # Add blog posts
      posts.docs.each do |post|
        next if post.data['sitemap'] == false
        sitemap_content += %Q{  <url>
    <loc>#{@site.config['url']}#{post.url}</loc>
    <lastmod>#{(post.data['updated'] || post.date).strftime('%Y-%m-%d')}</lastmod>
    <changefreq>monthly</changefreq>
  </url>
}
      end
      
      sitemap_content += %Q{</urlset>}
      
      output = Jekyll::Renderer.new(@site, self, site_payload).run
      output = sitemap_content
    end
  end
end