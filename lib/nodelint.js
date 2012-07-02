/*jslint
    nomen: true
 */
var vm = require("vm");
var fs = require("fs");

var ctx = vm.createContext();

try {
    var stats = fs.lstatSync(__dirname + "/../jslint/jslint.js");
} catch (e) {
    if(e.code === 'ENOENT') {
        console.log("Missing file '/jslint/jslint.js'");
        console.log("Try:\n\tsudo jslint --update");
        process.exit(1);
    }
}

vm.runInContext(fs.readFileSync(__dirname + "/../jslint/jslint.js"), ctx);

module.exports = ctx.JSLINT;
