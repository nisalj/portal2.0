const fs = require('fs'); 

let data = {lat: 2, long: 3, test1: 56, test2: 6, test10: 44}; 
let arr = Object.values(data); 


let helper = function() {
    let string = ''; 
    for (let i = 0; i < arr.length; i++) {
    if (i == arr.length-1) 
    string += `${arr[i]}\r\n`;
    else 
    string += `${arr[i]}, `;
    }  
    return string;  
 
}


fs.appendFile('latlong3.csv', helper(), (err) => {
console.log('done');
});

//console.log(helper()); 

// for (let i = 0; i < arr.length; i++) {
 

//     if (i == arr.length-1) {
//         fs.appendFileSync('latlong2.csv', `${arr[i]}\r\n`, (err) => {
//             if(err)
//             console.log(err);
//             console.log('done');
        
//         })
//     } else {
//         fs.appendFileSync('latlong2.csv', `${arr[i]}, `, (err) => {
//             if(err)
//             console.log(err);
//             console.log('done');
//         })
    
//     }  
// }



// fs.appendFile('latlong1.csv', `${data.lat}, ${data.long}\n`, (err) => {
//     console.log(err);
//     console.log('done');
// })





