const express = require('express');

const router = express.Router();

const postDb = require('../posts/postDb.js')

router.get('/', async (req, res) => {
  try {
    const users = await postDb.get();
    res.status(200).json(users);
  } catch(err) {
    res.status(500).json({ error: 'Cannot retrieve'})
  }
});

router.get('/:id', validatePostId, async (req, res) => {
  const { id } = req.params
  try {
    res.status(200).json(req.post);
  } catch(err) {
    res.status(500).json({ error: 'Cannot retrieve'})
  }
});

router.delete('/:id', validatePostId, async (req, res) => {
  const { id } = req.params
  try {
    const deletedPost = await postDb.remove(id);
    res.status(200).json({ deletedPost });
  } catch(err) {
    res.status(500).json({ error: "The Post could not be removed" })
  }
});

router.put('/:id', validatePostId, async (req, res) => {
  const { id } = req.params
  const { text } = req.body;

  try {
    const updatedPost = await postDb.update(id, { text });
    res.status(200).json(updatedPost);
  } catch(err) {
    res.status(500).json({ error: "The Post information could not be modified." })
  }
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;

  postDb.getById(id)
    .then( post => {
      if(post){
        req.post = post;
        next();
      } else {
        res.status(400).json({ message: "invalid post id" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: "server error!", err})
    })

};

module.exports = router;
