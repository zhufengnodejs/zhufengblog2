var debug = require('debug');
//env是环境变量对象
console.log(process.env.DEBUG);
var logger1 = debug('logger:1');
logger1('1');
//console.log('1');
var logger2 = debug('logger:2');
logger2('2');