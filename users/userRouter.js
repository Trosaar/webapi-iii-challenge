const express = require('express');

const router = express.Router();

const db = require('./userDb.js');
const postDb = require('../posts/postDb.js')

// When the client makes a `POST` request to `/api/users`:
router.post('/', validateUser, async (req, res) => {
  //datatype
  //status code
  //responce

  const { name } = req.body;

  try{
    const user = await db.insert({name})
    res.status(201).json(user)
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: 'There was an error while saving the user to the database' })
  }
});

// When the client makes a `POST` request to `/api/users/:id/posts`:
router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  const { text } = req.body;
  const { id } = req.params

  try{
    const newPost = await postDb.insert({text, user_id: id});
    res.status(201).json(newPost);
  } catch(err){
    res.status(500).json({ message: "Error making post"})
  }
});

// When the client makes a `GET` request to `/api/users`:
router.get('/', async (req, res) => {
  try {
    const users = await db.get();
    res.status(200).json(users);
  } catch(err) {
    res.status(500).json({ error: 'Cannot retrieve'})
  }
});

// When the client makes a `GET` request to `/api/users/:id`:
router.get('/:id', validateUserId, async (req, res) => {
  const { id } = req.params
  try {
    res.status(200).json(req.user);
  } catch(err) {
    res.status(500).json({ error: 'Cannot retrieve'})
  }

});

// When the client makes a `GET` request to `/api/users/:id/posts`:
router.get('/:id/posts', validateUserId, async (req, res) => {
  const { id } = req.params
  try {
    const users = await db.getUserPosts(id);
    res.status(200).json(users);
  } catch(err) {
    res.status(500).json({ error: 'Cannot retrieve'})
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  const { id } = req.params
  try {
    const deletedUser = await db.remove(id);
    res.status(200).json({ deletedUser });
  } catch(err) {
    res.status(500).json({ error: "The user could not be removed" })
  }
});

// When the client makes a `PUT` request to `/api/users/:id`:
router.put('/:id', validateUserId, async (req, res) => {
  const { id } = req.params
  const { text } = req.body;

  try {
    const updatedUser = await db.update(id, { text });
    res.status(200).json(updatedUser);
  } catch(err) {
    res.status(500).json({ error: "The user information could not be modified." })
  }
});

//custom middleware
function validateUserId(req, res, next) {
  const { id } = req.params;

  db.getById(id)
    .then( user => {
      if(user){
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: "server error!", err})
    })
};

function validateUser(req, res, next) {
  if(!req.body) {
    res.status(400).json({ message: "missing user data" })
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" })
  } else {
    next()
  }
};

function validatePost(req, res, next) {
  if( !req.body) {
    res.status(400).json({ message: "missing post data" })
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next()
  }
};

module.exports = router;
