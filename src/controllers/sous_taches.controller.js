const Taches = require("../models/taches.model");
const SousTaches = require("../models/sous_taches.model");
const Utilisateur = require("../models/utilisateur.model");

exports.addSousTache = async (req, res) => {
    var cle_api = req.headers.authorization;
    var tache_id = req.body.tache_id;
    var titre = req.body.titre;
    var complete = req.body.complete;

    if (tache_id === undefined || tache_id < 0) {
        res.status(405).send({
            "message": "Vous devez fournir l'id de la tâche à laquelle ajouter cette sous-tâche."
        });
        return;
    }

    var tache = await Taches.getTache(tache_id);

    if (tache && verifyQueryInsertTache(res,titre,complete)) {
        SousTaches.addSousTache(tache_id,titre,complete)
        .then((sous_tache) => {
            res.send({
                "message": `La sous-tâche: ${titre}, a été ajoutée avec succès.`,
            });
        });
    }
};

function verifyQueryInsertTache(res,titre,complete) {
    let messageRequis = "Les champs suivants sont requis: ";

    if (titre === undefined) {
        messageRequis += "titre ";
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

exports.removeSousTache = async (req, res) => {
    var cle_api = req.headers.authorization;
    var sous_tache_id = req.params.id;

    if (sous_tache_id === undefined || sous_tache_id < 0) {
        res.status(405).send({
            "message": "Vous devez fournir l'id de la sous-tâche à supprimer."
        });
        return;
    }

    var sous_tache = await SousTaches.getSousTache(sous_tache_id);
    var tache = await Taches.getTache(sous_tache.tache_id);
    var user = await Utilisateur.getUser(cle_api);
    
    if (sous_tache === undefined) {
        res.status(404).send({"erreur": `Sous-tâche introuvable avec l'id ${sous_tache_id}`});
        return;
    }

    if (tache === undefined) {
        res.status(404).send({"erreur": `Tâche introuvable avec l'id ${tache.id}`});
        return;
    }

    if (tache.utilisateur_id != user.id) {
        res.status(403).send({
            "message": "Vous n'avez pas les droits de supprimer une sous-tâche qui ne vous appartient pas."
        });
    }
    else {
        SousTaches.removeSousTache(sous_tache_id)
        .then((tache) => {
            res.send({
                "message": `La sous-tâche avec l'id: ${sous_tache_id}, a été supprimée avec succès.`,
            });
        });
    }
};

exports.updateSousTache = async (req, res) => {
    var cle_api = req.headers.authorization;
    var sous_tache_id = req.params.id;

    var titre = req.body.titre;
    var complete = req.body.complete;
    
    if (sous_tache_id === undefined || sous_tache_id < 0) {
        res.status(405).send({
            "message": "Vous devez fournir l'id de la sous-tâche à modifier."
        });
        return;
    }
    
    var sous_tache = await SousTaches.getSousTache(sous_tache_id);
    var tache = await Taches.getTache(sous_tache.tache_id);
    var user = await Utilisateur.getUser(cle_api);
    var champsModifie = verifyQueryUpdateTache(sous_tache,titre,complete);

    if (sous_tache === undefined) {
        res.status(404).send({"erreur": `Sous-tâche introuvable avec l'id ${sous_tache_id}`});
        return;
    }
    
    if (tache === undefined) {
        res.status(404).send({"erreur": `Tâche introuvable avec l'id ${sous_tache.tache_id}`});
        return;
    }
    
    if (tache.utilisateur_id != user.id) {
        res.status(403).send({
            "message": "Vous n'avez pas les droits de modifiée une tâche qui ne vous appartient pas."
        });
    }
    else {
        SousTaches.updateSousTache(sous_tache_id,champsModifie)
        .then((tache) => {
            res.send({
                "message": `La sous-tâche avec l'id: ${sous_tache_id}, a été modifiée avec succès.`,
            });
        });
    }
};

exports.updateSousTacheComplete = async (req, res) => {
    var cle_api = req.headers.authorization;
    var sous_tache_id = req.params.id;
    
    if (sous_tache_id === undefined || sous_tache_id < 0) {
        res.status(405).send({
            "message": "Vous devez fournir l'id de la sous-tâche à complétée."
        });
        return;
    }
    
    var sous_tache = await SousTaches.getSousTache(sous_tache_id);
    var tache = await Taches.getTache(sous_tache.tache_id);
    var user = await Utilisateur.getUser(cle_api);

    if (sous_tache === undefined) {
        res.status(404).send({"erreur": `Sous-tâche introuvable avec l'id ${sous_tache_id}`});
        return;
    }
    
    if (tache === undefined) {
        res.status(404).send({"erreur": `Tâche introuvable avec l'id ${sous_tache.tache_id}`});
        return;
    }
    
    if (tache.utilisateur_id != user.id) {
        res.status(403).send({
            "message": "Vous n'avez pas les droits de complétée une tâche qui ne vous appartient pas."
        });
    }
    else {
        SousTaches.updateSousTacheComplete(sous_tache_id)
        .then((tache) => {
            res.send({
                "message": `La sous-tâche avec l'id: ${sous_tache_id}, a été complétée avec succès.`,
            });
        });
    }
};

function verifyQueryUpdateTache(sous_tache,titre,complete) {
    var champs = [];

    if (!titre) {
        champs[0] = sous_tache.titre;
    }
    else {
        champs[0] = titre;
    }

    if (!complete) {
        champs[1] = sous_tache.complete;
    }
    else {
        champs[1] = complete;
    }

    return champs;
}
