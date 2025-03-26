module Jekyll
    class LanguageSetter < Generator
      safe true
      priority :high
  
      def generate(site)
        # Set default language
        site.config['default_lang'] ||= 'en'
        
        # Determine active language from pages
        active_page = site.pages.find { |page| page.data['lang'] }
        
        if active_page
          site.config['active_lang'] = active_page.data['lang']
          puts "DEBUG: Active language set to #{site.config['active_lang']}"
        else
          site.config['active_lang'] = site.config['default_lang']
          puts "DEBUG: No language found, defaulting to #{site.config['active_lang']}"
        end
      end
    end
  end