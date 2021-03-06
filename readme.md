## About

Autoloads JS files based on name when the class is needed.

This module removes the needs of using require() all over your files. Simply
define the autoloader to your codebase, and use the names relative to the files.

**Important: The extension relies on the use of Proxies so you must run nodejs with the --harmony parameter!**


## Install

Install with npm install autoloader

## Usage

The following line loads a namespace:

	namespaceObject = require("autoloader")(baseFolderPath, namespaceObject, namespaceName)

The three parameters serve the following purposes:

1. *baseFolderPath*: It's the absolute path of the folder containing all the namespaced source files.
   It's used by the autoloader to convert symbolic name to real file paths.

2. *namespaceObject*: It's the object that will receive the autoloading functionality. Most of the times
   you'll just pass a literal object which will serve as the autoloadable namespace.

3. *namespaceName*: This is just an auxiliary parameter which will help make possible errors more
   understandable. You should pass it the name of the namespace as a string.

## Example

Example folder structure:

    /example/
             foo/
                 baz/
                     Pin.js
             Bar.js
    /example.js
    
File contents:

**/example/foo/baz/Pin.js**

	/**
	 * Pin class.
	 *
	 * @class
	 */
	example.foo.baz.Pin = function()
	{
		console.log('Pin loaded!');
	};

**/example/foo/Bar.js**

	/**
	 * Bar class.
	 *
	 * @class
	 */
	example.foo.Bar = function()
	{
		console.log('Bar loaded!');
	};

**/example.js**:
    
	// Load the namespace
	example = require("./autoloader")(__dirname + '/example', {}, 'example');

	// Use any class
	var pin = new example.foo.baz.Pin();
	var bar = new example.foo.Bar();


Running the **example.js** file

	node --harmony example

yields the following output:

	Pin loaded!
	Bar loaded!


## Custom Loaders

If you pass a function as the 1st argument, autoloader will execute that instead of
loading by directory, allowing you to control what is returned.
Callback signature

    function (name, object) { }

You will need to assign the value yourself if you wish to not have your loader fire every access.

## License
The MIT License

  Copyright (c) 2013 Daniel Ennis <aikar@aikar.co>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

