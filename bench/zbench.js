const Benchmark = require('benchmark');
const Lazy = require('lazy.js');
const _ = require('lodash');
const R = require('ramda');
const tdash = require('transducers-js');
const tdot = require('../transducers');
const { chainFrom, rangeIterator } = require('transducist/cjs');

const double = x => x * 2;
const notFiveMultiple = x => x % 5 !== 0;
const inc = x => x + 1;
const isThreeMultiple = x => x % 3 === 0;

const arg = Number(process.argv[2]);
if (!isNaN(arg)) {
  runBenchmark(arg);
} else {
  [10, 100, 200, 250, 300, 400, 600, 1000, 2000, 5000].forEach((n) => {
    runBenchmark(n);
    console.log('');
  });
}

function orderKeys(obj, expected) {
  const keys = Object.keys(obj).sort((k1, k2) => {
    if (k1 < k2) return -1;
    else if (k1 > k2) return +1;
    return 0;
  });

  let i,
    after = {};
  for (i = 0; i < keys.length; i++) {
    after[keys[i]] = obj[keys[i]];
    delete obj[keys[i]];
  }

  for (i = 0; i < keys.length; i++) {
    obj[keys[i]] = after[keys[i]];
  }
  return obj;
}

function runBenchmark(n) {
  const final = {};
  console.log(`Running benchmark for n = ${n}`);
  console.log('---------------------------------');

  const arr = Array.from(rangeIterator(n));

  new Benchmark.Suite({
    teardown: console.log,
  })
    // .add('transducist', () => {
    //   chainFrom(arr)
    //     .map(double)
    //     .filter(notFiveMultiple)
    //     .map(inc)
    //     .filter(isThreeMultiple)
    //     .toArray();
    // })
    // .add('lodash (without chain)', () => {
    //   let result = arr;
    //   result = _.map(result, double);
    //   result = _.filter(result, notFiveMultiple);
    //   result = _.map(result, inc);
    //   result = _.filter(result, isThreeMultiple);
    // })
    // .add('lodash (with chain)', () => {
    //   _(arr)
    //     .map(double)
    //     .filter(notFiveMultiple)
    //     .map(inc)
    //     .filter(isThreeMultiple)
    //     .value();
    // })
    // .add('ramda', () => {
    //   R.pipe(
    //     R.map(double),
    //     // @ts-ignore
    //     R.filter(notFiveMultiple),
    //     R.map(inc),
    //     R.filter(isThreeMultiple),
    //     R.take(10),
    //   )(arr);
    // })
    // .add('lazy.js', () => {
    //   Lazy(arr)
    //     .map(double)
    //     .filter(notFiveMultiple)
    //     .map(inc)
    //     .filter(isThreeMultiple)
    //     .toArray();
    // })
    .add('transducers.js', () => {
      const transform = tdot.compose(
        tdot.map(double),
        tdot.filter(notFiveMultiple),
        tdot.map(inc),
        tdot.filter(isThreeMultiple),
      );
      tdot.into([], transform, arr);
    })
    .add('transducers-js', () => {
      const transform = tdash.comp(
        tdash.map(double),
        tdash.filter(notFiveMultiple),
        tdash.map(inc),
        tdash.filter(isThreeMultiple),
      );
      tdash.into([], transform, arr);
    })
    .add('native array methods', () => {
      arr.map(double)
        .filter(notFiveMultiple)
        .map(inc)
        .filter(isThreeMultiple);
    })
    .add('hand-optimized loop', () => {
      const result = [];
      for (let i = 0, { length } = arr; i < length; i++) {
        const x1 = 2 * arr[i];
        if (x1 % 5 !== 0) {
          const x2 = x1 + 1;
          if (x2 % 3 === 0) {
            result.push(x2);
          }
        }
      }
    })
    .on('cycle', (event) => {
      Object.assign(final, { [Math.ceil(event.target.hz)]: String(event.target) });
    })
    .on('complete', (event) => {
      console.log('##slowest##');
      console.log(orderKeys(final));
      console.log('##fastest##');
    })
    .run({ async: false });
}
