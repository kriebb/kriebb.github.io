# _plugins/youtube.rb

# Log when the plugin is loaded
Jekyll.logger.info "YouTubePlugin", "Loaded youtube.rb plugin."

Jekyll::Hooks.register [:pages, :documents], :pre_render do |doc|
  # Only process markdown files
  if doc.extname == ".md" || doc.extname == ".markdown"
    Jekyll.logger.info "YouTubePlugin", "Processing #{doc.relative_path}"
    doc.content.gsub!(/%\[\s*(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11}))\s*\]/) do
      video_id = Regexp.last_match(2)
      "{% include youtube.html id='#{video_id}' %}"
    end
  end
end
