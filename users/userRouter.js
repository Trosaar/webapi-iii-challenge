const express = require('express');

const router = express.Router();

const db = require('./userDb.js');

// When the client makes a `POST` request to `/api/users`:
router.post('/', validateUser, async (req, res) => {
  //datatype
  //status code
  //responce

  const { name } = req.body;

  try{
    const user = await db.insert(name)
    res.status(201).json({user})
  } catch(err) {
    res.status(500).json({ message: 'There was an error while saving the user to the database' })
  }
});

// When the client makes a `POST` request to `/api/users/:id/posts`:
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {

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

router.get('/:id', validateUserId, (req, res) => {

});

router.get('/:id/posts', validateUserId, (req, res) => {

});

router.delete('/:id', validateUserId, (req, res) => {

});

router.put('/:id', validateUserId, (req, res) => {

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
