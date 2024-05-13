const Taches = require("../models/taches.model");
const SousTaches = require("../models/sous_taches.model");
const Utilisateur = require("../models/utilisateur.model");

exports.getTache = async (req, res) => {
    if(!req.params.id || parseInt(req.params.id) <= 0){
        res.status(400).send({"message": "L'id de la tâche est obligatoire et doit être supérieur à 0"});
        return;
    }
    
    var tache_id = req.params.id;
    var sous_taches = await SousTaches.getSousTaches(tache_id);
    
    Taches.getTache(tache_id)
    .then((tache) => {
        if (!tache) {
            res.status(404).send({"erreur": `Tâche introuvable avec l'id: ${tache_id}`});
            return;
        }

        res.send({
            "tâche": [{
                "id": tache.id,
                "utilisateur_id": tache.utilisateur_id,
                "titre": tache.titre,
                "description": tache.description,
                "date_debut": tache.date_debut,
                "date_echeance": tache.date_echeance,
                "complete": tache.complete,
                "sous-tâches": sous_taches
            }]
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

exports.getTaches = async (req, res) => {
    let cle_api = req.headers.authorization;
    let user = await Utilisateur.getUser(cle_api);
    let all = !req.query.all || req.query.all == 0 ? 0: 1;

    Taches.getTaches(user.id, all)
    .then((taches) => {
        res.send({
            "tâches": taches
        });
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).send({
            "erreur": `Echec lors de la récupération des tâches de l'utilisateur ${user_id}`
        });
    });
};

exports.addTache = async (req, res) => {
    var cle_api = req.headers.authorization;
    var user = await Utilisateur.getUser(cle_api);
    var titre = req.body.titre;
    var description = req.body.description;
    var date_debut = req.body.date_debut;
    var date_echeance = req.body.date_echeance;
    var complete = req.body.complete;

    if (verifyQueryInsertTache(res,titre,description,date_debut,date_echeance,complete)) {
        Taches.addTache(user.id,titre,description,date_debut,date_echeance,complete)
        .then((tache) => {
            res.send({
                "message": `La tâche: ${titre}, a été ajouter avec succès.`,
            });
        })
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500).send({
                "erreur": `Echec lors de l'ajout d'une tâche, ${titre}, de l'utilisateur`
            });
        });
    }
};

function verifyQueryInsertTache(res,titre,description,date_debut,date_echeance,complete) {
    let messageRequis = "Les champs suivants sont requis: ";

    messageRequis += titre === undefined ? "titre ": "";
    
    messageRequis += description === undefined ? "description ": "";

    messageRequis += date_debut === undefined ? "date_debut ": "";

    messageRequis += date_echeance === undefined ? "date_echeance ": "";

    messageRequis += complete === undefined ? "complete ": "";

    if (messageRequis != "Les champs suivants sont requis: ") {
        res.status(405).send({"message": messageRequis});
        return false;
    }
    return true;
}

exports.removeTache = async (req, res) => {
    if (req.params.id === undefined || parseInt(req.params.id) <= 0) {
        res.status(405).send({"message": "Vous devez fournir l'id de la tâche à supprimer."});
        return;
    }
    
    var cle_api = req.headers.authorization;
    var tache_id = req.params.id;
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
        return;
    }

    Taches.removeTache(tache_id)
    .then((tache) => {
        res.send({
            "message": `La tâche avec l'id: ${tache_id}, a été supprimer avec succès.`,
        });
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).send({
            "erreur": `Échec lors de la suppression d'une tâche, ${tache_id}, de l'utilisateur`
        });
    });
};

exports.updateTache = async (req, res) => {
    if (req.params.id === undefined || parseInt(req.params.id) <= 0) {
        res.status(405).send({"message": "Vous devez fournir l'id de la tâche à modifier."});
        return;
    }

    var cle_api = req.headers.authorization;
    var tache_id = req.params.id;
    var tache = await Taches.getTache(tache_id);
    var user = await Utilisateur.getUser(cle_api);
    
    var champsModifie = verifyQueryUpdateTache(tache,req.body.titre,req.body.description,req.body.date_debut,req.body.date_echeance,req.body.complete);
    
    if (tache === undefined) {
        res.status(404).send({"erreur": `Tâche introuvable avec l'id ${tache_id}`});
        return;
    }
    
    if (tache.utilisateur_id != user.id) {
        res.status(403).send({
            "message": "Vous n'avez pas les droits de modifiée une tâche qui ne vous appartient pas."
        });
        return;
    }

    Taches.updateTache(tache_id,champsModifie)
    .then((tache) => {
        res.send({
            "message": `La tâche avec l'id: ${tache_id}, a été modifier avec succès.`,
        });
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).send({
            "erreur": `Échec lors de la modification d'une tâche, ${tache_id}, de l'utilisateur`
        });
    });
};

exports.updateTacheComplete = async (req, res) => {
    if (req.params.id === undefined || parseInt(req.params.id) <= 0) {
        res.status(405).send({"message": "Vous devez fournir l'id de la tâche à compléter."});
        return;
    }

    var cle_api = req.headers.authorization;
    var tache_id = req.params.id;
    var tache = await Taches.getTache(tache_id);
    var user = await Utilisateur.getUser(cle_api);
    
    if (tache === undefined) {
        res.status(404).send({"erreur": `Tâche introuvable avec l'id ${tache_id}`});
        return;
    }

    if (tache.utilisateur_id != user.id) {
        res.status(403).send({
            "message": "Vous n'avez pas les droits de compléter une tâche qui ne vous appartient pas."
        });
        return;
    }
    
    Taches.updateTacheComplete(tache_id)
    .then((tache) => {
        res.send({
            "message": `La tâche avec l'id: ${tache_id}, a été complétée avec succès.`,
        });
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).send({
            "erreur": `Échec lors de la completion d'une tâche, ${tache_id}, de l'utilisateur`
        });
    });
};

function verifyQueryUpdateTache(tache,titre,description,date_debut,date_echeance,complete) {
    var champs = [];

    champs[0] = !titre ? tache.titre: titre;

    champs[1] = !titre ? tache.description: description;
    
    champs[2] = !titre ? tache.date_debut: date_debut;
    
    champs[3] = !titre ? tache.date_echeance: date_echeance;
    
    champs[4] = !titre ? tache.complete: complete;

    return champs;
}
