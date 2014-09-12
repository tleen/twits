'use strict';

var t = require('..');

t({
  auth : require('../.twitter-auth.json'),
  maxSuggestions : 2,
  maxUsers : 5,
  suggestion : function(err, data){ console.log('suggestion found:', data.name); },
  user : function(err, data){ console.log('user found: %s, # of tweets: %s', data.name, data.tweets.length); }
})(function(err){
  if(err) console.error(err);
  else console.log('done');
});

