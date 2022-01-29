const { fastCompile } = require('../../utils/templator')
const { compileMainTemplate } = require('../main');

function compileServiceTemplate(innerHtml, context) {
    var newHtml = fastCompile(__dirname + '/template.html', Object.assign(context, { layout_inner_data: innerHtml }));
    return compileMainTemplate(newHtml, context);
}

module.exports = { compileServiceTemplate }