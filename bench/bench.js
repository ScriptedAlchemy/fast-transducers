const Benchmark = require('benchmark');
const _ = require('lodash');
const u = require('underscore');
const t = require('../transducers');

const suite = Benchmark.Suite('transducers');

function addTen(x) { return x + 10; }
function double(x) { return x * 2; }
function even(x) { return x % 2 === 0; }
function multipleOfFive(x) { return x % 5 === 0; }

function baseline(arr) {
  const result = [];
  const length = arr.length;
  let entry;

  for (let i = 0; i < length; i++) {
    entry = double(addTen(arr[i]));
    if (multipleOfFive(entry) && even(entry)) {
      result.push(entry);
    }
  }

  return result;
}

function benchArray(n) {
  const arr = _.range(n);

  suite
    .add(` native (${n})`, () => {
      arr.map(addTen)
        .map(double)
        .filter(multipleOfFive)
        .filter(even);
    })
    .add(` baseline (${n})`, () => {
      baseline(arr);
    })
    .add(`_.map/filter (${n})`, () => {
      // not even going to use chaining, it's slower
      _.filter(
        _.filter(
          _.map(
            _.map(arr, addTen),
            double),
          multipleOfFive),
        even,
      );
    })
    .add(`_.map/filter, lazy (${n})`, () => {
      _(arr)
        .map(addTen)
        .map(double)
        .filter(multipleOfFive)
        .filter(even)
        .value();
    })
    .add(`u.map/filter (${n})`, () => {
      // not even going to use chaining, it's slower
      u.filter(
        u.filter(
          u.map(
            u.map(arr, addTen),
            double),
          multipleOfFive),
        even,
      );
    })
    .add(`t.map/filter+transduce (${n})`, () => {
      t.into([],
        t.compose(
          t.map(addTen),
          t.map(double),
          t.filter(multipleOfFive),
          t.filter(even),
        ),
        arr);
    });
}

for (let i = 500; i <= 530000; i += 20000) {
  benchArray(i);
}

let currentData = {};
function print() {
  process.stdout.write(`${currentData.size} `);
  currentData.cols.forEach((col, i) => {
    process.stdout.write(`${col} `);
  });
  console.log('');
}

suite.on('cycle', (event) => {
  const size = parseInt(event.target.name.match(/\((.*)\)/)[1]);
  if (currentData.size !== size) {
    if (currentData.size) {
      print();
    }
    currentData = { size, cols: [] };
  }

  currentData.cols.push(event.target.hz);
});

suite.on('complete', (event) => {
  print();
});

suite.run();
