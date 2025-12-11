const express = require("express");
const path = require("path");
const server = express();

// web stuff
server.use(express.static(path.join(__dirname, 'website')));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'website', 'webpage.html'));
});

server.all("/", (req, res) => {
  res.send("Web Server Is Running");
});

function keepAlive() {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is ready on port ${PORT}`);
  });
}

module.exports = keepAlive;
