
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);

};
