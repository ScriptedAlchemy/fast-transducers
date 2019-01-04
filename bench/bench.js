var Benchmark = require('benchmark');
var t = require('../transducers');
var _ = require('lodash');
var u = require('underscore');
var suite = Benchmark.Suite('transducers');

function addTen(x) {
  return x + 10;
}

function double(x) {
  return x * 2;
}

function even(x) {
  return x % 2 === 0;
}

function multipleOfFive(x) {
  return x % 5 === 0;
}

function baseline(arr) {
  var result = [];
  var length = arr.length;
  var entry;

  for (var i = 0; i < length; i++) {
    entry = double(addTen(arr[i]));
    if (multipleOfFive(entry) && even(entry)) {
      result.push(entry);
    }
  }

  return result;
}

function benchArray(n) {
  var arr = _.range(n);

  suite
    .add(' native (' + n + ')', function () {
      arr.map(addTen)
        .map(double)
        .filter(multipleOfFive)
        .filter(even);
    })
    .add(' baseline (' + n + ')', function () {
      baseline(arr);
    })
    .add('_.map/filter (' + n + ')', function () {
      // not even going to use chaining, it's slower
      _.filter(
        _.filter(
          _.map(
            _.map(arr, addTen),
            double),
          multipleOfFive),
        even
      );
    })
    .add('_.map/filter, lazy (' + n + ')', function () {
      _(arr)
        .map(addTen)
        .map(double)
        .filter(multipleOfFive)
        .filter(even)
        .value();
    })
    .add('u.map/filter (' + n + ')', function () {
      // not even going to use chaining, it's slower
      u.filter(
        u.filter(
          u.map(
            u.map(arr, addTen),
            double),
          multipleOfFive),
        even
      );
    })
    .add('t.map/filter+transduce (' + n + ')', function () {
      t.into([],
        t.compose(
          t.map(addTen),
          t.map(double),
          t.filter(multipleOfFive),
          t.filter(even)
        ),
        arr);
    })
}

for (var i = 500; i <= 50000; i += 500) {
  benchArray(i);
}

var currentData = {};

function print() {
  process.stdout.write(currentData.size + ' ');
  currentData.cols.forEach(function (col, i) {
    // process.stdout.write('# of items Iterated' + col + ' ' + '\n');
  });
  console.log('');
}

suite.on('cycle', function (event) {
  var size = parseInt(event.target.name.match(/\((.*)\)/)[1]);
  if (currentData.size !== size) {
    if (currentData.size) {
      console.log('^^Processed Array size of', currentData.size + '\n');
    }
    currentData = {size: size, cols: []};
  }

  console.log(event.target.name + ' = opsPerSec: ' + event.target.hz);
  currentData.cols.push(event.target.name + ' = opsPerSec: ' + event.target.hz)
});

suite.on('complete', function (event) {
  var self = this;

  Object.keys(self).map(function (value) {
    var result = self[value]
    if (!result.name) return
    console.log(result.name, result.hz + 'ops/s', result.cycles + ' cycles')
    console.log('###################')
  })
});

suite.run({ 'async': true });
