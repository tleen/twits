
module.exports = function(grunt){
  'use strict';
  grunt.initConfig({
    jshint: {
      node: {
	files : {
	  src : ['Gruntfile.js', 'index.js', 'bin/twits']
	},
	options : {
	  node : true
	}
      }
    },
    test : {
      options : {
	ui : 'bdd',
	require : ['should']
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
