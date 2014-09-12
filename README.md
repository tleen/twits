twits
=====

[![Build Status](https://travis-ci.org/tleen/twits.png?branch=master)](https://travis-ci.org/tleen/twits)

Utility for downloading top recommended twitter users and some of their tweets. The [module](#user-content-module) will fetch a lists of top twitter suggestion categories, and download user information & latest tweets for the users in those suggestions. The [command line interface](#user-content-cli) to the module will download the suggestion list and user information to .json files.

## Module

```javascript

var t = require('twits');

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

#### auth
Object containing your authentication tokens for twitter. The object should have the properties:
* 'consumer_key'
* 'consumer_secret'
* 'access_token'
* 'access_token_secret'


#### suggestion
A callback of the form *function(err, data)* to handle the receipt of a twitter suggestion category. If error is set, there was an error retrieving the suggestion, else data will be an object with the properties:

* **name** The suggestion name
* **slug** Slug used in access suggestion information in the Twitter API
* **users** Array of users given by this suggestion, each user is an object of four properties: *name*, *id*, *profile_image_url* and *screen_name*

#### user

A callback of the form *function(err, data)* to handle receipt of a twitter user. If error is set, there was an error retrieving the user, else data will be an object with the properties:

* **name** The user's name
* **id** The user's Twitter ID
* **tweets** An array of the most recent (up to 200) tweets for this user, each tweet is an object of three properties: *created_at*, *id*, *text*

#### maxSuggestions
Set this integer value to limit the number of suggestion categories processed.

#### maxUsers
Set this integer value to limit the number of users processed on a _per suggestion basis_.

#### verbose
Set this boolean to *true* to get status updates in the console.

## CLI

```shell
./bin/twits --max-suggestions=5 --max-users=10 --destination=/tmp/twitter-data

ls /tmp/twitter-data/

100220864.json  15439395.json    17471979.json ... suggestions.json
```

### Options

The CLI is located under the /bin directory: */bin/twits*. It may be called with the following options (also available via --help).

#### auth (-a)
Location of a .json file conforming to the module's required authorization object. Defaults to *./.twitter-auth.json*.

#### destination (-f)
Directory to use for outputting .json files for users and suggestions. Output files will be named *[id].json* for users and the suggestion list will be named *suggestions.json*. Defaults to *'./dist'*.

#### version (-v)
Show (in console) the version of the module and exit.

#### Others
* **max-suggestions** (-s)
* **max-users* (-u)
* **verbose** (-v)

Same as defined for the module.

## Rate Limiting

Twitter limits access to the API. This module respects those limits, therefore you can expect long delays (15 minutes+) in data retrieval if you are getting data and hit the rate limit. Limit messages are sent to console.error (from the above example):

```text
Exceeding Twitter rate limit, setting timeout for 84173ms, ~2m
suggestion found: Music
...
user found: Twitter Sports, # of tweets: 200
done
```

A full dump of all suggestions and related users **could take a half-hour or more** depending on last execution.
