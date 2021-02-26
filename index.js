const fs = require("fs");
const http = require("http");

const getFileContent = (callback) => {
    fs.readFile("index.html", (err, data) => {
        if (err) throw err;
        callback(data.toString());
    })
}

http.createServer((req, res) => {
    getFileContent((data) => {
        res.end(data);
    })
}).listen(8000)