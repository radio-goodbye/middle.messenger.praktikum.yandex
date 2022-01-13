const { fastCompile } = require('../../utils/templator')
const { compileServiceTemplate} = require('../../layout/service/index')
const fs = require('fs');

function compileSettingsTemplate(context) {
    var newHtml = fastCompile(__dirname + '/template.html', context)
    return compileServiceTemplate(newHtml, context);
}

module.exports = { compileSettingsTemplate }

function isEmpty(value) {
    if (Array.isArray(value)) return value.length == 0;
    if (typeof(value) == undefined|| typeof(value) == "null" || typeof(value) == "number" || typeof(value) == "boolean") return true;
    if (typeof(value) == "object") return Object.keys(value).length == 0;
    if (typeof(value) == "string") return value.length == 0;
    return true;
}