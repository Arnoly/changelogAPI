/*
 * Copyright (c) 2019 Arthur LE RAY
 */
'use strict';

const express = require('express');
const moment = require('moment');
const bodyParser = require('body-parser');
const objection = require('objection');
const axios = require('axios');
const cors = require('cors');

const AppModules = require('./src/database/models/AppModules');
const AppVersion = require('./src/database/models/AppVersion');
const ReposList = require('./src/database/models/ReposList');


const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());

app.get('/appList', (req, res) => {
    AppVersion.query().then(appList => {
        res.send(appList);
    });
});

app.get('/getModulesByAppId/:id', (req, res) => {
    ReposList.query().then(reposList => { res.send(reposList) });
    console.log(`Id de l'application ${req.params.id}`);
});

app.listen(3000, () => console.log('Server is listening'));
