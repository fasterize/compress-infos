# compress-infos

Get informations about a compressed file or buffer.

## Usage

```javascript
const compressInfos = require('compress-infos');

const fileType = compressInfos.getCompressionType('path/to/file.gz');
const fileSize = compressInfos?getUncompressedSize('path/to/file.gz');

const buffer = fs.readFileSync('path/to/file.gz');
const bufferType = compressInfos.getCompressionType(buffer);
const bufferSize = compressInfos.getUncompressedSize(buffer);

```

## Limitations

### GZip

As indicated in the [GZIP file format specification version 4.3](https://tools.ietf.org/html/rfc1952) : 

> ISIZE (Input SIZE) :
>
> ​	This contains the size of the original (uncompressed) input
> ​	data modulo 2^32.

So, if the input buffer or input file is a gzipped file containing datas for a more than 4GB uncompressed file, the size returned by this module will be wrong.

## Licence

(The MIT Licence)

Copyright (c) 2018 Fasterize

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
