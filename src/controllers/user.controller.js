const Utilisateur = require("../models/utilisateur.model");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

exports.addUser = async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    let message = "Vous devez fournir:";

    message += !email || !pattern.test(email) ? " un email valide": "";

    message += !password ? " un mot de passe": "";

    if (message != "Vous devez fournir:") {
        res.status(405).send({"message": message});
        return;
    }

    let user = await Utilisateur.getUserPassword(email);

    if (!user) {
        Utilisateur.addUser(email,hashPassword(password),genCleApi())
        .then((user) => {
            res.send({
                "message": `L'utilisateur: ${email}, a été ajouter avec succès.`,
            });
        });
    }
    else {
        res.status(500).send({
            "message": `L'utilisateur: ${email}, exite déjà.`,
        });
    }
};

exports.newApiKey = async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    let message = "Vous devez fournir:";
    var cleApi = genCleApi();

    message += !email ? " un email valide" : "";
    message += !password ? " un mot de passe" : "";

    if (message != "Vous devez fournir:") {
        res.status(405).send({"message": message});
        return;
    }

    var hash = await Utilisateur.getUserPassword(email);
    const ok = await bcrypt.compare(password, hash.password);

    if (ok) {
        Utilisateur.newApiKey(cleApi,email)
        .then((user) => {
            res.send({
                "message": `La nouvelle clé api: ${cleApi}`,
            });
        });
    }
    else {
        res.status(403).send({
            "message": "Vous n'avez pas le droit d'obtenir une nouvelle clé api. Mauvais email ou mot de passe."
        });
    }
};

function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

function genCleApi() {
    return uuidv4();
}