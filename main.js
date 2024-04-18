import * as R from 'ramda'
import {writeFileSync} from 'fs';
import csv from 'csv-parser';
import * as fs from "fs";
const data = 'trucs à écrire dans le fichier';

const createfile = (text) => {
    try {
        writeFileSync('results.txt', text);
        console.log('Le fichier a été écrit avec succès.');
    } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'écriture du fichier :', error);
    }
};

const filtrerParAgeInferieur = (file, ageLimite) => {
    const personnesJeunes = [];

    const estJeune = R.compose(R.lt(R.__, ageLimite), parseInt, R.prop('age'));

    const processRow = R.when(
        estJeune,
        R.tap(R.flip(R.append)(personnesJeunes))
    );

    const onData = R.forEach(processRow);

    const onEnd = () => {
        console.log("Personnes dont l'âge est inférieur à", ageLimite, ":", personnesJeunes);
    };

    const readStream = fs.createReadStream(file);

    readStream
        .pipe(csv())
        .on('data', onData)
        .on('end', onEnd);

    return(personnesJeunes);
};

createfile(data);
filtrerParAgeInferieur('athlete_events.csv', 30);

