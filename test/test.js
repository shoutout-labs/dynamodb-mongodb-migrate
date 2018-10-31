var assert = require('assert');
var MigrationJob = require('../src/MigrationJob');

describe('Object', function() {
  describe('MigrationJob', function() {
    it('should be a type of function', function() {
      assert.equal(typeof MigrationJob, 'function');
    });
  });
});