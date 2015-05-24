var through = require('through2');

module.exports = function jsonAround(arrayPropertyName, wrapperObject) {
  var json = JSON.stringify(wrapperObject);

  var openObject = json.slice(0, -1);
  var openArray = ',"' + arrayPropertyName + '":[';

  var previousChunk;

  return through.obj(function transform(chunk, enc, cb) {
    // this is first chunk
    if (typeof previousChunk == 'undefined') {
      // write first part of wrapper object and start array
      this.push(openObject + openArray);
    } else {
      // somewhere in middle of array
      this.push(toJson(previousChunk) + ',');
    }

    previousChunk = chunk;

    cb();
  }, function end(cb) {
    // write final array element, close array, close object
    this.push(toJson(previousChunk) + ']}');
    cb();
  });
};

function toJson(value) {
  return JSON.stringify(value);
}