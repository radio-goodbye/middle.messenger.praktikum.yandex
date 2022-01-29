const { fastCompile } = require('../../utils/templator');

function compileMainTemplate(innerHtml, context) {
    var newHtml = fastCompile(__dirname + '/template.html', Object.assign(context, { layout_inner_data: innerHtml }));
    return newHtml;
}

module.exports = { compileMainTemplate }