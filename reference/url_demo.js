const url = require('url'); 

const myUrl = new URL('http://mywebsite.com:800/hello.html?id=100&status=active');

//serialised 
console.log(myUrl.href);
console.log(myUrl.toString());
//Host
console.log(myUrl.host);
//Host name - no port
console.log(myUrl.hostname);
//Path name
console.log(myUrl.pathname);
//query
console.log(myUrl.search);
//get params object
console.log(myUrl.searchParams);
//add param
myUrl.searchParams.append('abc', '123'); 
console.log(myUrl.searchParams);
//loop thru params
//for each takes a function 
myUrl.searchParams.forEach((value, name) => console.log(name, value));

