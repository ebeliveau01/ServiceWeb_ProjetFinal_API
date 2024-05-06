// À ajuster selon la structure
const sql = require("../config/db_pg");

const SousTaches = function(sous_tache) {
    this.id = sous_tache.id;
    this.tache = sous_tache.tache_id;
    this.titre = sous_tache.titre;
    this.complete = sous_tache.complete;
};

SousTaches.getSousTaches = (tache_id) => {
    return new Promise((resolve, reject) => {
        const requete = `SELECT id,titre,complete FROM sous_taches WHERE tache_id = $1`;
        const params = [tache_id]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat.rows);
        });
    });
};

SousTaches.getSousTache = (sous_tache_id) => {
    return new Promise((resolve, reject) => {
        const requete = `SELECT tache_id,titre,complete FROM sous_taches WHERE id = $1`;
        const params = [sous_tache_id]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat.rows[0]);
        });
    });
};

SousTaches.addSousTache = (tache_id,titre,complete) => {
    return new Promise((resolve, reject) => {
        const requete = `INSERT INTO sous_taches (tache_id,titre,complete) VALUES ($1,$2,$3)`;
        const params = [tache_id,titre,complete]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    });
};

SousTaches.removeSousTache = (sous_tache_id) => {
    return new Promise((resolve, reject) => {
        const requete = `DELETE FROM sous_taches WHERE id = $1`;
        const params = [sous_tache_id]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    });
};

SousTaches.updateSousTache = (sous_tache_id,tacheModifie) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE sous_taches SET titre = $2, complete = $3 WHERE id = $1`;
        const params = [sous_tache_id,tacheModifie[0],tacheModifie[1]]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    });
};

SousTaches.updateSousTacheComplete = (sous_tache_id) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE sous_taches SET complete = 1 WHERE id = $1`;
        const params = [sous_tache_id]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    });
};

module.exports = SousTaches;