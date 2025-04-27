# _plugins/tag_generator.rb
module Jekyll
  class TagPageGenerator < Generator
    safe true
    
    def generate(site)
      tags = site.posts.docs.flat_map { |post| post.data['tags'] || [] }.uniq
      
      tags.each do |tag|
        site.pages << TagPage.new(site, site.source, tag)
      end
    end
  end
  
  class TagPage < Page
    def initialize(site, base, tag)
      @site = site
      @base = base
      @dir = "tag/#{Jekyll::Utils.slugify(tag)}/"
      @name = 'index.html'
      
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag.html')
      self.data['layout'] = 'default' # Ensure this inherits from default
      self.data['tag'] = tag
      self.data['title'] = "Posts tagged with #{tag}"
    end
  end
end