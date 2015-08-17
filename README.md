slugid - Compressed UUIDs for Node.js 
=====================================
<img src="https://tools.taskcluster.net/lib/assets/taskcluster-120.png" />
[![Build Status](https://travis-ci.org/taskcluster/slugid.svg?branch=master)](http://travis-ci.org/taskcluster/slugid)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](https://github.com/taskcluster/slugid/blob/master/LICENSE)

A node.js module for generating v4 UUIDs and encoding them in URL-safe base64
(see [RFC 4648 sec. 5](http://tools.ietf.org/html/rfc4648#section-5)). The
url-safe base64 encoded uuid string is stripped of `=` padding. Slugs that
begin with the `-` character are discarded, and a new slug is generated.  This
is useful if the slugids might be used as command line arguments, to avoid
being interpreted as parameters.

The compressed UUIDs are always **22 characters** on the following form
`[A-Za-z0-9_-]{22}`, or more specifically
`[A-Za-z0-9_-]{8}[Q-T][A-Za-z0-9_-][CGKOSWaeimquy26-][AQgw][A-Za-z0-9_-]{10}`
due to the fixed value of 6 of the 128 bits, as defined in RFC 4122.

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
