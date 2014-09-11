'use strict';

var T = require('..');

describe('missing authorization information', function(){
  it('should throw an error', function(){
    T.should.throw(/^Missing Twitter/);
  });
});


