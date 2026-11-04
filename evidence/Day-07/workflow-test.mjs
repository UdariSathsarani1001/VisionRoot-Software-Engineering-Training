/**
 * Workflow test — Day 07
 *
 * Runs against the live backend and verifies every status-transition rule.
 * Requires Node 18+ (built-in fetch).
 *
 * Usage:
 *   node evidence/Day-07/workflow-test.mjs
 *
 * Override the base URL:
 *   API_URL=http://localhost:4000/api node evidence/Day-07/workflow-test.mjs
 */

const API = process.env.API_URL ?? 'http://localhost:4000/api';
let passed = 0;
let failed = 0;

async function call(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, json: await res.json().catch(() => null) };
}

function check(name, actual, expected) {
  const ok = actual === expected;
  if (ok) {
    passed++;
  } else {
    failed++;
  }
  const symbol = ok ? '✓ PASS' : '✗ FAIL';
  console.log(`${symbol}  ${name}  (expected ${expected}, got ${actual})`);
}

function checkCode(name, json, expectedCode) {
  const actual = json?.error?.code ?? '(no code)';
  const ok = actual === expectedCode;
  if (ok) {
    passed++;
  } else {
    failed++;
  }
  const symbol = ok ? '✓ PASS' : '✗ FAIL';
  console.log(`${symbol}  ${name}  (expected code ${expectedCode}, got ${actual})`);
}

// ---------------------------------------------------------------------------

console.log(`\nRunning workflow tests against ${API}\n`);

// Step 1 — Create a new request
const createRes = await call('POST', '/requests', {
  title: 'Workflow test request',
  description: 'Created by workflow-test.mjs — safe to delete.',
  category: 'IT',
  priority: 'MEDIUM',
});
check('Step 1: POST /requests returns 201', createRes.status, 201);
check('Step 1: new request has status OPEN', createRes.json?.status, 'OPEN');

const id = createRes.json?.id;
if (!id) {
  console.error('\nCould not get request id from step 1 — aborting remaining steps.');
  process.exit(1);
}
console.log(`       Created request id: ${id}`);

// Step 2 — List requests; new request should appear
const listRes = await call('GET', '/requests');
check('Step 2: GET /requests returns 200', listRes.status, 200);
const found = Array.isArray(listRes.json) && listRes.json.some((r) => r.id === id);
check('Step 2: new request appears in list', found, true);

// Step 3 — Get by id
const getRes = await call('GET', `/requests/${id}`);
check('Step 3: GET /requests/:id returns 200', getRes.status, 200);
check('Step 3: correct id returned', getRes.json?.id, id);

// Step 4 — Valid transition: OPEN → IN_PROGRESS
const toInProgress = await call('PATCH', `/requests/${id}/status`, {
  status: 'IN_PROGRESS',
});
check('Step 4: PATCH to IN_PROGRESS returns 200', toInProgress.status, 200);
check('Step 4: status is now IN_PROGRESS', toInProgress.json?.status, 'IN_PROGRESS');

// Step 5 — Invalid skip: IN_PROGRESS → CLOSED (skips RESOLVED)
const skipClosed = await call('PATCH', `/requests/${id}/status`, {
  status: 'CLOSED',
});
check('Step 5: PATCH to CLOSED (skip) returns 400', skipClosed.status, 400);
checkCode('Step 5: error code is INVALID_TRANSITION', skipClosed.json, 'INVALID_TRANSITION');

// Step 6 — Valid transition: IN_PROGRESS → RESOLVED
const toResolved = await call('PATCH', `/requests/${id}/status`, {
  status: 'RESOLVED',
});
check('Step 6: PATCH to RESOLVED returns 200', toResolved.status, 200);
check('Step 6: status is now RESOLVED', toResolved.json?.status, 'RESOLVED');

// Step 7 — Valid transition: RESOLVED → CLOSED
const toClosed = await call('PATCH', `/requests/${id}/status`, {
  status: 'CLOSED',
});
check('Step 7: PATCH to CLOSED returns 200', toClosed.status, 200);
check('Step 7: status is now CLOSED', toClosed.json?.status, 'CLOSED');

// Step 8 — Reverse attempt: CLOSED → OPEN
const reverseOpen = await call('PATCH', `/requests/${id}/status`, {
  status: 'OPEN',
});
check('Step 8: PATCH to OPEN (reverse) returns 400', reverseOpen.status, 400);
checkCode('Step 8: error code is INVALID_TRANSITION', reverseOpen.json, 'INVALID_TRANSITION');

// Step 9 — Invalid status value
const invalidStatus = await call('PATCH', `/requests/${id}/status`, {
  status: 'DONE',
});
check('Step 9: PATCH with status "DONE" returns 400', invalidStatus.status, 400);
checkCode('Step 9: error code is VALIDATION_ERROR', invalidStatus.json, 'VALIDATION_ERROR');

// Step 10 — Non-existent request
const notFound = await call('PATCH', '/requests/999999/status', {
  status: 'IN_PROGRESS',
});
check('Step 10: PATCH on unknown id returns 404', notFound.status, 404);
checkCode('Step 10: error code is NOT_FOUND', notFound.json, 'NOT_FOUND');

// ---------------------------------------------------------------------------

console.log(`\n─────────────────────────────────────────`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`─────────────────────────────────────────\n`);

process.exit(failed > 0 ? 1 : 0);
