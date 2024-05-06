const express = require('express');
const router = express.Router();
const User = require('../controllers/user.controller');

router.post('/user', (req, res) => {
    User.addUser(req, res);
});

router.patch('/apiKey', (req, res) => {
    User.newApiKey(req, res);
});

module.exports = router;
