const { fastCompile } = require('../../utils/templator')
const { compileMainTemplate } = require('../../layout/main');

function compileChatTemplate(context) {
    var newHtml = fastCompile(__dirname + '/template.html', context);
    return compileMainTemplate(newHtml, context);
}

module.exports = { compileChatTemplate }