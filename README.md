# json-around

Put a JSON string around an object stream.

## Example

Given this code

```js
var through = require('through2');
var jsonAround = require('json-around');

var source = through.obj();

source
  .pipe(jsonAround('animals', {
    location: 'farm'
  }))
  .pipe(process.stdout);

source.write({"name":"horse"});
source.write({"name":"cow"});
source.end();
```

stdout will (roughly) get

```
{
  "location": "farm",
  "animals": [
    {"name":"horse"},
    {"name":"dog"},
    {"name":"cow"}
  ]
}
```

and it would have been streamed in chunks like

```
{"location":"farm","animals":[
```

```
{"name":"horse"},
```

```
{"name":"dog"},
```

```
{"name":"cow"}]}
```

## API

### jsonAround(arrayPropertyName, wrapperObject)

#### param: arrayPropertyName

String to use for the array's key in resulting JSON.

#### param: wrapperObject

Object that will be converted to JSON and have array added to it.

#### returns: through stream

Objects piped in will become elements of the array.

Output is chunks of json.

## Install

`npm install json-around`

## License

MIT
