twits
=====

[![Build Status](https://travis-ci.org/tleen/twits.png?branch=master)](https://travis-ci.org/tleen/twits)

Utility for downloading top recommended twitter users and some of their tweets. The module will fetch a lists of top twitter suggestion categories, and download user information & latest tweets for the users in those suggestions. The **command line interface** to the module will download the suggestion list and user information to .json files.

## Module

```javascript

var t = require('..');

t({
  auth : require('../.twitter-auth.json'),
  maxSuggestions : 2,
  maxUsers : 5,
  suggestion : function(err, data){ console.log('suggestion found:', data.name); },
  user : function(err, data){ console.log('user found: %s, # of tweets', data.name, data.tweets.length); }
})(function(err){
  if(err) console.error(err);
  else console.log('done');
});

```

Results in:

```text

suggestion found: Music
suggestion found: Sports
user found: Lady Gaga, # of tweets 200
user found: KATY PERRY , # of tweets 200
user found: Rihanna, # of tweets 200
user found: Justin Timberlake , # of tweets 200
user found: Shakira, # of tweets 199
user found: NBA, # of tweets 200
user found: Kevin Durant, # of tweets 200
user found: Carmelo Anthony, # of tweets 200
user found: Cristiano Ronaldo, # of tweets 200
user found: Twitter Sports, # of tweets 200
done


```

### Options

*List module options here*

## Cli

```shell
./bin/twits --max-suggestions=5 --max-users=10 --destination=/tmp/twitter-data
ls /tmp/twitter-data/
100220864.json  15439395.json    17471979.json ... suggestions.json
```

### Options

*List cli options here*


## Rate Limiting

Twitter limits access to the API. This module respects those limits, therefore you can expect long delays (15 minutes+) in data retrieval if you are getting data and hit the rate limit. Limit messages are sent to console.error (from the above example):

```text
Exceeding Twitter rate limit, setting timeout for 84173ms, ~2m
suggestion found: Music
...
user found: Twitter Sports, # of tweets: 200
done
```


