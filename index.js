const https = require('https'); 
const path = require('path');
const fs  = require('fs'); 
const express = require('express'); 

const app = express(); 
const options = {
    key: fs.readFileSync('/Users/Nisal/server.key'),
    cert: fs.readFileSync('/Users/Nisal/server.crt')
  };

app.use(express.static('.'))

const server = https.createServer(options, app);
const PORT = process.env.PORT || 5000; 

server.listen(PORT, () => console.log("Server running on port " + PORT)); 