# _plugins/cover_banner.rb
Jekyll.logger.info "cover_banner", "Plugin loaded."

Jekyll::Hooks.register [:posts, :pages], :pre_render do |doc|
  # Properly check if we're dealing with a post
  if doc.data['cover']
    # Skip for posts (they'll use the hero layout)
    next if doc.is_a?(Jekyll::Document) && doc.collection.label == "posts"
    
    Jekyll.logger.info "cover_banner", "Adding banner to: #{doc.relative_path}"
    banner = "{% include cover_banner.html cover='#{doc.data['cover']}' title='#{doc.data['title']}' %}\n\n"
    # Only insert if not already present (avoid duplication on regenerate)
    unless doc.content.start_with?(banner)
      doc.content = banner + doc.content
    end
  end
end