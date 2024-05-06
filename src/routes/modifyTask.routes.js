const express = require('express');
const router = express.Router();
const Taches = require('../controllers/taches.controller')

router.post('/tache', (req, res) => {
    Taches.addTache(req, res);
});

router.delete('/tache/:id', (req, res) => {
    Taches.removeTache(req, res);
});

router.put('/tache/:id', (req, res) => {
    Taches.updateTache(req, res);
});

router.patch('/tache/:id', (req, res) => {
    Taches.updateTacheComplete(req, res);
});

module.exports = router;
