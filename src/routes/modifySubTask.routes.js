const express = require('express');
const router = express.Router();
const SousTaches = require('../controllers/sous_taches.controller');

router.post('/sousTache', (req, res) => {
    SousTaches.addSousTache(req, res);
});

router.delete('/sousTache/:id', (req, res) => {
    SousTaches.removeSousTache(req, res);
});

router.put('/sousTache/:id', (req, res) => {
    SousTaches.updateSousTache(req, res);
});

router.patch('/sousTache/:id', (req, res) => {
    SousTaches.updateSousTacheComplete(req, res);
});

module.exports = router;