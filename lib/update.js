var http = require('http');
var fs = require('fs');

//The url we want, plus the path and options we need
var options = { host: 'www.jslint.com',
                path: '/jslint.js',
                method: 'GET'
              };

var processData = function (cb) {
    'use strict';
    return function (response) {
        var pageData = '';

        // keep track of the data you receive
        response.on('data', function (data) {
            pageData += data;
        });

        // finished? ok, write the data to a file
        response.on('end', function () {
            fs.writeFile(__dirname + '/../jslint/jslint.js', pageData.toString(), function (err) {
                if (err) {
                    if (err.code === 'EACCES') {
                        console.log("Must be root");
                        console.log("Try:\n\tsudo jslint --update");
                        process.exit(1);
                    }
                    throw err;
                }
                cb();
            });
        });
    };
};

exports.getJSLint = function (cb) {
    'use strict';
    try {
        fs.mkdirSync(__dirname + "/../jslint");
    } catch (e) {
        if (e.code === 'EACCES') {
            console.log("Must be root");
            console.log("Try:\n\tsudo jslint --update");
            process.exit(1);
        } else if (e.code !== 'EEXIST') {
            throw e;
        }
    }
    http.get(options, processData(cb));
};
