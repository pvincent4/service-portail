
namespace :server do
  env = ENV['RACK_ENV'] || 'none'

  desc 'Starts thin server'
  task :start do
    system("rackup config.ru -E #{env}")
  end

  desc 'Stops thin servers'
  task :stop do
    puts('Not implemented')
  end
end
