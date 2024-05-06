const express = require('express');
const dotenv = require('dotenv');
const sql = require("./src/config/db_pg");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/config/documentation.json');
const cors = require('cors');

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Travail Session"
};

dotenv.config();

const PORT = process.env.PORT | 3000;
const app = express();
app.use(express.json());
app.use(cors());

const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "error500.log"),
    { flags: "a" }
);

app.use(
    morgan("common", {
    skip: function (req, res) {
        return res.statusCode < 500;
    },
    stream: accessLogStream,
    })
);

const authentification = require('./src/middlewares/authentification.middleware');

app.use('/api/user', require('./src/routes/user.routes'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use('/api', authentification, require('./src/routes/taches.routes'));
app.use('/api/modifyTask', authentification, require('./src/routes/modifyTask.routes'));
app.use('/api/modifySubTask', authentification, require('./src/routes/modifySubTask.routes'));

app.get('/', (req, res) => {
    res.send("hello");
});

app.listen(PORT, () => {
    console.log(`Serveur démarré ${PORT}`);
});