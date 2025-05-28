import Storage from 'expo-sqlite/kv-store';
import { ParametresApplication } from '@/types/typesBDD';
import { BddError, TypesBddError } from '@/classes/BddError';

const cleParametresApplication: string = "parametresApplication";

/**
 * Initialise les paramètres d'application.
 * @returns {Promise<true | BddError>} `true` si l'initialisation s'est bien passée (ou que les paramètres sont déjà initialisés), ou une erreur `BddError` sinon
 */
export async function initialiserParametresApplication(): Promise<true | BddError> {
    try {
        const get = await Storage.getItemAsync(cleParametresApplication);
        if (get)
            return true; // Les paramètres d'application sont déjà initialisés.

        const parametresApplication: ParametresApplication = {
            notifications: true
        }

        const test = await Storage.setItemAsync(cleParametresApplication, JSON.stringify(parametresApplication));
        return true;

    } catch(e) {
        return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD des paramètres d'application.");
    }
}

/**
 * Parse un objet qui est censé être de type ParametresApplication.
 * @param {unknown} objet Un objet inconnu, censé représenter le type ParametresApplication.
 * @returns {ParametresApplication | null} L'objet parsé de type `ParametresApplication`, ou `null` si cela ne correspond pas.
 */
function parserObjetParametresApplication(objet: unknown): ParametresApplication | null {
    if (objet && typeof objet === "object"
        && "notifications" in objet && typeof objet.notifications === "boolean"
    ) {
        const param: ParametresApplication = {
            notifications: objet.notifications
        }

        return param;
    }
    return null;
}


/**
 * Récupère l'objet contenant les paramètres d'application.
 * @returns {Promise<ParametresApplication | BddError>} Un objet `ParametresApplication`, ou une erreur `BddError`
 */
export async function obtenirParametresApplication(): Promise<ParametresApplication | BddError> {
    try {
        // On commence par récupérer l'objet contenant les paramètres
        const get = await Storage.getItemAsync(cleParametresApplication);
        if (get === null)
            return new BddError(TypesBddError.Developpement, "Tentative d'accès à une BDD des paramètres d'application non initialisée.");
        
        // Il faut parser cet objet
        const objetRecupere = JSON.parse(get);
        const objetParametres = parserObjetParametresApplication(objetRecupere);
        if (!objetParametres)
            return new BddError(TypesBddError.Developpement, "L'objet sauvegardé comme paramètres d'application ne correspond pas à un objet utilisable.");

        return objetParametres;
    } catch(e) {
        return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD des paramètres d'application.");
    }
}



/**
 * Modifie les paramètres d'application.
 * @param {boolean} notifications La nouvelle valeur du paramètre 'notifications' 
 * @returns {Promise<true | BddError>} `true` si la modification s'est bien passée, ou une erreur `BddError` sinon
 */
export async function modifierParametresApplication(notifications?: boolean): Promise<true | BddError> {
    // On commence par récupérer l'objet contenant les paramètres
    const objetParametres = await obtenirParametresApplication();
    if (BddError.isInstance(objetParametres))
        return objetParametres; // propage l'erreur

    // Pour chaque paramètre d'application, on vérifie s'il a été passé en entrée de la fonction.
    //  Si oui, on peut modifier ce paramètre.
    if (typeof notifications != 'undefined')
        objetParametres.notifications = notifications;
    
    try {
        const result = await Storage.setItemAsync(cleParametresApplication, JSON.stringify(objetParametres));
        return true;
    } catch(e) {
        return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD des paramètres d'application.");
    }
}