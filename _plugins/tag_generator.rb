# _plugins/tag_generator.rb
module Jekyll
  class TagPageGenerator < Generator
    safe true
    
    def generate(site)
      # Get all unique tags from all posts
      tags = []
      site.posts.docs.each do |post|
        if post.data['tags'].is_a?(Array)
          tags.concat(post.data['tags'])
        end
      end
      tags = tags.uniq
      
      # Generate a page for each tag
      tags.each do |tag|
        # Make sure tag is a string before slugifying
        tag_slug = Jekyll::Utils.slugify(tag.to_s)
        site.pages << TagPage.new(site, site.source, tag, tag_slug)
      end
    end
  end
  
  class TagPage < Page
    def initialize(site, base, tag, tag_slug)
      @site = site
      @base = base
      @dir = File.join('tag', tag_slug)
      @name = 'index.html'
      
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag.html')
      self.data['tag'] = tag
      self.data['title'] = "Posts tagged with #{tag}"
    end
  end
end