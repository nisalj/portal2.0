const http = require('http'); 
const path = require('path');
const fs  = require('fs'); 

// const options = {
//     key: fs.readFileSync('/Users/Nisal/server.key'),
//     cert: fs.readFileSync('/Users/Nisal/server.crt')
//   };


const server = http.createServer( (req, res) => {
// if(req.url === '/') {

//     fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
//         if (err) throw err; 
//         res.writeHead(200, {'Content-Type': 'text/html'})
//         res.end(content);
//     });
   

// }

// if(req.url === '/planning') {

//     fs.readFile(path.join(__dirname, 'planning.html'), (err, content) => {
//         if (err) throw err; 
//         res.writeHead(200, {'Content-Type': 'text/html'})
//         res.end(content);
//     });
   let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url); 
   console.log(filePath);

   let extname = path.extname(filePath);
   let contentType = 'text/html'; 

   switch(extname) {
       case '.js':
            contentType = 'text/javascript';
            break; 
        case '.css':
            contentType = 'text/css'; 
            break;
        case '.json':
            contentType = 'application/json'; 
            break;
        case '.png':
            contentType = 'image/png'; 
            break;
        case '.jpg':
            contentType = 'image/jpg'; 
            break;
   }
   fs.readFile(filePath, (err, content) => {
       if(err) {
           if(err.code == 'ENOENT') {
               //Page not found 
               fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(content, 'utf8'); 
               })
           } else {
               //some server error
               res.writeHead(500);
               res.end("server error" + err.code); 
           }
        } else {
            res.writeHead(200, {'Content-Type': contentType})
            res.end(content, 'utf8'); 
        }

   })

//}
});

const PORT = process.env.PORT || 5000; 

server.listen(PORT, () => console.log("Server running on port " + PORT)); 