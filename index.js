var through = require('through2');

module.exports = function jsonAround(arrayPropertyName, wrapperObject) {
  var wrapperJson = toJson(wrapperObject);

  var openObject = wrapperJson.slice(0, -1);
  var openArray = ',"' + arrayPropertyName + '":[';

  var previousChunkAsJson;

  return through.obj(function transform(chunk, enc, cb) {
    // this is first chunk
    if (typeof previousChunkAsJson == 'undefined') {
      // write first part of wrapper object and start array
      this.push(openObject + openArray);
    } else {
      // somewhere in middle of array
      this.push(previousChunkAsJson + ',');
    }

    try {
      previousChunkAsJson = toJson(chunk);
    } catch (error) {
      return cb(error);
    }

    cb();
  }, function end(cb) {
    // write final array element, close array, close object
    this.push(previousChunkAsJson + ']}');
    cb();
  });
};

function toJson(value) {
  return JSON.stringify(value);
}