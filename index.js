/*
 * Copyright (c) 2019 Arthur LE RAY
 */
'use strict';

// const express = require('express');
const moment = require('moment');
// const bodyParser = require('body-parser');
// const objection = require('objection');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const mkdirp = require('mkdirp');
// const authToken = 'token 6b8775d58f7b9a878da086cb3102bc902a651296';
const fileName = `Logs/Logs_${moment().format('DD-MM-YYYY')}`;
let mostRecentFile;

try{
    mkdirp('Logs/');
}catch(Exception){
    console.log(Exception);
}

fs.writeFile(fileName, 'Logs du ' + moment().format('DD/MM/YYYY hh:mm:ss') + '\n', function (err) {
    if (err) throw err;
    console.log('Le fichier a bien été créé');
});

// On récupère la liste des repositories
axios.get('https://api.github.com/orgs/weview-app/repos').then(async projectList => {
    console.log('Ajout des données au fichier...');
    let projectsData = projectList.data;
    let textToAppend = '';
    let nbRepos = 0;
    let nbErrors = 0;
    let errorFiles = '';

    // Pour chaque repos on cherche le README.md
    for (let project of projectsData) {
        nbRepos++;
        console.log('Traitement d\'un repository');
        let projectName = project.name;
        let fileToGet = 'README.md';

        // On ajoute le contenu de chaque README.md à la variable textToAppend
        let readmeData = await axios.get('https://api.github.com/repos/weview-app/' + projectName + '/contents/' + fileToGet).catch(() => {
            nbErrors++;
            errorFiles += '/' + projectName + '\n';
        });
        if (readmeData) {
            let dataToAppend = await axios.get(readmeData.data.download_url);
            if (dataToAppend) {
                textToAppend += `\n ------${fileToGet} for project ${projectName}------ \n` + '\n' + dataToAppend.data;
            }
        }
    }
    // On ajoute les readme au fichier Logs créé et on gère les erreurs
    fs.appendFileSync(fileName, textToAppend + '\n');
    if (nbErrors > 0) {
        console.log(`Fin du processus, ${nbRepos} dépôts traités avec ${nbErrors} erreur(s) -> ${errorFiles}`);
    } else {
        console.log(`Fin du processus, ${nbRepos} dépôts traîtés`);
    }
    let check = true;
// On récupère le Logs le plus récent
    fs.readdir('Logs/', function (err, files) {
        //handling error
        if (err) {
            return console.log('Impossible de lire le répertoire: ' + err);
        }
        //listing all files
        for (let file of files) {
            let fileBirth = moment(fs.statSync('Logs/' + file).birthtime).format('DD/MM/YYYY');
            if(check) {
                mostRecentFile = 'Logs/' + file;
                check = false;
            }
            let mostRecentBirth = moment(fs.statSync(mostRecentFile).birthtime).format('DD/MM/YYYY');
            if(fileBirth > mostRecentBirth && 'Logs/' + file !== fileName) {
                mostRecentFile = 'Logs/' + file;
            }
        }
        let latestFileSize = fs.statSync(mostRecentFile).size;
        let currentFileSize = fs.statSync(fileName).size;
        if (mostRecentFile !== fileName) {
            console.log(`Poids du dernier changelog ${mostRecentFile.replace('Logs/', '')}->${latestFileSize/1000} Ko
         et du nouveau->${currentFileSize/1000} Ko`);
        }
        else {
            console.log(`Pas d'autres fichier Logs, taille du nouveau ${currentFileSize/1000} Ko`);
        }
    });
});
