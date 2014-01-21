//  Copyright (c) 2013 Daniel Ennis <aikar@aikar.co>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var path = require("path");
var fs = require('fs');

// Registry of namespace objects
var nsObjects = [
];

// Registry of source directories per namespace object.
// Each namespace object might contain multiple dir entries (don't understand why).
var nsObjectSourceDirs = [
];

function registerAutoloader(absolutePhysicalRootPath, nsObject, nsName) {

	// Determine namespace object
	nsObject = nsObject || global;

	// Retrieve the id of the namespace object in our local array (if any)
	var nsObjectId = nsObjects.indexOf(nsObject);

	if (nsObjectId == -1) {
		// First time we encouter this namespace object

		// Reserve the next id and append in the array
		nsObjectId = nsObjects.length;
		nsObjects.push(nsObject);

		// Intercept the recipient object's getter
		nsObject.__proto__ = proxy(nsObject.__proto__, loadModule);

		nsObjectSourceDirs[nsObjectId] = absolutePhysicalRootPath;
	}

	function loadModule(symbolicName) {
		// Dir is a real file system directory
		var modulePhysicalPath = path.join(absolutePhysicalRootPath, symbolicName);
		try {
			// Test if it's a folder
			fs.lstatSync(modulePhysicalPath);
//			console.log('Loaded namespace ' + modulePhysicalPath);
			nsObject[symbolicName] = registerAutoloader(modulePhysicalPath, {}, nsName + '.' + symbolicName);
			return nsObject[symbolicName];


		} catch (ignore) {
			try {
				// Try to load as source module
				require(modulePhysicalPath + '.js');

				return nsObject[symbolicName];

			} catch (ignore) {
				throw new Error(nsName + '.' + symbolicName + ' does not correspond to a source module file or a namespace folder');
			}
		}
	}
	return nsObject;
}

// Export the autoloader
module.exports = registerAutoloader;

function proxy(targetObject, getterCallback) {
	return Proxy.create({
		getPropertyDescriptor: Object.getOwnPropertyDescriptor.bind(null, targetObject),
		getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor.bind(null, targetObject),
		getOwnPropertyNames: Object.getOwnPropertyNames.bind(null, targetObject),
		getPropertyNames: Object.getOwnPropertyNames.bind(null, targetObject),
		keys: Object.keys.bind(null, targetObject),
		defineProperty: Object.defineProperty.bind(null, targetObject),
		set: function(r, k, v) {
			targetObject[k] = v;
			return true;
		},
		has: function(k) {
			return k in targetObject;
		},
		hasOwn: function(k) {
			return {}.hasOwnProperty.call(targetObject, k);
		},
		delete: function(k) {
			delete targetObject[k];
			return true;
		},
		enumerate: function() {
			var i = 0, k = [
			];
			for (k[i++] in targetObject)
				;
			return k;
		},
		get: function(r, key) {
			if (key != 'v8debug' && targetObject[key] == undefined) {
				return getterCallback(key);
			}
		}
	},
	Object.getPrototypeOf(targetObject));
}
