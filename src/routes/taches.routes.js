const express = require('express');
const router = express.Router();
const Taches = require('../controllers/taches.controller')

router.get('/taches', (req, res) => {
    Taches.getTaches(req, res);
});

router.get('/tache/:id', (req, res) => {
    Taches.getTache(req, res);
});

module.exports = router;
