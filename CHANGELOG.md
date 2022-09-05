# Changelog for slugid

## v3.1.0 (2022-09-05)

* Buffer usage is [optional](https://github.com/taskcluster/slugid/pull/24) for browsers 

## v3.0.0 (2021-08-06)

* Drop support for node 4 (Node v6.17.1 is the earliest tested release)
* Add support for node 12, 14, and 16
* Remove unmaintained [uuid-parse](https://www.npmjs.com/package/uuid-parse)
* Update to [uuid](https://www.npmjs.com/package/uuid) 8.3.2, which now
  includes UUID parsing functions (again)
* Use ``Buffer.from(bytes)`` instead of the
  [insecure](https://nodejs.org/en/docs/guides/buffer-constructor-deprecation/)
  ``new Buffer(bytes)``
* Switch from TravisCI to Taskcluster for testing pull requests
* Add Code of Conduct, Contributing Guide, and Changelog

## v2.0.0 (2018-05-07)

* Drop support for node 0.10, 0.11
* Add support for node 4, 6, 8, and 10
* Update to [uuid](https://www.npmjs.com/package/uuid) 3.2.1
* Add [uuid-parse](https://www.npmjs.com/package/uuid-parse) 1.0.0 to parse
  UUIDs (instead of ``uuid``)

## v1.1.0 (2015-08-27)

* Add `slugid.nice()`, which ensures the first letter of the slug begins with a
  letter, allowing it to be used in more contexts
* Update to [uuid](https://www.npmjs.com/package/uuid) 2.0.1

## v1.0.3 (2014-10-06)

* Remove extra files not needed for the browser variant built with Browserify

## v1.0.2 (2014-08-19)

* Add a variant that runs in a browser using [Browserify](https://browserify.org/) 5.9.1

## v1.0.1 (2014-03-28)

* Add ``index.js`` with proper exports.

## v1.0.0 (2014-03-27)

* Initial release of code ported from Taskcluster

