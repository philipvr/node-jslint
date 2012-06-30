var http = require('http');
var fs = require('fs');
var callback;

//The url we want, plus the path and options we need
var options = { host: 'www.jslint.com',
                path: '/jslint.js',
                method: 'GET'
              };

var processData = function (response) {
    'use strict';
    var pageData = '';

    // keep track of the data you receive
    response.on('data', function (data) {
        pageData += data;
    });

    // finished? ok, write the data to a file
    response.on('end', function () {
        fs.writeFile('jslint/jslint.js', pageData.toString(), function (err) {
            if (err) {
                throw err;
            }
            callback();
        });
    });
};

exports.getJSLint = function (cb) {
    'use strict';
    fs.mkdir("jslint");
    callback = cb;
    http.get(options, processData);
};
