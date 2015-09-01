module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Options for all targets
    ngconstant:{ 
        options: {
            space: '  ',
            wrap: '"use strict";\n\n {%= __ngModule %}',
            name: 'config',
            dest: 'public/scripts/config.js',
            constants: {
                  STREAMACTION:{
                    list:"list",
                    listUnpublished:"listUnpublished",
                    upload:"upload",
                    request:"request",
                    requestUnpublished:"requestUnpublished"
                  }
            }
        },
        // Environment targets
        development: {
          constants: {
              ENV: {
                name: 'development',
                backendEndpoint: 'localhost',
                backendPort: '3000',
                apiEndpoint: 'http://your-development.api.endpoint:3000'
              }
          }
        },
        production: {
          constants: {
            ENV: {
              name: 'production',
              backendEndpoint: 'www.lifebehindthewindow.com',         
              backendPort: '80',
              apiEndpoint: 'http://api.livesite.com'
            }
          }
        }
    }
  });

  grunt.registerTask('default', 'Log some stuff.', function() {
    grunt.log.write('Logging some stuff...').ok();
  });

    grunt.registerTask('serve', function (target) {
//      if (target === 'dist') {
//        return grunt.task.run(['build', 'connect:dist:keepalive']);
//      }

        grunt.task.run([
//            'clean:server',
            'ngconstant:development'
//            'bower-install',
//            'concurrent:server',
//            'autoprefixer',
//            'connect:livereload',
//            'watch'
        ]);
    });
    
    grunt.registerTask('build', [
//      'clean:dist',
//      'bower-install',
        'ngconstant:production' // ADD THIS
    ]);
    
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower-install');

  // Default task(s).
//  grunt.registerTask('default', ['uglify']);

};