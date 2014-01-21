// Load the namespace
example = require("./autoloader")(__dirname + '/example', {}, 'example');

// Use any class
var pin = new example.foo.baz.Pin();
var bar = new example.foo.Bar();

