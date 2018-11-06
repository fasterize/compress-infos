const assert = require('assert');

module.exports = {
  assertTrue: (condition) => assert((condition) === true),
  assertFalse: (condition) => assert((condition) === false),
  assertEqual: (actual, expected) => assert.equal(actual, expected),
  assertNotEqual: (actual, expected) => assert.notEqual(actual, expected),

  run: (tests) => {
    let testsCount = 0;
    let errors = [];
    let count = 1;

    Object.keys(tests).forEach((fun) => {
      testsCount += 1;
      try {
        tests[fun]();
        process.stdout.write('.');
      } catch (error) {
        process.stdout.write('F');
        errors.push({
          fun: fun,
          expected: error.expected,
          actual: error.actual,
          stacktrace: error.stack,
        });
      }
    });

    process.stdout.write(`\n\nTests: ${testsCount - errors.length}/${testsCount}, errors: ${errors.length}\n\n`);
    errors.forEach((error) => {
      process.stdout.write(`${count++}) ${error.fun} FAILED!\n`);
      process.stdout.write(`   expected: ${error.expected}, actual: ${error.actual}\n`);
      error.stacktrace.split(/\r?\n/).forEach((stackLine) => {
        process.stdout.write(`   ${stackLine}\n`);
      });
      process.stdout.write('\n');
    });

    if (errors.length > 0) { process.exit(errors.length); }
  },
};
