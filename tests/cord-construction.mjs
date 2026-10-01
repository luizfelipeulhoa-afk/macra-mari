import assert from 'node:assert/strict';
import { cordAssembly, constructionChapter } from '../src/lib/cordConstruction.ts';

for (let strand = 0; strand < 6; strand++) {
  for (const along of [0, .25, .5, .75, 1]) {
    assert.equal(cordAssembly(0, along, strand), 0, 'Start with unassembled cords');
    assert.equal(cordAssembly(1, along, strand), 1, 'Every cord must finish');
    let previous = 0;
    for (let step = 0; step <= 1000; step++) {
      const value = cordAssembly(step / 1000, along, strand);
      assert(Number.isFinite(value) && value >= previous && value <= 1);
      assert(value - previous < .004, 'No abrupt assembly jumps');
      previous = value;
    }
    for (const progress of [.2, .4, .6, .8]) {
      assert(cordAssembly(progress, along, strand) >= cordAssembly(progress, along + .05, strand), 'The cord closes from its head toward its tail');
    }
    const opening = .18 + along * .28 + strand * .012;
    for (const boundary of [opening, opening + .38]) {
      const epsilon = .000001;
      const left = (cordAssembly(boundary, along, strand) - cordAssembly(boundary - epsilon, along, strand)) / epsilon;
      const right = (cordAssembly(boundary + epsilon, along, strand) - cordAssembly(boundary, along, strand)) / epsilon;
      assert(Math.abs(left - right) < .001, 'Start and stop without velocity discontinuities');
    }
  }
}
assert.deepEqual([0, .3, .6, 1].map(constructionChapter), [0, 1, 2, 3]);
console.log('PASS: every strand finishes, progressive assembly, continuous motion, chapter order.');
