const Taches = require("../models/taches.model");
const SousTaches = require("../models/sous_taches.model");
const Utilisateur = require("../models/utilisateur.model");

exports.getTache = async (req, res) => {
    var tache_id = req.params.id;

    if(!tache_id || parseInt(tache_id) <= 0){
        res.status(400);
        res.send({
            message: "L'id de la tâche est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    var sous_taches = await SousTaches.getSousTaches(tache_id);
    
    Taches.getTache(tache_id)
    .then((tache) => {
        if (!tache) {
            res.status(404).send({"erreur": `Tâche introuvable avec l'id ${tache_id}`});
            return;
        }

        res.send({
            "tache": [tache]
        });
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            "erreur": `Echec lors de la récupération de la tâche avec l'id ${tache_id}`
        });
    });
};

exports.getTaches = (req, res) => {
    let cle_api = req.headers.authorization;
    let all = req.query.all;

    if (!all) {
        all = 0;
    }

    Utilisateur.getUser(cle_api)
    .then((user) => {
        return Taches.getTaches(user.id, all);
    })
    .then((taches) => {
        res.send({
            "tache": taches
        });
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).send({
            "erreur": `Echec lors de la récupération des tâches de l'utilisateur ${user_id}`
        });
    });
};

exports.addTache = (req, res) => {
    var cle_api = req.headers.authorization;
    var titre = req.body.titre;
    var description = req.body.description;
    var date_debut = req.body.date_debut;
    var date_echeance = req.body.date_echeance;
    var complete = req.body.complete;

    if (verifyQueryInsertTache(res,titre,description,date_debut,date_echeance,complete)) {
        Utilisateur.getUser(cle_api)
        .then((user) => {
            return Taches.addTache(user.id,titre,description,date_debut,date_echeance,complete);
        })
        .then((tache) => {
            res.send({
                "message": `La tâche: ${titre}, a été ajouter avec succès.`,
            });
        });
    }
};

function verifyQueryInsertTache(res,titre,description,date_debut,date_echeance,complete) {
    let messageRequis = "Les champs suivants sont requis: ";

    if (titre === undefined) {
        messageRequis += "titre ";
    }

    if (description === undefined) {
        messageRequis += "description ";
    }

    if (date_debut === undefined) {
        messageRequis += "date_debut ";
    }

    if (date_echeance === undefined) {
        messageRequis += "date_echeance ";
    }

    if (complete === undefined) {
        messageRequis += "complete ";
    }

    if (messageRequis != "Les champs suivants sont requis: ") {
        res.status(405).send({
            "message": messageRequis
        });
        return false;
    }
    else {
        return true;
    }
}

exports.removeTache = async (req, res) => {
    var cle_api = req.headers.authorization;
    var tache_id = req.params.id;

    if (tache_id === undefined || tache_id < 0) {
        res.status(405).send({
            "message": "Vous devez fournir l'id de la tâche à supprimer."
        });
        return;
    }

    var tache = await Taches.getTache(tache_id);
    var user = await Utilisateur.getUser(cle_api);
    
    if (tache === undefined) {
        res.status(404).send({"erreur": `Tâche introuvable avec l'id ${tache_id}`});
        return;
    }

    if (tache.utilisateur_id != user.id) {
        res.status(403).send({
            "message": "Vous n'avez pas les droits de supprimer une tâche qui ne vous appartient pas."
        });
    }
    else {
        Taches.removeTache(tache_id)
        .then((tache) => {
            res.send({
                "message": `La tâche avec l'id: ${tache_id}, a été supprimer avec succès.`,
            });
        });
    }
};

exports.updateTache = async (req, res) => {
    var cle_api = req.headers.authorization;
    var tache_id = req.params.id;

    var titre = req.body.titre;
    var description = req.body.description;
    var date_debut = req.body.date_debut;
    var date_echeance = req.body.date_echeance;
    var complete = req.body.complete;
    
    if (tache_id === undefined || tache_id < 0) {
        res.status(405).send({
            "message": "Vous devez fournir l'id de la tâche à modifier."
        });
        return;
    }
    
    var tache = await Taches.getTache(tache_id);
    var user = await Utilisateur.getUser(cle_api);
    var champsModifie = verifyQueryUpdateTache(tache,titre,description,date_debut,date_echeance,complete);
    
    if (tache === undefined) {
        res.status(404).send({"erreur": `Tâche introuvable avec l'id ${tache_id}`});
        return;
    }
    
    if (tache.utilisateur_id != user.id) {
        res.status(403).send({
            "message": "Vous n'avez pas les droits de modifiée une tâche qui ne vous appartient pas."
        });
    }
    else {
        Taches.updateTache(tache_id,champsModifie)
        .then((tache) => {
            res.send({
                "message": `La tâche avec l'id: ${tache_id}, a été modifier avec succès.`,
            });
        });
    }
};

exports.updateTacheComplete = async (req, res) => {
    var cle_api = req.headers.authorization;
    var tache_id = req.params.id;
    
    if (tache_id === undefined || tache_id < 0) {
        res.status(405).send({
            "message": "Vous devez fournir l'id de la tâche à complétée."
        });
        return;
    }
    
    var tache = await Taches.getTache(tache_id);
    var user = await Utilisateur.getUser(cle_api);
    
    if (tache === undefined) {
        res.status(404).send({"erreur": `Tâche introuvable avec l'id ${tache_id}`});
        return;
    }
    
    if (tache.utilisateur_id != user.id) {
        res.status(403).send({
            "message": "Vous n'avez pas les droits de complétée une tâche qui ne vous appartient pas."
        });
    }
    else {
        Taches.updateTacheComplete(tache_id)
        .then((tache) => {
            res.send({
                "message": `La tâche avec l'id: ${tache_id}, a été complétée avec succès.`,
            });
        });
    }
};

function verifyQueryUpdateTache(tache,titre,description,date_debut,date_echeance,complete) {
    var champs = [];

    if (!titre) {
        champs[0] = tache.titre;
    }
    else {
        champs[0] = titre;
    }

    if (!description) {
        champs[1] = tache.description;
    }
    else {
        champs[1] = description;
    }

    if (!date_debut) {
        champs[2] = tache.date_debut;
    }
    else {
        champs[2] = date_debut;
    }

    if (!date_echeance) {
        champs[3] = tache.date_echeance;
    }
    else {
        champs[3] = date_echeance;
    }

    if (!complete) {
        champs[4] = tache.complete;
    }
    else {
        champs[4] = complete;
    }

    return champs;
}
