# _plugins/razor_code_processing.rb
# Custom Jekyll plugin for preprocessing CSHTML/Razor code blocks

module Jekyll
  class RazorCodeProcessor
    # Constants for language identifiers
    RAZOR_LANGUAGES = ['cshtml', 'razor']
    
    # Process code blocks for Razor/CSHTML syntax
    def self.process_code_blocks(content)
      # Replace ```cshtml and ```razor code blocks with appropriate markup
      content.gsub(/```(#{RAZOR_LANGUAGES.join('|')})\s*\n(.*?)```/m) do |_match|
        language = $1
        code = $2
        
        # Create properly formatted code block with line numbers
        "<pre class=\"line-numbers\"><code class=\"language-#{language}\">#{code}</code></pre>"
      end
    end
    
    # Special handling for ASP.NET Tag Helpers
    def self.enhance_tag_helpers(content)
      # This is a simple enhancement - advanced implementations might use HTML parsing
      content.gsub(/(asp-[a-z\-]+)="([^"]*)"/) do |_match|
        helper_name = $1
        value = $2
        
        # Wrap tag helper attributes in a special format for highlighting
        "<span class=\"tag-helper-attribute\">#{helper_name}=\"#{value}\"</span>"
      end
    end
  end
end

# Register hook to process content during the pre-render phase
Jekyll::Hooks.register [:pages, :posts], :pre_render do |doc|
  if doc.content.include?('```cshtml') || doc.content.include?('```razor')
    # Process Razor code blocks
    doc.content = Jekyll::RazorCodeProcessor.process_code_blocks(doc.content)
  end
end