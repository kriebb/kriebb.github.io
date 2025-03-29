# lib/jekyll/front_matter_debug.rb
require 'jekyll'
require 'yaml'

module Jekyll
  class FrontMatterDebug < Generator
    safe true
    priority :high

    def generate(site)
      markdown_files = Dir.glob(File.join(site.source, 'content', 'pages', '*.*.md'))
      
      markdown_files.each do |file|
        debug_front_matter(file)
      end
    end

    private

    def debug_front_matter(file)
      #puts "\n=== Debugging: #{file} ===\n"
      
      # Read file with multiple methods
      begin
        # Method 1: Standard file read
        content = File.read(file)
        puts "File Read Method 1 - Total Length: #{content.length}"
       # puts "First 100 characters: #{content[0,100].inspect}"
        
        # Method 2: Read with encoding
        content_with_encoding = File.read(file, encoding: 'UTF-8')
        #puts "File Read Method 2 - Total Length: #{content_with_encoding.length}"
        
        # Method 3: Try to read raw bytes
        raw_bytes = File.open(file, 'rb') { |f| f.read }
        #puts "Raw Bytes Length: #{raw_bytes.length}"
        
        # Check for front matter delimiters
        #puts "Contains '---' at start: #{content.start_with?('---')}"
        
        # Detailed front matter regex
        front_matter_match = content.match(/\A(---\s*\n.*?\n?)^(---\s*$\n?)/m)
        
        if front_matter_match
          front_matter_text = front_matter_match[1]
           #puts "Front Matter Found:"
          # puts front_matter_text
          
          # Try parsing with different methods
          begin
            parsed_yaml = YAML.safe_load(front_matter_text)
            #puts "Successfully parsed YAML:"
            parsed_yaml.each do |key, value|
              #puts "  #{key}: #{value.inspect}"
            end
          rescue Psych::SyntaxError => e
            puts "YAML Parsing Error: #{e.message}"
          end
        else
          puts "NO FRONT MATTER FOUND!"
          
          # Additional diagnostics
          #puts "File contents start:"
          #puts content[0,500].inspect
        end
        
      rescue => e
        puts "Error reading file: #{e.message}"
        #puts e.backtrace.join("\n")
      end
      
      #puts "=" * 40
    end
  end
end