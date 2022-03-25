const express = require('express');
const router = express.Router();
const Users = require('../../services/Users');


//update user
router.post('/:id', async function(req, res, next) {
    try {
      res.json(await Users.UpdateUser(req.params.id, req.body));
    } catch (err) {
      console.error(`Error while updating user`, err.message);
      next(err);
    }
  });

  module.exports = router;