// The MIT License (MIT)
//
// Copyright (c) 2014 Jonas Finnemann Jensen
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

var slugid  = require('./slugid');
var uuid    = require('uuid');

// Test that we can encode something which results in a slug containing '-' and '_' and no '='
exports.encodeTest = function(test) {
  test.expect(1);

  // Base64 of this contains +, / and =
  var uid = '804f3fc8-dfcb-4b06-89fb-aefad5e18754';
  var expectedSlug = "AVHGe1676-JawSL_Ny_8Eg"

  // Encode
  var actualSlug = slugid.encode(uid);

  // Test that it encoded correctly
  test.ok(expectedSlug == actualSlug, "Slug not correctly encoded: '" + expectedSlug + "' != '" + actualSlug + "'")

  test.done()
};

// Test that 100 uuids are unchanged after encoding and then decoding them
exports.uidEncodeDecodeTest = function(test) {
  test.expect(100);

  for (i = 0; i < 100; i++) {
    // Generate uuid
    var uid = uuid.v4();

    // Encode
    var slug = slugid.encode(uid);

    // Test that decode uuid matches original
    test.ok(slugid.decode(slug) == uid, "Encode and decode isn't identity");
  }

  test.done();
};

// Test that 100 slugs are unchanged after decoding and then encoding them
exports.slugDecodeEncodeTest = function(test) {
  test.expect(100);

  for (i = 0; i < 100; i++) {
    // Generate slug
    var slug1 = slugid.v4();

    // Decode
    var uid = slugid.decode(slug1);

    // Encode
    var slug2 = slugid.encode(uid);

    // Test that decode uuid matches original
    test.ok(slug1 == slug2, "Decode and encode isn't identity");
  }

  test.done();
};

// Test: Make sure that all allowed characters can appear in all allowed places...
// In this test we generate over a thousand slugids, and make sure that every
// possible allowed character per position appears at least once in the sample of
// all slugids generated. We also make sure that no other characters appear in
// positions in which they are not allowed.
//
// base 64 encoding char -> value:
// ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_
// 0         1         2         3         4         5          6
// 0123456789012345678901234567890123456789012345678901234567890123
//
// e.g. from this we can see 'j' represents 35 in base64
//
// The following comments show the 128 bits of the v4 uuid in binary, hex and base 64 encodings.
// The 6 fixed bits are shown among the 122 arbitrary value bits (represented by '.').
//
// schema:
//      <..........time_low............><...time_mid...><time_hi_+_vers><clk_hi><clk_lo><.....................node.....................>
//
// bin: ................................................0100............10xx............................................................0000
// hex: <00><01><02><03><04><05><06><07><08><09><10><11> 4  <13><14><15> $A <17><18><19><20><21><22><23><24><25><26><27><28><29><30><31>
// => $A in {'8', '9', 'A', 'B'} (0b10xx)
//
// bin: ................................................0100xx......xxxx10............................................................xx0000
// b64: < 00 >< 01 >< 02 >< 03 >< 04 >< 05 >< 06 >< 07 >  $B  < 09 >  $C  < 11 >< 12 >< 13 >< 14 >< 15 >< 16 >< 17 >< 18 >< 19 >< 20 >  $D
// => $B in {'Q', 'R', 'S', 'T'} (0b0100xx)
// => $C in {'C', 'G', 'K', 'O', 'S', 'W', 'a', 'e', 'i', 'm', 'q', 'u', 'y', '2', '6', '-'} (0bxxxx10)
// => $D in {'A', 'Q', 'g', 'w'} (0bxx0000)
exports.randomSpreadTest = function(test) {
  // k records which characters were found at which positions. It has one entry
  // per slugid character, therefore 22 entries. Each entry is an object with
  // a property for each character found, where the value of that property is
  // the number of times that character appeared at that position in the slugid
  // in the large sample of slugids generated in this test.
  var k = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];

  // We generate an array (`expected`) of all possible allowed characters per
  // position in the slugid. The array has 22 members, one for each position in
  // the slugid. Each entry is a lexicographically sorted string of the valid
  // characters at that position. The allowed characters are determined by the
  // schema shown in the test comments above.
  var charsAll = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split('').sort().join('');
  // 16, 17, 18, 19: 0100xx
  var charsB = "QRST".split('').sort().join('');
  // 2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62: xxxx10
  var charsC = "CGKOSWaeimquy26-".split('').sort().join('');
  // 0, 16, 32, 48: xx0000
  var charsD = "AQgw".split('').sort().join('');
  expected = [charsAll, charsAll, charsAll, charsAll, charsAll, charsAll, charsAll, charsAll, charsB, charsAll, charsC, charsAll, charsAll, charsAll, charsAll, charsAll, charsAll, charsAll, charsAll, charsAll, charsAll, charsD].reverse(); // reverse

  test.expect(1);

  // Generate a large sample of slugids, and record what characters appeared
  // where...  A monte-carlo test has demonstrated that with 64 * 20
  // iterations, no failure occurred in 1000 simulations, so 64 * 40 should be
  // suitably large to rule out false positives.
  for (i = 0; i < 64 * 40; i++) {
    var slug = slugid.v4();
    for (j = 0; j < slug.length; j++) {
      if (k[j][slug.charAt(j)] === undefined) {
        k[j][slug.charAt(j)] = 1
      } else {
        k[j][slug.charAt(j)]++;
      }
    }
  }

  // Compose results into an array `actual`, for comparison with `expected`
  var actual = [];
  for (j = 0; j < k.length; j++) {
    a = Object.keys(k[j])
    actual[j] = ""
    for (x = 0; x < a.length; x++) {
      if (k[j][a[x]] > 0) {
        actual[j] += a[x]
      }
    }
    // sort for easy comparison
    actual[j] = actual[j].split('').sort().join('');
  }

  test.ok(arraysEqual(expected, actual), "In a large sample of generated slugids, the range of characters found per character position in the sample did not match expected results.\n\nExpected: " + expected + "\n\nActual: " + actual)
  test.done();
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
