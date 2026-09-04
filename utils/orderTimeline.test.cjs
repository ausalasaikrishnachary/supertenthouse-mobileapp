const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const ts = require('typescript');
const path = require('path');
const output = ts.transpileModule(fs.readFileSync(path.join(__dirname, 'orderTimeline.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const loaded = { exports: {} }; new Function('exports', output)(loaded.exports);
const { orderTimeline } = loaded.exports;
test('Approved never marks Processing or Completed as reached, even without dates', () => {
  const steps = orderTimeline(' Approved ');
  assert.equal(steps[1].isCurrent, true);
  assert.equal(steps[0].isDone, true);
  assert.equal(steps[2].isDone, false);
  assert.equal(steps[3].isDone, false);
});
test('every normal status reaches exactly its own position', () => {
  ['pending', 'approved', 'processing', 'completed'].forEach((status, index) => {
    const steps = orderTimeline(status, '2026-09-04', '2026-09-05');
    assert.equal(steps.filter(step => step.isDone).length, index + 1);
    assert.equal(steps.filter(step => step.isCurrent).length, 1);
  });
});
test('cancelled and rejected are explicit and never imply completion', () => {
  for (const status of ['cancelled', 'rejected']) {
    const steps = orderTimeline(status);
    assert.equal(steps.at(-1).label.toLowerCase(), status);
    assert.equal(steps.find(step => step.status === 'completed').isDone, false);
  }
});
test('timestamps do not invent progress or historical stage dates', () => {
  assert.equal(orderTimeline('unknown', '2026-01-01', '2026-01-02').some(step => step.isDone), false);
  const steps = orderTimeline('completed', '2026-01-01', '2026-01-02');
  assert.equal(steps[1].date, null); assert.equal(steps[2].date, null);
});
