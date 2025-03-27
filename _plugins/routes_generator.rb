# lib/jekyll/routes_generator.rb
require 'jekyll'
require 'yaml'

module Jekyll
  class RoutesGenerator < Generator
    safe true
    priority :low

    def generate(site)
      # Find all markdown files with language suffixes
      markdown_files = Dir.glob(File.join(site.source, 'content', 'pages', '*.*.md'))
      
      routes = { 'routes' => {} }
      validation_errors = []
      
      markdown_files.each do |file|
        # Extract filename components
        filename = File.basename(file)
        parts = filename.split('.')
        
        # Ensure file has correct format (name.lang.md)
        next unless parts.length == 3
        
        base_name = parts[0]
        lang = parts[1]
        
        # Read file content
        begin
          content = File.read(file, encoding: 'UTF-8')
        rescue => e
          validation_errors << "Unable to read file #{filename}: #{e.message}"
          next
        end
        
        # Extract front matter
        front_matter_match = content.match(/\A(---\s*\n.*?\n?)^(---\s*$\n?)/m)
        
        if front_matter_match
          begin
            # Parse front matter
            front_matter = YAML.safe_load(front_matter_match[1])
            
            # Validate essential fields
            errors = []
            
            # Check critical fields
            critical_fields = ['ref', 'lang', 'permalink']
            critical_fields.each do |field|
              unless front_matter&.key?(field)
                errors << "Missing required '#{field}' field"
              end
            end
            
            # Validate language match
            if front_matter['lang'] && front_matter['lang'] != lang
              errors << "Language mismatch: filename (#{lang}) vs front matter (#{front_matter['lang']})"
            end
            
            # Sanitize and validate permalink
            permalink = front_matter['permalink']
            if permalink
              # Check permalink formatting
              unless permalink.start_with?('/')
                errors << "Permalink must start with '/'"
              end
            else
              errors << "Permalink cannot be empty"
            end
            
            # Collect errors
            if errors.any?
              validation_errors << {
                file: filename,
                errors: errors
              }
              next
            end
            
            # Determine route key (use base_name instead of ref)
            route_key = base_name.gsub('_', '-')
            
            # Determine final URL
            if lang == 'en'
              final_url = permalink
            else
              # Special handling for specific pages that might need unique routing
              final_url = case route_key
              when 'print-resume'
                "/#{lang}/#{route_key}"
              else
                "/#{lang}#{permalink}"
              end
            end
            
            # Add to routes
            routes['routes'][route_key] ||= {}
            routes['routes'][route_key][lang] = final_url
            
          rescue Psych::SyntaxError => e
            validation_errors << {
              file: filename,
              errors: ["YAML parsing error: #{e.message}"]
            }
            next
          end
        else
          validation_errors << {
            file: filename,
            errors: ["No front matter found"]
          }
          next
        end
      end

      # Print validation errors
      if validation_errors.any?
        puts "\n===== ROUTES GENERATION ERRORS ====="
        validation_errors.each do |error|
          puts "\nFile: #{error[:file]}"
          error[:errors].each do |err_msg|
            puts "  - #{err_msg}"
          end
        end
        puts "\nFix the above errors to generate routes successfully."
        puts "=======================================\n"
        exit 1  # Exit with error code to stop the build process
      end

      # Write routes to data file
      routes_file = File.join(site.source, '_data', 'routes.yml')
      FileUtils.mkdir_p(File.dirname(routes_file))
      
      # Write without YAML frontmatter
      File.open(routes_file, 'w') do |file|
        file.write(routes.to_yaml.sub(/^---\n/, ''))
      end
    end
  end
end