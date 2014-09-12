
module.exports = function(grunt){
  'use strict';
  grunt.initConfig({
    jshint: {
      node: {
	files : {
	  src : ['Gruntfile.js', 'index.js', 'bin/twits', 'test/*.js', 'examples/*.js']
	},
	options : {
	  node : true
	}
      }
    },
    test : {
      options : {
	bail: true,
	require : ['should'],
	ui : 'bdd',
      },
      all : {
	src : 'test/index.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-cafe-mocha');
  grunt.renameTask('cafemocha', 'test');

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'test']);

};
