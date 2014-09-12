'use strict';
/* jshint expr: true */
/* global describe, it, should */

var fs = require('fs-extra'),
T = require('..'),
_ = require('lodash');

// if tests are run too fast T will hit the twitter rate limit
// timeout should be more than 15 minutes because that is the max
// wait window for suggestions
var apiTimeout = (1000 * 60 * 16);
var verbose = false;

describe('missing authorization information', function(){
  it('should throw an error', function(){
    T.should.throw(/^Missing Twitter/);
  });
});

describe('partial authorization information', function(){
  it('should throw an error', function(){
    T.bind(null,{
      auth : {
	consumer_key : '',
	consumer_secret : '',
	access_token : ''
      }
    }).should.throw(/access_token_secret$/);
  });
});


var authorization = {};

describe('authorization object', function(){
  if(process.env.TRAVIS){
    verbose = true;
    it('should have authorization variables in the process.env', function(done){
            
      
     ['TWITTER_CONSUMER_KEY',
      'TWITTER_CONSUMER_SECRET',
      'TWITTER_ACCESS_TOKEN',
      'TWITTER_ACCESS_TOKEN_SECRET'].forEach(function(key){
	(process.env[key] !== undefined).should.be.true;
	process.env[key].should.be.ok.and.be.a.String;
      });
      
      authorization = {
	consumer_key : process.env.TWITTER_CONSUMER_KEY, 
	consumer_secret : process.env.TWITTER_CONSUMER_SECRET,
	access_token : process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret : process.env.TWITTER_ACCESS_TOKEN_SECRET
      };
      return done();
    });
  }else{
    var filename = __dirname + '/../.twitter-auth.json';
    it('should have local authorization file: ' + filename, function(done){
      fs.exists(filename, function(exists){
	if(exists){
	  authorization = require(filename);
//	  console.log(authorization);
	  return done();
	}else return done(new Error('local authorization file does not exist'));
      });
    });
  }

  it('should have exactly 4 non-empty arguments', function(){
    _.chain(authorization).values().reject(_.isEmpty).size().valueOf().should.equal(4);
  });
});


describe('get suggestions', function(){
  this.timeout(apiTimeout);
  it('should get 3 suggestions', function(done){
    var suggestionCount = 0;
    new T({
      auth : authorization,
      maxSuggestions : 3,
      maxUsers : 0,
      suggestion : function(err, data){
	suggestionCount++;
      },
      verbose : verbose
    })(function(err){
      suggestionCount.should.equal(3);
      return done(err);
    });
  });
});

describe('get users', function(){
  this.timeout(apiTimeout);
  it('should get 25 users each for 3 suggestions', function(done){
    var userCount = 0;
    new T({
      auth : authorization,
      maxSuggestions : 3,
      maxUsers : 25,
      user : function(err, data){
	userCount++;
      },
      verbose : verbose
    })(function(err){
      userCount.should.equal(75);
      return done(err);
    });
  });
});
