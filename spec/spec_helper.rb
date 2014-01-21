require 'simplecov'

require 'debugger'
require 'rspec'
require 'rack/test'

# Requires supporting ruby files with custom matchers and macros, etc,
# from spec/support/ and its subdirectories.
Dir[File.expand_path('spec/support/**/*.rb')].each { |f| require f }
