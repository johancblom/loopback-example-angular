module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-open');
  grunt.initConfig({
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
    }
  });
  grunt.registerTask('default', ['start']);
  grunt.registerTask('start', 'start task', ['run:server']);
  grunt.registerTask('view', ['open:website:keepalive']);
};
