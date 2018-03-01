module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.initConfig({
    watch: {
      files: 'client/*.html'
    },
    pkg: grunt.file.readJSON('package.json'),
    run:  {
      server: {
        options: {
          wait: false
        },
        args: ['./server/server.js']
      }
    },
    open: {
      website: {
        path: 'http://localhost:3000',
        app: 'Chrome'
      }
    },
    browserSync: {
      default_options: {
        bsFiles: {
          src: [
            "css/*.css",
            "client/*.html"
          ]
        },
        options: {
          watchTask: true,
          proxy: "localhost:3000"
        }
      }
    }
  });
  grunt.registerTask('default', ['browserSync', 'watch']);
  grunt.registerTask('start', 'start task', ['run:server']);
  grunt.registerTask('view', ['open:website:keepalive']);
};
