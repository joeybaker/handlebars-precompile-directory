'use strict';
module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    , meta: {
      version: '<%= pkg.version %>'
      , banner: '/*! <%= pkg.name %> - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n'
    }
    , jshint: {
      all: [
        'Gruntfile.js'
        , 'index.js'
        , 'lib/**/*.js'
        , 'test/**/*.js'
      ]
      , options: {
        jshintrc: '.jshintrc'
      }
    }
    , jscs: {
      options: {}
      , all: '<%= jshint.all %>'
    }
    , bump: {
      options: {
        tabSize: 2
      }
      , files: ['package.json']
    }
    , shell: {
      gitTag: {
        command: 'git tag v<%= grunt.file.readJSON("package.json").version %>'
        , options: {
          stdout: true
          , failOnError: true
        }
      }
      , gitRequireCleanTree: {
        command: 'function require_clean_work_tree(){\n' +
          ' # Update the index\n' +
          '    git update-index -q --ignore-submodules --refresh\n' +
          '    err=0\n' +

          ' # Disallow unstaged changes in the working tree\n' +
          '    if ! git diff-files --quiet --ignore-submodules --\n' +
          '    then\n' +
          '        echo >&2 "cannot $1: you have unstaged changes."\n' +
          '        git diff-files --name-status -r --ignore-submodules -- >&2\n' +
          '        err=1\n' +
          '    fi\n' +

          ' # Disallow uncommitted changes in the index\n' +
          '    if ! git diff-index --cached --quiet HEAD --ignore-submodules --\n' +
          '    then\n' +
          '        echo >&2 "cannot $1: your index contains uncommitted changes."\n' +
          '        git diff-index --cached --name-status -r --ignore-submodules HEAD -- >&2\n' +
          '        err=1\n' +
          '    fi\n' +

          '    if [ $err = 1 ]\n' +
          '    then\n' +
          '        echo >&2 "Please commit or stash them."\n' +
          '        exit 1\n' +
          '    fi\n' +
          '} \n require_clean_work_tree'
        , options: {
          failOnError: true
        }
      }
      , gitCommitPackage: {
        command: 'git commit -i -s package.json -m"v<%= grunt.file.readJSON("package.json").version %>"'
        , options: {
          stdout: true
          , failOnError: true
        }
      }
      , gitPush: {
        command: 'git push origin master --tags'
        , options: {
          stdout: true
          , failOnError: true
        }
      }
      , gitPullRebase: {
        command: 'git pull --rebase origin master'
        , options: {
          stdout: true
          , failOnError: true
        }
      }
      , npmPublish: {
        command: 'npm publish'
        , options: {
          stdout: true
          , failOnError: true
        }
      }
      , npmTest: {
        command: 'npm test'
        , options: {
          stdout: true
          , failOnError: true
        }
      }
    }
  })

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.registerTask('publish', 'create a tag and publish to npm', function(){
    var bump = (grunt.option('bump') || grunt.option('level') || 'patch')
    grunt.option('level', bump)
    grunt.log.writeln(('Publishing a ' + grunt.option('level') + ' version').yellow)

    grunt.task.run([
      'shell:gitRequireCleanTree'
      , 'shell:gitPullRebase'
      , 'jshint'
      , 'jscs'
      , 'shell:npmTest'
      , 'bump'
      , 'shell:gitCommitPackage'
      , 'shell:gitTag'
      , 'shell:gitPush'
      , 'shell:npmPublish'
    ])
  })
}
