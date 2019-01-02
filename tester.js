const t = require('./transducers');
const theArray = ["hello", "how are you", "how are you", "how are you", "how are you", "how are you"];

// console.log(theArray.map(function(item,index){
// console.log('client',this)
//   return item
// }));

//
// theArray.reduce((accumulator, currentVal) => {
//   Object.assign(accumulator, {currentVal})
// }, {})

t.reduce(theArray,function (item,acc) {
  console.log(item,acc)
  return acc
},{})
