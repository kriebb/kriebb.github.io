module Jekyll
    module TranslationHelper
      def translate(key, lang = nil)
        # Determine the language
        site = @context.registers[:site]
        lang ||= site.config['active_lang'] || 'en'
        
        # Debugging
        puts "Translating key: #{key} for language: #{lang}"
        
        # Safely navigate through translation keys
        translations = site.data['i18n']&.[](lang)
        
        # Split the key and navigate through nested translations
        keys = key.split('.')
        result = translations
        keys.each do |k|
          result = result&.[](k)
          break if result.nil?
        end
        
        # Return the translation or the original key if not found
        if result.nil?
          puts "WARNING: Translation not found for key '#{key}' in language '#{lang}'"
          key
        else
          result
        end
      end
    end
  end
  
  Liquid::Template.register_filter(Jekyll::TranslationHelper)