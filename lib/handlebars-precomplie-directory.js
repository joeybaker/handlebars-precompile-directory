'use strict';

var findit = require('findit')
  , fs = require('fs')
  , Handlebars = require('handlebars')
  , path = require('path')

// options.templates
// options.ext
// callback(templates)
module.exports = function compile(options, callback){
  var find = findit(options.templates)
  , templateFileCount = 0
  , filesToGet = 0
  , templates = {}
  , done = function(){
    if (filesToGet !== 0) return

    callback(templates)
  }

  options || (options = {})
  options.ext || (options.ext = 'hbs')

  if (!options.templates) throw new Error('A template path is needed in order to precompile handlebars templates')

  find.on('file', function(file){
    var name = path.relative(options.templates, file)
      , extIndex = name.indexOf(options.ext, name.length - options.ext.length)
      , basename

    // if the file doesn't end with our extension, bail
    if (extIndex < 0) return

    templateFileCount++

    // get the relative path, without the extension
    basename = path.basename(file)

    fs.readFile(file, {encoding: 'utf-8'}, function(err, content){
      if (err) throw err

      // if the file starts with an _, then it's a partial
      if (basename.charAt(0) === '_')
        // strip the _ from the front of the partial name
        Handlebars.registerPartial(name.replace(basename, basename.substring(1)).substring(0, extIndex - 2), '' + content)
      else templates[name.substring(0, extIndex - 1)] = Handlebars.compile('' + content)

      filesToGet--
      done()
    })
  })

  find.on('end', function(){
    filesToGet += templateFileCount
    done()
  })
}
