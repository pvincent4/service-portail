# -*- coding: utf-8 -*-

def normalize( params )
  params.each do |key, _value|
    if params[ key ].is_a? String
      params[ key ] = URI.escape( params[ key ] )
    elsif params[ key ].is_a? Date
      params[ key ] = URI.escape( params[ key ].iso8601 )
    else
      params[ key ] = URI.escape( params[ key ].to_s )
    end
  end
end
