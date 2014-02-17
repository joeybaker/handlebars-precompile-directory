/* global describe, it, afterEach */
'use strict';

var chai = require('chai')
  , should = chai.should()
  , Handlebars = require('handlebars')
  , path = require('path')
  , getTemplates = require('../')

describe('handlebars-precompile-directory', function(){
  var templatePath = path.join(__dirname, '/fixtures')

  afterEach(function(){
    Handlebars.partials = {}
  })

  it('throws if no templates path is given', function(){
    try {
      getTemplates({})
    }
    catch (e){
      should.exist(e)
    }
  })

  it('ignores files without the extension', function(done){
    getTemplates({templates: templatePath}, function(templates){
      templates.should.not.contain.keys('not-a-template')
      done()
    })
  })

  it('registers partials that start with a underscore', function(done){
    getTemplates({templates: templatePath}, function(templates){
      templates.should.not.contain.keys('partial')
      Handlebars.partials.should.contain.keys('partial')
      done()
    })
  })

  it('sets the name to be the relative path of the template', function(done){
    getTemplates({templates: templatePath}, function(templates){
      templates.should.contain.keys(['template1', 'template2', 'nested/template1'])
      done()
    })
  })

  it('callsback with an empty object if there are no templates found', function(done){
    getTemplates({templates: path.join(templatePath, '/templates')}, function(templates){
      templates.should.be.an.object
      done()
    })
  })
})
