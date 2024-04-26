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
        let resultsf;
        resultsf = R.pipe(R.sortBy(R.prop(1)), R.reverse)(countNames(filteredRows));
        console.log('Voici les 25 athlètes les plus susceptibles de remporter des médailles aux JO de Paris : ');
        console.log(R.take(25, resultsf));
    });


const countNames = jsonData => {
    return (R.pipe(R.map(R.prop("Name")), R.countBy(R.identity), R.toPairs)(jsonData));
};
