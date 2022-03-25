const express = require('express');
const router = express.Router();
const Users = require('../../services/users');


/* DELETE user*/
router.post('/:id', async function (req, res, next) {
    try {
        res.json(await Users.DeleteUsers(req.params.id,req.body));
    } catch (err) {
      console.error(`Error while deleting user`, err.message);
      next(err);
    }
  });

module.exports = router;