import * as R from 'ramda'
import { writeFileSync } from 'fs';

const predjson = 'fonction créant fichier json contenant les resultats des preds';

console.log(predjson);


const data = 'Contenu à écrire dans le fichier';

try {
    writeFileSync('results.txt', data);
    console.log('Le fichier a été écrit avec succès.');
} catch (error) {
    console.error('Une erreur s\'est produite lors de l\'écriture du fichier :', error);
}