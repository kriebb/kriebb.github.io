module Jekyll
    class MultilingualRoutes < Generator
      safe true
      priority :high
  
      def generate(site)
        # Add alternate language links to pages
        site.pages.each do |page|
          # Only process pages with a ref and lang
          next unless page.data['ref'] && page.data['lang']
          
          # Find alternate language pages with the same ref
          alternates = site.pages.select do |alternate_page| 
            alternate_page.data['ref'] == page.data['ref'] && 
            alternate_page.data['lang'] != page.data['lang']
          end
          
          # Add alternate links to page data
          page.data['alternate_urls'] = alternates.map do |alternate|
            {
              'lang' => alternate.data['lang'],
              'url' => alternate.url
            }
          end
        end
      end
    end
  end