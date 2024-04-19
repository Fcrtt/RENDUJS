import * as R from 'ramda';
import * as fs from 'fs';
import {writeFileSync} from 'fs';
import csv from 'csv-parser';

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
const filterRowsByMedals = row => R.pipe(R.prop('Medal'), R.equals(R.__, "Gold"))(row);

const filterRowsByEdition = row => R.pipe(R.prop('Year'), parseInt, R.equals(R.__, 2016))(row);
const filterRowsByAge = row => R.pipe(R.prop('Age'), parseInt, R.lt(R.__, 25))(row);
fs.createReadStream('athlete_events.csv')
    .pipe(csv())
    .on('data', (row) => {

        if (filterRowsByMedals(row)) {
            if (filterRowsByAge(row)) {
                if (filterRowsByEdition(row)) {
                    filteredRows.push(row);
                }
            }
        }
    })
    .on('end', () => {

        const filteredData = `[\n${filteredRows.map(row => '\t' + JSON.stringify(row)).join(',\n')}\n]`;
        fs.writeFile('results.json', filteredData, (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier :', err);
                return;
            }
            console.log('Les lignes filtrées ont été écrites dans results.json.');
        });
    });


const countIds = jsonData => {
    console.log(R.pipe(R.map(R.prop('ID')), R.countBy(R.identity))(jsonData));
};

countIds('results.json');



