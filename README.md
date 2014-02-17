handlebars-precompile-directory
===============================

Precompile a directory of handlebars templates.

## Usage

```js
var getTemplates = require('handlebars-precompile-directory')
  , path = require('path')

  getTemplates({
    templates: path.resolve('./templates')
    , ext: 'hbs'
  }, function getTemplateCallback(templates){
    // templates.template1({value: 'hi'})
    // templates['directory/has/nested/templates/template2']({value: 'hello'})
  })
```

## Options

### Options object
#### `templates`
The full path to the template directory.

#### `ext`
The extension to look for. Defaults to `hbs`.

### callback `function(templates)`
The only argument is a templates object that contains all the pre-compiled templates.

## Test
Tests are all mocha, and can be run without installing mocha globally with `npm test`.

## Changelog

0.1.0 Init
