module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    'imagemagick-resize' : {
      'tiles' : {
        from : 'dev/tiles/',
        to : 'project/assets/img/tiles/',
        files : '*.png',
        props : {
          filter : 'point',
          width : 64
        }
      },
      'sprites' : {
        from : 'dev/sprites/',
        to : 'project/assets/img/sprites/',
        files : '*.png',
        props : {
          filter : 'point',
          width : 64
        }
      }
    },
    'imagemagick-convert' : {
      'lava1' : {
        args : [ '-delay', '20', '-loop', '0',  './project/assets/img/tiles/lava1_*.png', './project/assets/img/tiles/lava1.gif' ]
      },
      'lava2' : {
        args : [ '-delay', '20', '-loop', '0',  './project/assets/img/tiles/lava2_*.png', './project/assets/img/tiles/lava2.gif' ]
      },
      'lava3' : {
        args : [ '-delay', '20', '-loop', '0',  './project/assets/img/tiles/lava3_*.png', './project/assets/img/tiles/lava3.gif' ]
      }
    },
    'clean' : {
      'lava-pregif' : [ 'project/assets/img/tiles/lava*_*.png' ]
    }
  });

  grunt.loadNpmTasks('grunt-imagemagick');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('images', ['imagemagick-resize', 'imagemagick-convert', 'clean:lava-pregif']);
  grunt.registerTask('default', []);

};