const {reduce} = require('./transducers');
const theArray = ["hello", "how are you", "how are you", "how are you", "how are you", "how are you"];

// console.log(theArray.map(function(item,index){
// console.log('client',this)
//   return item
// }));


reduce(theArray,function (item,acc) {
  console.log('RESULT',item,acc)

  return acc
},{})

// console.log(t.reduce.toString());
