module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    'imagemagick-resize' : {
      'tiles' : {
        from : 'dev/tiles/',
        to : 'project/assets/tiles/',
        files : '*.png',
        props : {
          filter : 'point',
          width : 256
        }
      }
    },
    'imagemagick-convert' : {
      'lava1' : {
        args : [ '-delay', '20', '-loop', '0',  './project/assets/tiles/lava1_*.png', './project/assets/tiles/lava1.gif' ]
      },
      'lava2' : {
        args : [ '-delay', '20', '-loop', '0',  './project/assets/tiles/lava2_*.png', './project/assets/tiles/lava2.gif' ]
      },
      'lava3' : {
        args : [ '-delay', '20', '-loop', '0',  './project/assets/tiles/lava3_*.png', './project/assets/tiles/lava3.gif' ]
      }
    },
    'clean' : {
      'pregif' : [ 'project/assets/tiles/lava*_*.png' ]
    }
  });

  grunt.loadNpmTasks('grunt-imagemagick');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('images', ['imagemagick-resize', 'imagemagick-convert', 'clean:pregif']);
  grunt.registerTask('default', []);

};