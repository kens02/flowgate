"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var assert = __importStar(require("assert"));
var route_1 = require("./src/app/api/requests/route");
console.log('--- Running Tests ---');
try {
    console.log('Test 1: should return initial requests');
    var reqs = (0, route_1.getRequests)();
    assert.ok(reqs.length > 0, 'Requests array should not be empty');
    assert.strictEqual(reqs[0].id, "1", 'First request ID should be 1');
    assert.strictEqual(reqs[0].status, "Submitted", 'First request status should be Submitted');
    console.log('✅ Test 1 Passed\n');
    console.log('Test 2: should update request status');
    (0, route_1.updateRequestStatus)("1", "InReview");
    assert.strictEqual((0, route_1.getRequests)()[0].status, "InReview", 'Status should be updated to InReview');
    (0, route_1.updateRequestStatus)("1", "Approved");
    assert.strictEqual((0, route_1.getRequests)()[0].status, "Approved", 'Status should be updated to Approved');
    console.log('✅ Test 2 Passed\n');
    console.log('🎉 All tests passed successfully!');
}
catch (error) {
    console.error('❌ Test failed:');
    console.error(error);
    process.exit(1);
}
