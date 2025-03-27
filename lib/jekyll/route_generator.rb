# Load custom Guard plugin
require_relative '_guard/routes_generator_plugin'

# Configure the custom Routes Generator plugin
guard :routes_generator do
  watch(%r{content/pages/.*\.(?:en|nl)\.md$})
end