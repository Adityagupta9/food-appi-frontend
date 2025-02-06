let a = 1;  
let b = 2;  

console.log(a & b);  
console.log(a | b);  
console.log(a ^ b);  
console.log(~a);     

console.log(a << 1); 
console.log(a >> 1); 
console.log(a >>> 1); 

if(a%2==0){
  console.log("Even",a)
}
else{
  console.log("odd",a)
}
function fu(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
      let fl = true;
      for (let j = 0; j < arr.length; j++) {
          if (i !== j && arr[i] === arr[j]) {
              fl = false;
              break;
          }
      }

      if (fl) {
          result.push(arr[i]);
      }
  }

  return result;
}
let arr = [4, 5, 6, 4, 7, 8, 5, 8];
console.log(fu(arr));
