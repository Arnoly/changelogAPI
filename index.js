'use strict';

// const express = require('express');
const moment = require('moment');
// const bodyParser = require('body-parser');
// const objection = require('objection');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const authToken = 'token 6b8775d58f7b9a878da086cb3102bc902a651296';


fs.writeFile('Logs.txt', 'Logs du ' + moment().format('DD/MM/YYYY hh:mm:ss'), function (err) {
    if (err) throw err;
    console.log('Le fichier a bien été créé');
});

// On récupère la liste des repositories
axios.get('https://api.github.com/users/Arnoly/repos', {headers: {Authorization: authToken}}).then(async projectList => {
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
        let readmeData = await axios.get('https://api.github.com/repos/Arnoly/' + projectName + '/contents/' + fileToGet, {headers: {Authorization: authToken}}).catch(() => {
            nbErrors++;
            errorFiles += '/' + projectName + '\n';
            console.log('Une erreur est survenue') });
        if(readmeData)
        {
            let dataToAppend = await axios.get(readmeData.data.download_url, {headers: {Authorization: authToken}});
            if(dataToAppend)
            {
                textToAppend += `\n ------${fileToGet} for project ${projectName}------ \n` + '\n' + dataToAppend.data;
            }
        }
    }

    fs.appendFileSync('Logs.txt', textToAppend + '\n');
    if(nbErrors > 0)
    {
        console.log(`Fin du processus, ${nbRepos} dépôts traités avec ${nbErrors} erreur(s) -> ${errorFiles}`);
    }
    else
    {
        console.log(`Fin du processus, ${nbRepos} dépôts traîtés`);
    }
});
