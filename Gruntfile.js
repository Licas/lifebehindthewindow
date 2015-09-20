module.exports = function(grunt) {

    var cssPath = 'public/styles';
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
    },
    cssmin: {
      add_banner: {
        options: {
          banner: '/* My minified css file */'
        },
        files: {
          'public/styles/styles.min.css': [cssPath+'/*.css','!'+cssPath+'/*.min.css']
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'public/index.html': 'public/index.html',
          'public/views/login/login.html': 'public/views/login/login.html',
          'public/views/main/contact.html': 'public/views/main/contact.html',
          'public/views/main/cookie-policy.html': 'public/views/main/cookie-policy.html',
          'public/views/main/main.html': 'public/views/main/main.html',
          'public/views/main/project.html': 'public/views/main/project.html',
          'public/views/stream/stream.html': 'public/views/stream/stream.html'
        }
      }
    },
    jshint: {
        all: ['*.js']
    },
    clean: {
        js: ['public/js/lib/*.min.js', 'public/js/lib/*.min.js.map',
             'public/js/*.min.js', 'public/js/*.min.js.map',
             'public/scripts/**/*.min.js', 'public/scripts/**/*.min.js.map',
             'public/views/**/*.min.js', 'public/views/**/*.min.js.map']
    },
    //uglify
    uglify: {
        options: {
            sourceMap: true,
            banner: '// <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n' + '// http://www.lifebehindthewindow.com\n'       
        },
        js: {
            files: [
                {
                expand: true,
                cwd: 'public/views/',
                src: ['**/*.js', '**/!*.min.js'],
                dest: 'public/views/',
                ext: '.min.js'
            }, {
                expand: true,
                cwd: 'public/scripts/',
                src: ['**/*.js', '**/!*.min.js'],
                dest: 'public/scripts/',
                ext: '.min.js'
            },
            {
                expand: true,
                cwd: 'public/js/',
                src: ['**/*.js', '**/!*.min.js'],
                dest: 'public/js/',
                ext: '.min.js'
            }]
        }
      }
  });

  grunt.registerTask('default', 'Log some stuff.', function() {
    grunt.log.write('Logging some stuff...').ok();
  });

    grunt.registerTask('clean',['clean']);

    grunt.registerTask('serve', [
        'clean',    
        'ngconstant:development',
        'jshint',
        'uglify:js',
        'cssmin'
    ]);
        
    grunt.registerTask('build', [
        'clean',
        'ngconstant:production',
        'htmlmin:dist',
        'uglify:js',
        'cssmin'
    ]);
    
    grunt.registerTask('minifyall', [
        'clean',
        'htmlmin:dist',
        'uglify:js',
        'cssmin'
    ]);
    
    grunt.registerTask('minifydev', [
        'clean',
        'uglify:js',
        'cssmin'
    ]);
    
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower-install');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    
  // Default task(s).
//  grunt.registerTask('default', ['clean']);

};
