const express = require('express');
const router = express.Router();
const Users = require('../../services/Users');

/* GET user  by id  */
router.post('/:id', async function(req, res, next) {
  try {
      res.json(await Users.GetUsersById(req.params.id,req.body));
  } catch (err) {
      console.error(`Error while getting ConsultantAreas `, err.message);
    next(err);
  }
});

module.exports = router;