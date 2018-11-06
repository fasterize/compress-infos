const fs = require('fs');
const path = require('path');
const compressInfos = require('..');
const testHelpers = require('./test-helpers');

const TEST_GZIP_FILE = path.join(__dirname, 'index.js.gz');

const tests = {
  testIsGZFile: () => {
    testHelpers.assertTrue(compressInfos.isGZFile(TEST_GZIP_FILE));

    testHelpers.assertFalse(compressInfos.isGZFile('unknow-file.gz'));
    testHelpers.assertFalse(compressInfos.isGZFile(Buffer.alloc(1)));
    testHelpers.assertFalse(compressInfos.isGZFile(123));
  },

  testIsGZBuffer: () => {
    const buffer = fs.readFileSync(TEST_GZIP_FILE);
    testHelpers.assertTrue(compressInfos.isGZBuffer(buffer));

    testHelpers.assertFalse(compressInfos.isGZBuffer(TEST_GZIP_FILE));
    testHelpers.assertFalse(compressInfos.isGZBuffer(Buffer.alloc(1)));
    testHelpers.assertFalse(compressInfos.isGZBuffer(123));
  },

  testGetGZFileUncompressedSize: () => {
    testHelpers.assertTrue(compressInfos.getGZFileUncompressedSize(TEST_GZIP_FILE) === 1500);
    testHelpers.assertTrue(compressInfos.getGZFileUncompressedSize('unknow-file.gz') === -1);

    testHelpers.assertFalse(compressInfos.getGZFileUncompressedSize(TEST_GZIP_FILE) === 0);
  },

  testGetGZBufferUncompressedSize: () => {
    const buffer = fs.readFileSync(TEST_GZIP_FILE);
    testHelpers.assertTrue(compressInfos.getGZBufferUncompressedSize(buffer) === 1500);
    testHelpers.assertTrue(compressInfos.getGZBufferUncompressedSize(Buffer.alloc(1)) === -1);

    testHelpers.assertFalse(compressInfos.getGZBufferUncompressedSize(buffer) === 0);
  },

  testGetCompressionType: () => {
    testHelpers.assertEqual(
      compressInfos.getCompressionType(TEST_GZIP_FILE),
      compressInfos.GZIP
    );

    const buffer = fs.readFileSync(TEST_GZIP_FILE);
    testHelpers.assertEqual(
      compressInfos.getCompressionType(buffer),
      compressInfos.GZIP
    );

    testHelpers.assertEqual(
      compressInfos.getCompressionType('unknow-file.gz'),
      compressInfos.UNDEFINED
    );
    testHelpers.assertEqual(
      compressInfos.getCompressionType(Buffer.alloc(1)),
      compressInfos.UNDEFINED
    );
  },

  testGetUncompressionSize: () => {
    testHelpers.assertEqual(
      compressInfos.getUncompressedSize(TEST_GZIP_FILE),
      1500
    );

    const buffer = fs.readFileSync(TEST_GZIP_FILE);
    testHelpers.assertEqual(
      compressInfos.getUncompressedSize(buffer),
      1500
    );

    testHelpers.assertEqual(
      compressInfos.getUncompressedSize('unknow-file.gz'),
      -1
    );
    testHelpers.assertEqual(
      compressInfos.getUncompressedSize(Buffer.alloc(1)),
      -1
    );
  },
};

testHelpers.run(tests);
