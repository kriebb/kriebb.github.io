module Jekyll
    class LanguageSelector < Generator
      safe true
      priority :high
  
      def generate(site)
        # Group pages by their reference
        site.data['translated_pages'] = {}
        site.pages.each do |page|
          ref = page.data['ref']
          next unless ref
  
          site.data['translated_pages'][ref] ||= {}
          site.data['translated_pages'][ref][page.data['lang']] = page
        end
      end
    end
  end