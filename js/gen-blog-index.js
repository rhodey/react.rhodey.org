var fs       = require('fs');
var readline = require('readline');


function readerFor(filename) {
  return readline.createInterface({
    input : fs.createReadStream(filename)
  });
}

function headerFor(filename, cb) {
  var lineCount = 0;
  var header    = [];

  readerFor(filename).on('line', function (line) {
    if (++lineCount > 1 && lineCount < 6) {
      header.push(line);
    } else if (lineCount === 6) {
      cb({
        filename : filename,
        path     : header[0],
        date     : header[1],
        title    : header[2],
        summary  : header[3]
      });
    }
  });
}

function writeToIndex(headers) {
  headers = headers.sort(function(a, b) {
    return (new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  var index  = "var index = [];\n";
      index += "\n\n";

  headers.forEach(function(header) {
    index += "index['" + header.path + "'] = " + JSON.stringify(header) + ";\n";
    index += "\n";
  });

  index += "\n";
  index += "module.exports = index;\n";

  fs.writeFile('js/blog-index.js', index, function(err) {
    if (err) { console.log("err -> " + err); }
  });
}


var headers = [];
fs.readdir('md/', function(err, files) {
  files = files.filter(function(file) { return file.endsWith(".md"); });
  if (err) {
    console.log("err -> " + err);
  } else {
    files.forEach(function(file) {
      headerFor("md/" + file, function(header) {
        headers.push(header);
        if (headers.length === files.length) { writeToIndex(headers); }
      });
    });
  }
});

