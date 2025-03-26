module Jekyll
    class LanguageManager < Generator
      safe true
      priority :high
  
      def generate(site)
        # Explicitly set default and active language
        site.config['default_lang'] = 'en'
        
        # Determine active language based on the current page being processed
        active_page = site.pages.find { |page| page.data['lang'] }
        
        if active_page
          site.config['active_lang'] = active_page.data['lang']
          puts "DEBUG: Active Language set to #{site.config['active_lang']} from page #{active_page.path}"
        else
          site.config['active_lang'] = site.config['default_lang']
          puts "DEBUG: No language found, defaulting to #{site.config['active_lang']}"
        end
      end
    end
  
    module TranslationFilter
      def translate(input, lang = nil)
        site = @context.registers[:site]
        lang ||= site.config['active_lang'] || 'en'
        
        # More robust translation lookup
        translations = site.data['i18n'][lang]
        keys = input.split('.')
        
        keys.each do |key|
          translations = translations[key] if translations
        end
        
        result = translations || input
        
        # Debug output
        puts "DEBUG: Translating '#{input}' for language '#{lang}'. Result: '#{result}'"
        
        result
      end
    end
  end
  
  Liquid::Template.register_filter(Jekyll::TranslationFilter)