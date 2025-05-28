// Outils divers
import { v4 as uuidv4 } from 'uuid';

/**
 * Crée un UUID (censé être unique)
 * @param {string[]} listeIDs Une liste des IDs qu'il ne faut pas dupliquer (optionnel)
 * @returns {string | false} Un UUID (chaîne de caractères) unique, ou `false` sinon 
 */
export function genererUUID(listeIDs?: string[]): string | false {
    //var uuid = crypto.randomUUID();
    var uuid = uuidv4();
    if (!listeIDs || (listeIDs && !listeIDs.includes(uuid)))
        return uuid.toString();

    // Sait-on jamais...
    var i = 0;
    do {
        //uuid = crypto.randomUUID();
        uuid = uuidv4();
        if (!listeIDs.includes(uuid))
            return uuid.toString();
        i++;
    } while (i < 10);

    return false;
}
