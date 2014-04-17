require "bundler"
require 'rake'
require 'rake/clean'

include Rake::DSL

# All the bacon specifications
PROJECT_SPECS = Dir.glob(File.expand_path('../spec/**/*.rb', __FILE__))
PROJECT_SPECS.reject! { |e| e =~ /helper\.rb/ }
PROJECT_SPECS.reject! { |e| e =~ /init\.rb/ }

CLEAN.include %w[
  **/.*.sw?
  *.gem
  .config
  **/*~
  **/{vttroute-*.db,cache.yaml}
  *.yaml
  pkg
  rdoc
  public/doc
  *coverage*
]

Dir.glob(File.expand_path('../tasks/*.rake', __FILE__)).each do |f|
  import(f)
end

desc 'Starts the server'
task start: [ 'server:start' ]

desc 'Stops the server'
multitask stop: [ 'server:stop' ]

require 'jasmine'
load 'jasmine/tasks/jasmine.rake'
