const fs = require('fs');
const {templates} = require('./examples_data')

var compile_dict = {
    'index.html': 'login',
    'login.html': 'login',
    'register.html': 'register',
    'settings.html': 'settings',
    'chat.html': 'chat',
    'error_404.html': 'error_404',
    'error_500_and_more.html': 'error_500_and_more',
}

for (var i in compile_dict){
    let html = templates[compile_dict[i]]();
    let filepath = `${process.cwd()}/src/pages/examples/${i}`;
    fs.writeFileSync(filepath, html);
}