const http = require('http');
var jwt = require("jsonwebtoken");

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
var token = jwt.sign({ foo: "bar" }, "shhhhh");
console.log(token)
let verified = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1Mzk2NDA0MzV9.HJJXRMw_u-tg47c4VhaPVSEZ8LNu38mWrS4VDKjBlzgsqeewqwe", "shhhhh");
console.log(verified)