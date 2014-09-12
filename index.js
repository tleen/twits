var async = require('async'),
twit = require('twit'),
_ = require('lodash');

module.exports = function(config){
  'use strict';

  var dummyCallback = function(err, data){};

  var configuration = _.defaults(
    {},
    config,
    {
      auth : null,
      suggestion : dummyCallback,
      user : dummyCallback,
      maxSuggestions : 100,
      maxUsers : 200,
      verbose : false
    });

  function verbose(){
    if(configuration.verbose) console.log.apply(console, arguments);
  }


  // check for auth object
  if(!_.isObject(configuration.auth)) throw new Error('Missing Twitter authorization information object as configuration.auth');

  // ensure auth object has required info
  var diff = _.difference(['consumer_key','consumer_secret','access_token','access_token_secret'], _.keys(configuration.auth));
  if(diff.length) throw new Error('Twitter authorization missing ' + diff.join(', '));
  
  return function(callback){
    
    var T = new twit(configuration.auth);
    // xx - split queues for faster access of higher limit endpoints?
    var queue = async.queue(
      function(task, callback){
	verbose('queue executing task %s', task.name);
	T.get(
	  task.endpoint, 
	  task.data, 
	  function(err, data, response){
	    // timeout is used to throttle queue based on response headers
	    // dont execute callback if *next* request will exceed any limits
	    var timeout = 0; 
	    if(_.has(response,'headers') && // sometimes response headers are empty?
	       (response.headers['x-rate-limit-remaining'] === '0')){
	      timeout = ( (parseInt(response.headers['x-rate-limit-reset']) * 1000) - Date.now()) + (1000 * 60); //pad it slightly	      
	      if(timeout !== 0) console.warn('Exceeding Twitter rate limit, setting timeout for %dms, ~%dm', timeout, Math.ceil(timeout / 1000 / 60));
	    }
	    
	    setTimeout(function(){
	      return callback(err, data);
	    }, timeout);
	  });
      }, 
      10);
    
    queue.push(
      {name : 'suggestions list', endpoint : 'users/suggestions', data : {}},
      function(err, data){
	if(err) return callback(err);

	var userPick =  _.partialRight(_.pick, 'name', 'id', 'profile_image_url', 'screen_name');
	var tweetPick =  _.partialRight(_.pick, 'created_at', 'id', 'text');

	data.slice(0, configuration.maxSuggestions).forEach(function(s){
	  var name = s.name;
	  var slug = s.slug;
	  queue.push(
	    {name : 'lookup users for suggestion: ' + name, endpoint : 'users/suggestions/:slug', data :  {slug : slug}},
	    function(err, data){
	      if(err) return console.error(err);
	      var users = _.map(data.users, userPick);
	      verbose('found %d users for %s', users.length, name);

	      // queue users
	      users.slice(0, configuration.maxUsers).forEach(function(u){
		var name = u.name;
		var id = u.id;

		queue.push(
		  {name : 'tweets for user ' + name, endpoint : '/statuses/user_timeline', data : {user_id : id, count : 200}},
		  function(err, data){
		    if(err){
		      console.error(err);
		      return;
		    }
		    var tweets = _.map(data, tweetPick);
		    configuration.user(null, {name : name, id : id, tweets : tweets}); 
		  }
		);
	      });
	      configuration.suggestion(null, {name : name, slug : slug, users : users}); 
	    }
	  );
	});		     
      }
    );

    queue.drain = function(){ return callback(null); }; // this may get async wierd?
  };
};
