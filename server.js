const express = require('express');
const server = express();
const logger = require('morgan');
const userRouter = require('./users/userRouter.js')
const postRouter = require('./posts/postRouter.js')

server.use(express.json());
server.use(logger('combined'));
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

//custom middleware

server.get('/', (req, res) => {
  res.send(`<h2>IT LIVES!!!!!</h2>`)
});

module.exports  = server;
