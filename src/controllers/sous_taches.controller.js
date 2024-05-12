const Taches = require("../models/taches.model");
const SousTaches = require("../models/sous_taches.model");
const Utilisateur = require("../models/utilisateur.model");

exports.addSousTache = async (req, res) => {
    if (req.body.tache_id === undefined || parseInt(req.body.tache_id) <= 0) {
        res.status(405).send({"message": "Vous devez fournir l'id de la tâche à laquelle ajouter cette sous-tâche."});
        return;
    }

    var tache_id = req.body.tache_id;
    var titre = req.body.titre;
    var complete = req.body.complete;

    var tache = await Taches.getTache(tache_id);

    if (tache && verifyQueryInsertTache(res,titre,complete)) {
        SousTaches.addSousTache(tache_id,titre,complete)
        .then((sous_tache) => {
            res.send({
                "message": `La sous-tâche: ${titre}, a été ajoutée avec succès.`,
            });
        })
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500).send({
                "erreur": `Échec lors de l'addition d'une sous-tâche: ${titre}, à la tâche: ${tache_id}`
            });
        });
    }
};

function verifyQueryInsertTache(res,titre,complete) {
    let messageRequis = "Les champs suivants sont requis:";

    messageRequis += titre === undefined ? " titre": "";
    
    messageRequis += complete === undefined ? " complete": "";

    if (messageRequis != "Les champs suivants sont requis:") {
        res.status(405).send({"message": messageRequis});
        return false;
    }
    return true;
}

exports.removeSousTache = async (req, res) => {
    if (req.params.id === undefined || parseInt(req.params.id) <= 0) {
        res.status(405).send({"message": "Vous devez fournir l'id de la sous-tâche à supprimer."});
        return;
    }

    var cle_api = req.headers.authorization;
    var sous_tache_id = req.params.id;

    var sous_tache = await SousTaches.getSousTache(sous_tache_id);
    var tache = await Taches.getTache(sous_tache.tache_id);
    var user = await Utilisateur.getUser(cle_api);
    
    if (sous_tache === undefined) {
        res.status(404).send({"erreur": `Sous-tâche introuvable avec l'id: ${sous_tache_id}`});
        return;
    }

    if (tache.utilisateur_id != user.id) {
        res.status(403).send({
            "message": "Vous n'avez pas les droits de supprimer une sous-tâche qui ne vous appartient pas."
        });
        return;
    }

    SousTaches.removeSousTache(sous_tache_id)
    .then((tache) => {
        res.send({
            "message": `La sous-tâche avec l'id: ${sous_tache_id}, a été supprimée avec succès.`,
        })
        .catch((erreur) => {
            res.status(500).send({
                "erreur": `Échec lors de la suppression d'une sous-tâche: ${sous_tache_id}`
            });
        });
    });
};

exports.updateSousTache = async (req, res) => {
    if (req.params.id === undefined || parseInt(req.params.id) <= 0) {
        res.status(405).send({"message": "Vous devez fournir l'id de la sous-tâche à modifier."});
        return;
    }

    var cle_api = req.headers.authorization;
    var sous_tache_id = req.params.id;
    
    var sous_tache = await SousTaches.getSousTache(sous_tache_id);
    var tache = await Taches.getTache(sous_tache.tache_id);
    var user = await Utilisateur.getUser(cle_api);
    var champsModifie = verifyQueryUpdateTache(sous_tache,req.body.titre,req.body.complete);

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
        return;
    }

    SousTaches.updateSousTache(sous_tache_id,champsModifie)
    .then((tache) => {
        res.send({
            "message": `La sous-tâche avec l'id: ${sous_tache_id}, a été modifiée avec succès.`,
        })
        .catch((erreur) => {
            res.status(500).send({
                "erreur": `Échec lors de la modification d'une sous-tâche: ${sous_tache_id}`
            });
        });
    });
};

exports.updateSousTacheComplete = async (req, res) => {
    if (req.params.id === undefined || parseInt(req.params.id) <= 0) {
        res.status(405).send({"message": "Vous devez fournir l'id de la sous-tâche à complétée."});
        return;
    }

    var cle_api = req.headers.authorization;
    var sous_tache_id = req.params.id;
    
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
        return;
    }

    SousTaches.updateSousTacheComplete(sous_tache_id)
    .then((tache) => {
        res.send({
            "message": `La sous-tâche avec l'id: ${sous_tache_id}, a été complétée avec succès.`,
        })
        .catch((erreur) => {
            res.status(500).send({
                "erreur": `Échec lors de la complétion de la sous-tâche: ${sous_tache_id}`
            });
        });
    });
};

function verifyQueryUpdateTache(sous_tache,titre,complete) {
    var champs = [];

    champs[0] = !titre ? sous_tache.titre: titre;
    
    champs[1] = !titre ? sous_tache.complete: complete;

    return champs;
}
