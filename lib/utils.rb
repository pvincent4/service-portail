# -*- coding: utf-8 -*-

def normalize( params )
  params.each do |key, _value|
    if params[ key ].is_a? Date
      params[ key ] = params[ key ].iso8601
    else
      params[ key ] = params[ key ].to_s
    end
  end
end
