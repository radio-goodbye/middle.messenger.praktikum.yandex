const { fastCompile } = require('../../utils/templator')
const { compileServiceTemplate} = require('../../layout/service/index')
const fs = require('fs');

function compileLoginTemplate(context) {
    var newHtml = fastCompile(__dirname + '/template.html', context)
    return compileServiceTemplate(newHtml, context);
}

module.exports = { compileLoginTemplate }