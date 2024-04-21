import * as R from 'ramda';
import * as fs from 'fs';
import csv from 'csv-parser';

const filteredRows = [];

const filterRowsByMedals = row => R.pipe(R.prop('Medal'), R.equals(R.__, "Gold"))(row);
const filterRowsByEdition = row => R.pipe(R.prop('Year'), parseInt, R.equals(R.__, 2016))(row);
const filterRowsByAge = row => R.pipe(R.prop('Age'), parseInt, R.lt(R.__, 25))(row);

fs.createReadStream('athlete_events.csv')
    .pipe(csv())
    .on('data', (row) => {
        if (filterRowsByMedals(row) && filterRowsByAge(row) && filterRowsByEdition(row)) {
            filteredRows.push(row);
        }
    })
    .on('end', () => {
        const filteredData = JSON.stringify(filteredRows);
        fs.writeFileSync('results.json', filteredData);
        console.log('Les lignes filtrées ont été écrites dans results.json.');
        countIds(filteredRows);
        lireDonneesLigneParLigne('results.json');
    });

const countIds = jsonData => {
    console.log(R.pipe(R.map(R.prop("ID")), R.countBy(R.identity))(jsonData));
};

async function lireDonneesLigneParLigne(nomFichier) {
    try {
        const tableauJSON = await lireFichierJSON(nomFichier);
        for (const ligne of tableauJSON) {
            console.log(ligne);
        }
    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}

async function lireFichierJSON(nomFichier) {
    return new Promise((resolve, reject) => {
        fs.readFile(nomFichier, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            // Vérifier si le fichier est vide
            if (!data.trim()) {
                reject(new Error('Le fichier est vide'));
                return;
            }

            try {
                const tableauJSON = JSON.parse(data);
                resolve(tableauJSON);
            } catch (error) {
                reject(error);
            }
        });
    });
}
