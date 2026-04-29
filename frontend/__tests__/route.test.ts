import { getRequests, updateRequestStatus } from '../src/app/api/requests/route';

describe('Requests API Mock logic', () => {
  it('should return initial requests', () => {
    const reqs = getRequests();
    expect(reqs.length).toBeGreaterThan(0);
    expect(reqs[0].id).toBe("1");
    expect(reqs[0].status).toBe("Submitted");
  });

  it('should update request status', () => {
    updateRequestStatus("1", "InReview");
    const reqs = getRequests();
    expect(reqs[0].status).toBe("InReview");
    
    updateRequestStatus("1", "Approved");
    expect(reqs[0].status).toBe("Approved");
  });
});
