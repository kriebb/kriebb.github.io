module Jekyll
  # Generate pages for each alias URL specified in the front matter
  class AliasGenerator < Generator
    safe true
    
    def generate(site)
      site.pages.each do |page|
        if page.data['alias']
          # Handle single alias or array of aliases
          aliases = Array(page.data['alias'])
          aliases.each do |alias_path|
            site.pages << AliasPage.new(site, alias_path, page.url)
          end
        end
      end
    end
  end
  
  # Page class that redirects to another page
  class AliasPage < Page
    def initialize(site, alias_path, target_path)
      @site = site
      @base = site.source
      @dir = File.dirname(alias_path)
      @name = File.basename(alias_path)
      
      self.process(@name)
      self.read_yaml(File.join(@base, '_layouts'), 'redirect.html')
      self.data['redirect_to'] = target_path
      
      # Add language reference if it exists in the target URL
      if target_path.include?('/en/') || target_path.include?('/nl/')
        self.data['lang'] = target_path.include?('/nl/') ? 'nl' : 'en'
      end
    end
  end
end