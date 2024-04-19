import * as R from 'ramda'
import {writeFileSync} from 'fs';
import csv from 'csv-parser';
import * as fs from "fs";
import {table} from "@observablehq/inputs";

const data = 'trucs à écrire dans le fichier';

const createfile = (text) => {
    try {
        writeFileSync('results.txt', text);
        console.log('Le fichier a été écrit avec succès.');
    } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'écriture du fichier :', error);
    }
};


createfile(data);


let filteredRows = [];
const filterRows = row => R.pipe(
    R.prop('Medal'),
    //parseInt,
    R.equals(R.__, "Gold")
)(row);
fs.createReadStream('athlete_events.csv')
    .pipe(csv())
    .on('data', (row) => {
        // Si la ligne passe le filtre, l'ajouter au tableau
        if (filterRows(row)) {
            filteredRows.push(row);
        }
    })
    .on('end', () => {
        const filteredData = filteredRows.map(row => JSON.stringify(row)).join('\n');
        fs.writeFile('results.txt', filteredData, (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier :', err);
                return;
            }
            console.log('Les lignes filtrées ont été écrites dans results.txt');
        });
    });