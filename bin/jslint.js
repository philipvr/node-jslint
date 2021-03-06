#!/usr/bin/env node

var linter;
var reporter = require("../lib/reporter");
var nopt = require("nopt");
var fs = require("fs");
var util = require("util");

function commandOptions() {
    'use strict';
    var flags = [
            'anon', 'bitwise', 'browser', 'cap', 'continue', 'css',
            'debug', 'devel', 'eqeq', 'es5', 'evil', 'forin', 'fragment',
            'newcap', 'node', 'nomen', 'on', 'passfail', 'plusplus',
            'properties', 'regexp', 'rhino', 'undef', 'unparam',
            'sloppy', 'stupid', 'sub', 'vars', 'white', 'widget', 'windows',
            'json', 'color', 'terse', 'quiet', 'update'
        ],
        commandOpts = {
            'indent' : Number,
            'maxerr' : Number,
            'maxlen' : Number,
            'predef' : [String, Array]
        };

    flags.forEach(function (option) {
        commandOpts[option] = Boolean;
    });

    return commandOpts;
}

var options = commandOptions();
var parsed = nopt(options);

var totalFiles = parsed.argv.remain.length;

function die(why) {
    'use strict';
    console.warn(why);
    console.warn("Usage: " + process.argv[1] +
        " [--" + Object.keys(options).join("] [--") +
        "] [--] <scriptfile>...");
    process.exit(1);
}

// If there are no more files to be processed, exit with the value 1
// if any of the files contains any lint.
var maybeExit = (function () {
    'use strict';
    var filesLeft = totalFiles,
        ok = true;

    return function (lint) {
        filesLeft -= 1;
        ok = lint.ok && ok;

        if (filesLeft === 0) {
            // This was the last file.
            process.exit(ok ? 0 : 1);
        }
    };
}());

var tracker = {
    results: [],
    total: totalFiles
};

function lintFile(file) {
    'use strict';

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }

        var lint = linter.lint(data, parsed);

        if (parsed.json) {
            console.log(JSON.stringify([file, lint.errors]));
        } else {
            tracker.results.push(reporter.report(file, lint, parsed.color, parsed.terse, parsed.quiet, tracker));
        }

        maybeExit(lint);
    });
}

var main = function main() {
    'use strict';
    linter = require("../lib/linter");
    if (parsed.update) {
        console.log("done");
        if (!totalFiles) {
            process.exit(0);
        }
    } else if (!totalFiles) {
        die("No files specified.");
    }
    parsed.argv.remain.forEach(lintFile);
}

if (parsed.update) {
    util.print("updating... ");
    var update = require('../lib/update.js');
    update.getJSLint(main);
} else {
    main();
}

