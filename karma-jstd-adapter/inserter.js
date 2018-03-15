var fs = require('fs');

var base = process.argv[2];
function read(filename) {
    return "\n\n" + fs.readFileSync(base + filename + ".js").toString();
}

var text = read("jstestdrivernamespace")
    + read("lib/json2")
    + read("lib/json_sans_eval")
    + read("lib/jquery-min")
    + read("standalonerunner");
text = text.replace(/window\.top\.location/, "\"/id/1/slave/\"");
text = text.replace(/top\.location/g, "\"/id/1/slave/\"");

var template = fs.readFileSync("./jstd-adapter-template.js").toString();

var output = template.replace("/*REPLACE*/", text);
fs.writeFileSync("jstd-adapter.js", output);