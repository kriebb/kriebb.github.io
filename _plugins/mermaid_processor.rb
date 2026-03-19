module Jekyll
    class MermaidBlock < Liquid::Block
      def initialize(tag_name, markup, tokens)
        super
      end
  
      def render(context)
        content = super
        "<div class=\"mermaid\">\n#{content}\n</div>"
      end
    end
  end
  
  Liquid::Template.register_tag('mermaid', Jekyll::MermaidBlock)
  
  Jekyll::Hooks.register [:posts, :pages], :pre_render do |doc|
    doc.content = doc.content.gsub(/```mermaid\s*(.*?)\s*```/m) do |_|
      mermaid_content = $1.strip
      "{% mermaid %}\n#{mermaid_content}\n{% endmermaid %}"
    end
  end