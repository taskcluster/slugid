slugid - Compressed UUIDs for Node.js 
=====================================
[![Build Status](https://travis-ci.org/jonasfj/slugid.svg?branch=master)](https://travis-ci.org/jonasfj/slugid)

A node.js module for generating v4 UUIDs and encoding them in URL-safe base64
(see [RFC 4648 sec. 5](http://tools.ietf.org/html/rfc4648#section-5)).
The base64 encoded result is reversed in order that the generated slug does
not start with a `-` character. This is useful if the slugids might be used
as command line arguments, to avoid being interpreted as parameters.

The compressed UUIDs are always **22 characters** on the following form
`[A-Za-z0-9_-]{22}`. This is useful for small unique slugs.

In reality, the generated slugs follow a stricter form, due to the fixed
value of six bits according to RFC 4122:

`[AQgw][A-Za-z0-9_-]{10}[CGKOSWaeimquy26-][A-Za-z0-9_-][Q-T][A-Za-z0-9_-]{8}`

```js
var slugid = require('slugid');

// Generate URL-safe base64 encoded UUID version 4 (random)
var slug = slugid.v4(); // a8_YezW8T7e1jLxG7evy-A
```

Encode / Decode
---------------
```js
var slugid = require('slugid');

// Generate URL-safe base64 encoded UUID version 4 (random)
var slug = slugid.v4();

// Get UUID on the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
var uuid = slugid.decode(slug);

// Compress to slug again
assert(slug == slugid.encode(uuid));
```

License
-------
The `slugid` library is released on the MIT license, see the `LICENSE` for
complete license.
