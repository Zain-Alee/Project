const express = require('express');
const router = express.Router();
const Users = require('../../services/users');

/* Search User by keyword */
router.post('/', async function(req, res, next) {
  try {
    res.json(await Users.SearchUsers(req.query.keyword,req.body));
  } catch (err) {
    console.error(`Error while searching user `, err.message);
    next(err);
  }
});

module.exports = router;