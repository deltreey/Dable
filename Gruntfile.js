process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            all: {
                src: ['Dable.js'],
                options: {
                    globalstrict: true,
                    globals: {
                        require: false,
                        exports: false,
                        module: false
                    }
                }
            }
        }
    });

    if (process.env.NODE_ENV === 'development') {
        grunt.loadNpmTasks('grunt-contrib-jshint');

        grunt.registerTask('test', ['jshint']);
        grunt.registerTask('default', 'test');
    }
};
