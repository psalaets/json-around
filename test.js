var jsonAround = require('./');
var test = require('tape');
var through = require('through2');

// make a transformFunction for a through stream that just passes chunk to fn
function justCall(fn) {
  return function(chunk, enc, cb) {
    fn(chunk);
    cb();
  };
}

test('put object around number array', function(t) {
  t.plan(1);

  var source = through.obj();
  var ja = jsonAround('items', {
    color: 'red'
  });

  var buffer = [];
  var bufferStream = through.obj(justCall(buffer.push.bind(buffer)), end);

  source.pipe(ja).pipe(bufferStream);

  source.write(1)
  source.write(2)
  source.end(3)

  function end(cb) {
    t.deepEqual(buffer, [
      '{"color":"red","items":[',
      '1,',
      '2,',
      '3]}'
    ])

    cb();
    t.end();
  }
});

test('put object around object array', function(t) {
  t.plan(1);

  var source = through.obj();
  var ja = jsonAround('items', {
    color: 'red'
  });

  var buffer = [];
  var bufferStream = through.obj(justCall(buffer.push.bind(buffer)), end);

  source.pipe(ja).pipe(bufferStream);

  source.write({name: 'foo'});
  source.write({name: 'bar'});
  source.end();

  function end(cb) {
    t.deepEqual(buffer, [
      '{"color":"red","items":[',
      '{"name":"foo"},',
      '{"name":"bar"}]}'
    ])

    cb();
    t.end();
  }
});

test('put object around mixed array', function(t) {
  t.plan(1);

  var source = through.obj();
  var ja = jsonAround('items', {
    color: 'red'
  });

  var buffer = [];
  var bufferStream = through.obj(justCall(buffer.push.bind(buffer)), end);

  source.pipe(ja).pipe(bufferStream);

  source.write({name: 'foo'});
  source.write('cat');
  source.write(true);
  source.end([1,2,3]);

  function end(cb) {
    t.deepEqual(buffer, [
      '{"color":"red","items":[',
      '{"name":"foo"},',
      '"cat",',
      'true,',
      '[1,2,3]]}'
    ]);

    cb();
    t.end();
  }
});

test('respects custom json representations', function(t) {
  t.plan(1);

  var source = through.obj();
  var ja = jsonAround('items', {
    color: 'red'
  });

  var buffer = [];
  var bufferStream = through.obj(justCall(buffer.push.bind(buffer)), end);

  source.pipe(ja).pipe(bufferStream);

  source.end({
    // this *won't* be in json
    name: 'foo',
    // because this controls json representation
    toJSON: function() {
      return {
        super: 'blah'
      };
    }
  });

  function end(cb) {
    t.deepEqual(buffer, [
      '{"color":"red","items":[',
      '{"super":"blah"}]}'
    ]);

    cb();
    t.end();
  }
});