const express = require('express');
const router = express.Router();
const Users = require('../../services/Users');


//add a new user

router.post('/', async function(req, res, next) {
    try {
        res.json(await Users.AddUsers(req.body));
    } catch (err) {
      console.error(`Error while creating user`, err.message);
      next(err);
    }
  });

  module.exports = router;