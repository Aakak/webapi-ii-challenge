const express = require('express');

const postRouter = require('./expressRouter/posts-router.js/index.js.js');

const server = express();

server.use(express.json());

server.get('/', (req,res) => {
    res.send(`<h2>Routing with Express</h2>`)

});

server.use('/api/posts', postRouter);

server.listen(3000, () => console.log("\n=== API server on 3000  ===\n"));