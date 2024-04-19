import * as R from 'ramda';
import {writeFileSync} from 'fs';
import csv from 'csv-parser';
import * as fs from "fs";

const data = '';

const createfile = (text) => {
    try {
        writeFileSync('results.json', text);
        console.log('Le fichier a été créé avec succès.');
    } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'écriture du fichier :', error);
    }
};


createfile(data);


let filteredRows = [];
const filterRowsByMedals = row => R.pipe(
    R.prop('Medal'),
    R.equals(R.__, "Gold")
)(row);

const filterRowsByEdition = row => R.pipe(
    R.prop('Year'),
    parseInt,
    R.equals(R.__, 2016)
)(row);
const filterRowsByAge = row => R.pipe(
    R.prop('Age'),
    parseInt,
    R.lt(R.__, 25)
)(row);
fs.createReadStream('athlete_events.csv')
    .pipe(csv())
    .on('data', (row) => {
        // Si la ligne passe le filtre, l'ajouter au tableau
        if (filterRowsByMedals(row)) {
            if (filterRowsByAge(row)) {
                if (filterRowsByEdition(row)) {
                    filteredRows.push(row);
                }
            }
        }
    })
    .on('end', () => {
        // Insérer '[' avant la première ligne et ']' après la dernière ligne
        const filteredData = `[${filteredRows.map(row => JSON.stringify(row)).join(',\n')}]`;
        fs.writeFile('results.json', filteredData, (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier :', err);
                return;
            }
            console.log('Les lignes filtrées ont été écrites dans results.json.');
        });
    });


/*
function countIds(jsonData) {
    const idCounts = {};
    jsonData.forEach(item => {
        const id = item.id;
        idCounts[id] = (idCounts[id] || 0) + 1;
    });
    return idCounts;
}

// Lire le fichier JSON
fs.readFile('results.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Erreur lors de la lecture du fichier :', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        const idCounts = countIds(jsonData);
        console.log('Occurrences des IDs :', idCounts);
    } catch (error) {
        console.error('Erreur lors de l\'analyse du fichier JSON :', error);
    }
});*/