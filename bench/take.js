const Benchmark = require('benchmark');
const _ = require('lodash');
const u = require('underscore');
const t = require('../transducers');

const suite = Benchmark.Suite('transducers');

function double(x) { return x * 2; }

function multipleOfFive(x) { return x % 5 === 0; }

function baseline(arr, limit) {
  const result = new Array(limit);
  var entry;
  let count = 0;
  let index = 0;
  const length = arr.length;

  while (count < limit && index < length) {
    var entry = double(arr[index]);

    if (multipleOfFive(entry)) {
      result[count] = entry;
      count++;
    }

    index++;
  }

  if (limit !== count) {
    result.length = count;
  }

  return result;
}

function benchArray(n) {
  const arr = _.range(n);

  suite
    .add(` (n=${n}) hand-rolled baseline`, () => {
      baseline(arr, 20);
    })
    .add(` (n=${n}) native`, () => {
      arr
        .map(double)
        .filter(multipleOfFive)
        .slice(0, 20);
    })
    .add(` (n=${n}) _.map/filter`, () => {
      _(arr)
        .map(double)
        .filter(multipleOfFive)
        .take(20)
        .value();
    })
    .add(` (n=${n}) t.map/filter+transduce`, () => {
      t.seq(arr,
        t.compose(
          t.map(double),
          t.filter(multipleOfFive),
          t.take(20),
        ));
    });
}

[1, 2, 10, 50, 100, 1000, 10000, 100000].forEach((n) => {
  benchArray(n);
});

suite.on('cycle', (event) => {
  console.log(String(event.target));
});

suite.run();
