module.exports = function(grunt) {

    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            clinic: {
                src: ['javascript/Admin/Clinician/src/*.jsx'],
                dest: 'javascript/Admin/Clinician/tmp/joined.jsx'
            },
            desk: {
                src: ['javascript/Admin/FrontDesk/src/Mixins.jsx',
                    'javascript/Admin/FrontDesk/src/Summary.jsx',
                    'javascript/Admin/FrontDesk/src/CurrentlySeen.jsx',
                    'javascript/Admin/FrontDesk/src/Emergency.jsx',
                    'javascript/Admin/FrontDesk/src/Waiting.jsx',
                    'javascript/Admin/FrontDesk/src/Dashboard.jsx'
                ],
                dest: 'javascript/Admin/FrontDesk/tmp/joined.jsx'
            },
            settings: {
                src: ['javascript/Admin/Settings/src/Mixins.jsx', 'javascript/Admin/Settings/src/*.jsx'],
                dest: 'javascript/Admin/Settings/tmp/joined.jsx'
            },
            user: {
                src: ['javascript/User/Checkin/src/Mixins.jsx',
                    'javascript/User/Checkin/src/Swipe.jsx',
                    'javascript/User/Checkin/src/Reason.jsx',
                    'javascript/User/Checkin/src/Phone.jsx',
                    'javascript/User/Checkin/src/Emergency.jsx',
                    'javascript/User/Checkin/src/Instruction.jsx',
                    'javascript/User/Checkin/src/Login.jsx'
                ],
                dest: 'javascript/User/Checkin/tmp/joined.jsx'
            },
        },
        watch: {
            clinic: {
                    files: 'javascript/Admin/Clinician/src/*.jsx',
                    tasks: ['concat:clinic', 'babel:clinic'],
            },
            desk: {
                    files: 'javascript/Admin/FrontDesk/src/*.jsx',
                    tasks: ['concat:desk', 'babel:desk'],
            },
            settings: {
                    files: 'javascript/Admin/Settings/src/*.jsx',
                    tasks: ['concat:settings', 'babel:settings'],
            },
            user: {
                    files: 'javascript/User/Checkin/src/*.jsx',
                    tasks: ['concat:user', 'babel:user'],
            },
        },
        babel: {
            options: {
                sourceMap: true,
            },
            clinic: {
                files: {
                    'javascript/Admin/Clinician/build/script.js': 'javascript/Admin/Clinician/tmp/joined.jsx',
                }
            },
            desk: {
                files: {
                    'javascript/Admin/FrontDesk/build/script.js': 'javascript/Admin/FrontDesk/tmp/joined.jsx',
                }
            },
            settings: {
                files: {
                    'javascript/Admin/Settings/build/script.js': 'javascript/Admin/Settings/tmp/joined.jsx',
                }
            },
            user: {
                files: {
                    'javascript/User/Checkin/build/script.js': 'javascript/User/Checkin/tmp/joined.jsx'
                }
            },
        },
        uglify: {
            admin: {
                files: {
                    'javascript/Admin/Clinician/build/script.min.js': 'javascript/Admin/Clinician/build/script.js',
                    'javascript/Admin/FrontDesk/build/script.min.js': 'javascript/Admin/FrontDesk/build/script.js',
                    'javascript/Admin/Settings/build/script.min.js': 'javascript/Admin/Settings/build/script.js',
                    'javascript/User/Checkin/build/script.min.js': 'javascript/User/Checkin/build/script.js'
                }
            }
        },
        clean: {
            tmp: ['javascript/Admin/Clinician/tmp/',
                'javascript/Admin/FrontDesk/tmp/',
                'javascript/Admin/Settings/tmp/',
                'javascript/User/Checkin/tmp/'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("default", ['concat', 'babel', 'uglify', 'clean']);
}
