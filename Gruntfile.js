process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = function(grunt) {
    var EXPORT_NAME = 'Dable';
    var path = require('path');
    
    var mainWrapperTemplate = [
    '(function (module) {', '<%= src %>', '})(function (root) {',
        'return Object.defineProperty({}, \'exports\', {',
            'set: function (i) { root[\'' + EXPORT_NAME + '\'] = i; },',
            'get: function () { return root[\'' + EXPORT_NAME + '\']; }',
        '});',
    '}(this));\n'].join('\n');

    var requireStubs = [
        'var $$modules = {}',
        'var defineModule = function (name, exporter) { $$modules[name] = { exporter: exporter, ready: false }; };',
        'var require = function (name) {',
            'var m = $$modules[name];',
            'if (m && !m.ready) {',
                'm.exports = {};',
                'm.exporter.call(null, require, m, m.exports);',
                'm.ready = true;',
            '}',
            'return m && m.exports;',
        '};\n\n'
    ].join('\n');

    var moduleWrapper = ['defineModule(\'<%= name %>\', function (require, module, exports) {', '<%= src %>', '});\n'].join('\n');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            all: {
                src: ['index.js', 'lib/*.js'],
                options: {
                    globalstrict: true,
                    globals: {
                        require: false,
                        exports: false,
                        module: false
                    }
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    preserveComments: 'some',
                    mangle: {
                        except: ['Dable']
                    }
                },
                files: {
                    'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js'
                }
            },
            beautify: {
                options: {
                    preserveComments: 'some',
                    beautify: true,
                    mangle: false
                },
                files: {
                    'dist/<%= pkg.name %>.js': 'dist/<%= pkg.name %>.js'
                }
            }
        },
        concat: {
            dist: {
                options: {
                    banner: '/*! <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>) */\n\n',
                    process: function (src) {
                        return grunt.template.process('\n(function () {\n<%= src %>\n}).call(this);\n', { data: { src: src }});
                    }
                },
                files: {
                    'dist/<%= pkg.name %>.js': '.build/<%= pkg.name %>.js'
                }
            },

            build: {
                options: {
                    banner: requireStubs,
                    process: function (src, filePath) {
                        var name = path.basename(filePath, '.js');
                        if (name === 'dable') {
                            return grunt.template.process(mainWrapperTemplate, { data: { src: src }});
                        }

                        return grunt.template.process(moduleWrapper, { data: { src: src, name: './' + name }});
                    }
                },
                files: {
                    '.build/<%= pkg.name %>.js': [
                        'lib/utils.js',
                        'lib/dable.js'
                    ]
                }
            }
        },
        clean: [
            '.build',
            'dist'
        ]
    });

    if (process.env.NODE_ENV === 'development') {
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-clean');

        grunt.registerTask('test', ['jshint']);
        grunt.registerTask('default', 'test');
        grunt.registerTask('build', ['test', 'clean', 'concat:build', 'concat:dist', 'uglify:beautify', 'uglify:dist']);
    }
};
