# Javascript URL parser

URL parsing in javascript. Handles nested arrays and object url params.

## Usage

```:javascript
// Parse a uri:
var uri = URI.parse('http://www.nathansplace.co.uk:80/javascript/uri-js/docs/?array[]=one&array[]=two&hash[key]=value#something');

=> {
  protocol: 'http:',
  host: 'www.nathansplace.co.uk',
  port: 80,
  path: ['javascript', 'uri-js', 'docs'],
  params: {
    array: ['one', 'two'],
    hash: {
      key: value
    }
  },
  hash: 'something'
}

// And put it back how you found it...
URI.stringify(uri);

=> 'http://www.nathansplace.co.uk:80/projects/javascript/uri-js/docs/?array[]=one&array[]=two&hash[key]=value#something'
```

## Development

### TODO:
* parse subdomans
* docs
* thorough cross browser testing
* seperate parse and stringify objects out from uri

### Testing
Run `rake test`.

