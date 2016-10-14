module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    'imagemagick-resize' : {
      dev : {
        from : 'dev/tiles/',
        to : 'project/assets/tiles/',
        props : {
          filter : 'point',
          width : 256
        }
      }
    },
    'imagemagick-convert' : {
      dev : {
        args : ['-delay', '20', ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-imagemagick');

  // Default task(s).
  grunt.registerTask('default', ['imagemagick-resize']);

};