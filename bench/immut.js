const Benchmark = require('benchmark');
const Immutable = require('immutable');
const t = require('../transducers');

const suite = Benchmark.Suite('transducers');

function benchArray(n) {
  const arr = new Immutable.Range(0, n).toVector();

  suite
    .add(`Immutable map/filter (${n})`, () => {
      arr.map(x => x + 10)
        .map(x => x * 2)
        .filter(x => x % 5 === 0)
        .filter(x => x % 2 === 0)
        .toVector();
    })
    .add(`transducer map/filter (${n})`, () => {
      Immutable.Vector.from(
        t.seq(arr,
          t.compose(
            t.map(x => x + 10),
            t.map(x => x * 2),
            t.filter(x => x % 5 === 0),
            t.filter(x => x % 2 === 0))),
      );
    });
}

benchArray(1000);
benchArray(100000);

suite.on('cycle', (event) => {
  console.log(String(event.target));
});

suite.run();
