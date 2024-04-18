import * as R from 'ramda'
import {writeFileSync} from 'fs';
import csv from 'csv-parser';
import * as fs from "fs";
import {Table} from "@observablehq/inputs";
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

    const estJeune = R.compose(R.lt(R.__, ageLimite), parseInt, R.prop("Age"));

    const processRow = R.when(
        estJeune,
        R.tap(row => {
            console.log("Personne ajoutée :", row); // Débogage : Affiche la personne ajoutée
            personnesJeunes.push(row);
        })
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
};

const transformCSV = R.pipe(
    R.pipe( //text
        R.split('\n'), //rows text
        R.map( //row text
            R.pipe( //row text
                R.split(','), //cells
                R.map(R.trim) //trim cells
            )
        )
    ), //[ rows -> cells]
    R.splitAt(1), //name's column first row
    R.apply(   //[ [names], [lines] ]
        R.lift(R.zipObj)
    )
);

const arrayOfObject = transformCSV('athlete_events.csv');
Table(arrayOfObject);
createfile(data);
filtrerParAgeInferieur('athlete_events.csv', 30);