// À ajuster selon la structure
const sql = require("../config/db_pg");

const Taches = function(tache) {
    this.id = tache.id;
    this.user = tache.utilisateur_id;
    this.titre = tache.titre;
    this.description = tache.description;
    this.date_debut = tache.date_debut;
    this.date_echeance = tache.date_echeance;
    this.complete = tache.complete;
};

Taches.getTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = `SELECT * FROM taches WHERE id = $1`;
        const params = [id]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat.rows[0]);
        });
    });
};

Taches.getTaches = (user_id, all) => {
    return new Promise((resolve, reject) => {
        let requete = `SELECT id,titre FROM taches WHERE utilisateur_id = $1 ORDER BY id`;
        let params = [user_id]

        if (all == 0) {
            requete = `SELECT id,titre FROM taches WHERE utilisateur_id = $1 AND complete = 0 ORDER BY id`;
            params = [user_id]
        }

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat.rows);
        });
    });
};

Taches.addTache = (user_id,titre,description,date_debut,date_echeance,complete) => {
    return new Promise((resolve, reject) => {
        const requete = `INSERT INTO taches (utilisateur_id,titre,description,date_debut,date_echeance,complete) VALUES ($1,$2,$3,$4,$5,$6)`;
        const params = [user_id,titre,description,date_debut,date_echeance,complete]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    });
};

Taches.removeTache = (tache_id) => {
    return new Promise((resolve, reject) => {
        const requete = `DELETE FROM taches WHERE id = $1`;
        const params = [tache_id]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    });
};

Taches.updateTache = (tache_id,tacheModifie) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE taches SET titre = $2, description = $3, date_debut = $4, date_echeance = $5, complete = $6 WHERE id = $1`;
        const params = [tache_id,tacheModifie[0],tacheModifie[1],tacheModifie[2],tacheModifie[3],tacheModifie[4]]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    });
};

Taches.updateTacheComplete = (tache_id) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE taches SET complete = 1 WHERE id = $1`;
        const params = [tache_id]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    });
};

module.exports = Taches;