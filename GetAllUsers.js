const express = require('express');
const router = express.Router();
const Users = require('../../services/users');

/* GET All Users*/
router.post('/', async function(req, res, next) {
  try {
      res.json(await Users.GetAllUsers(req.query.page,req.query.size,req.body));
  } catch (err) {
    console.error(`Error while getting users `, err.message);
    next(err);
  }
});

module.exports = router;