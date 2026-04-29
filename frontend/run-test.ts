import * as assert from 'assert';
import { getRequests, updateRequestStatus } from './src/app/api/requests/route';

console.log('--- Running Tests ---');

try {
  console.log('Test 1: should return initial requests');
  const reqs = getRequests();
  assert.ok(reqs.length > 0, 'Requests array should not be empty');
  assert.strictEqual(reqs[0].id, "1", 'First request ID should be 1');
  assert.strictEqual(reqs[0].status, "Submitted", 'First request status should be Submitted');
  console.log('✅ Test 1 Passed\n');

  console.log('Test 2: should update request status');
  updateRequestStatus("1", "InReview");
  assert.strictEqual(getRequests()[0].status, "InReview", 'Status should be updated to InReview');
  
  updateRequestStatus("1", "Approved");
  assert.strictEqual(getRequests()[0].status, "Approved", 'Status should be updated to Approved');
  console.log('✅ Test 2 Passed\n');

  console.log('🎉 All tests passed successfully!');
} catch (error) {
  console.error('❌ Test failed:');
  console.error(error);
  process.exit(1);
}
