'use strict';

const fs = require('fs');

const GZIP_MAGIC = '1f8b';
const COMPRESSION_TYPE = {
  UNDEFINED: 'undefined',
  GZIP: 'gzip',
  BROTLI: 'brotli',
};

const isGZBuffer = (buffer) => {
  if (Buffer.isBuffer(buffer) && buffer.length >= 2) {
    return Buffer
      .alloc(2, buffer)
      .toString('hex')
      .toLowerCase() === GZIP_MAGIC;
  }
  return false;
};

const isGZFile = (filename) => {
  if (!fs.existsSync(filename)) {
    return false;
  }

  const fd = fs.openSync(filename, 'r');
  if (!fd) {
    return false;
  }

  let result = false;
  let buffer = Buffer.alloc(2);
  if (fs.readSync(fd, buffer, 0, 2, 0) === 2) {
    result = isGZBuffer(buffer);
  }

  fs.closeSync(fd);
  return result;
};

const getGZBufferUncompressedSize = (buffer) => {
  if (isGZBuffer(buffer)) {
    return (buffer[buffer.length - 1] << 24)
      + (buffer[buffer.length - 2] << 16)
      + (buffer[buffer.length - 3] << 8)
      + buffer[buffer.length - 4];
  }

  return -1;
};

const getGZFileUncompressedSize = (filename) => {
  if (isGZFile(filename)) {
    const fileSize = fs.statSync(filename).size;
    const fd = fs.openSync(filename, 'r');
    if (!fd) {
      return -1;
    }

    var buffer = Buffer.alloc(4);
    var result = -1;
    if (fs.readSync(fd, buffer, 0, 4, fileSize - 4) === 4) {
      result = (buffer[3] << 24) + (buffer[2] << 16) + (buffer[1] << 8) + buffer[0];
    }

    fs.closeSync(fd);
    return result;
  }

  return -1;
};

const _getUncompressedSize = (filenameOrBuffer, types) => {
  let result = -1;

  while (true) {
    let type = types.shift();
    if (type) {
      if (type.input(filenameOrBuffer)) {
        result = type.output(filenameOrBuffer);
        break;
      }
    } else {
      break;
    }
  }

  return result;
};

const getFileUncompressedSize = (filename) => {
  return _getUncompressedSize(
    filename,
    [
      { input: isGZFile, output: getGZFileUncompressedSize },
    ]
  );
};

const getBufferUncompressedSize = (buffer) => {
  return _getUncompressedSize(
    buffer,
    [
      { input: isGZBuffer, output: getGZBufferUncompressedSize },
    ]
  );
};

const getUncompressedSize = (filenameOrBuffer) => {
  return _getUncompressedSize(
    filenameOrBuffer,
    [
      { input: isGZFile, output: getGZFileUncompressedSize },
      { input: isGZBuffer, output: getGZBufferUncompressedSize },
    ]
  );
};

const _getCompressionType = (filenameOrBuffer, types) => {
  let result = COMPRESSION_TYPE.UNDEFINED;

  while (true) {
    let type = types.shift();
    if (type) {
      if (type.fun(filenameOrBuffer)) {
        result = type.format;
        break;
      }
    } else {
      break;
    }
  }
  return result;
};

const getFileCompressionType = (filename) => {
  return _getCompressionType(
    filename,
    [
      { fun: isGZFile, format: COMPRESSION_TYPE.GZIP },
    ]
  );
};

const getBufferCompressionType = (buffer) => {
  return _getCompressionType(
    buffer,
    [
      { fun: isGZBuffer, format: COMPRESSION_TYPE.GZIP },
    ]
  );
};

const getCompressionType = (filenameOrBuffer) => {
  return _getCompressionType(
    filenameOrBuffer,
    [
      { fun: isGZBuffer, format: COMPRESSION_TYPE.GZIP },
      { fun: isGZFile, format: COMPRESSION_TYPE.GZIP },
    ]
  );
};

module.exports = {
  isGZFile: isGZFile,
  isGZBuffer: isGZBuffer,
  getGZFileUncompressedSize: getGZFileUncompressedSize,
  getGZBufferUncompressedSize: getGZBufferUncompressedSize,

  getFileCompressionType: getFileCompressionType,
  getBufferCompressionType: getBufferCompressionType,
  getFileUncompressedSize: getFileUncompressedSize,
  getBufferUncompressedSize: getBufferUncompressedSize,

  getCompressionType: getCompressionType,
  getUncompressedSize: getUncompressedSize,

  ...COMPRESSION_TYPE,
};
