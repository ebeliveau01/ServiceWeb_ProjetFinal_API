const sql = require("../config/db_pg.js");

exports.validationCleApi = (cleApi) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT count(*) AS count FROM utilisateur WHERE cle_api = $1';
        const parametres = [cleApi];

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            resolve(resultat.rows[0].count > 0);
        });
    });
}

exports.getUser = (cleApi) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT id,nom,prenom,courriel FROM utilisateur WHERE cle_api = $1';
        const parametres = [cleApi];

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            resolve(resultat.rows[0]);
        });
    });
}

exports.getUserAuth = (email,password) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT count(*) AS count FROM utilisateur WHERE courriel = $1 AND password = $2';
        const parametres = [email,password];

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            resolve(resultat.rows[0]);
        });
    });
}

exports.getUserPassword = (email) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT password FROM utilisateur WHERE courriel = $1';
        const parametres = [email];

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            resolve(resultat.rows[0]);
        });
    });
}

exports.addUser = (email,password,cleApi) => {
    return new Promise((resolve, reject) => {
        const requete = 'INSERT INTO utilisateur (courriel,cle_api,password) VALUES ($1,$2,$3)';
        const parametres = [email,cleApi,password];

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            resolve(resultat);
        });
    });
}

exports.newApiKey = (cleApi,email) => {
    return new Promise((resolve, reject) => {
        const requete = 'UPDATE utilisateur SET cle_api = $1 WHERE courriel = $2';
        const parametres = [cleApi,email];

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            resolve(resultat);
        });
    });
}