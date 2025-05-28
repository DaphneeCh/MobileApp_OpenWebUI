/**
 * Énumération décrivant les types d'erreur acceptés par la classe FetchError.
 *  - Utilisateur : l'erreur est liée à une action de l'utilisateur (clé d'API invalide en particulier)
 *  - Developpement : l'erreur est survenue en raison d'une négligence dans le code (ou potentiellement une erreur serveur)
 *  - Reseau : l'erreur est liée à un problème de réseau (serveur inaccessible, etc.)
 *  - ObjetIncompatible: l'erreur survient lorsqu'un objet donné ne peut pas être manipulé par une fonction
 *  - IdInvalide : lorsqu'un paramètre de la fonction demande un ID, mais cet ID correspond à un objet que la fonction ne veut pas manipuler
 *  - ObjetInexistant : lorsqu'un objet, dont l'ID est donné en paramètre de fonction, n'existe tout simplement pas
 *  - Boucle : erreur lorsqu'il y a une boucle dans le programme (par exemple un arbre de conversation qui boucle)
 */
export enum TypesFetchError {
    Utilisateur = "ERR_UTILISATEUR",
    Developpement = "ERR_DEVELOPPEMENT",
    Reseau = "ERR_RESEAU",
    /** Un objet ne correspond pas à ce qui est attendu par une fonction normalement */
    ObjetIncompatible = "OBJET_INCOMPATIBLE",
    /** Un ID donné correspond à un objet qu'une fonction refuse de traiter  */
    IdInvalide = "ID_INVALIDE",
    /** Un objet indiqué n'existe pas (par exemple il n'existe pas d'objet pour l'ID donné) */
    ObjetInexistant = "OBJET_INEXISTANT",
    /** Dans le cas où l'algorithme se retrouve dans une boucle (par exemple des IDs qui se répétent) */
    Boucle = "BOUCLE"
}

// source modèle de la classe : https://stackoverflow.com/a/74012773
/** Représente une erreur lors d'une communication avec un serveur, via l'API Fetch. 
 * Ces erreurs peuvent être utilisées pour afficher un message à l'utilisateur (si nécessaire).
*/
export class FetchError {
    /** Le type d'erreur */
    #typeError: TypesFetchError
    /** Le message associé à l'erreur */
    #message: string

    /**
     * Crée une erreur pour les opérations Fetch vers un serveur
     * @param {TypesFetchError} typeError Le type d'erreur : utilisateur, développement ou réseau
     * @param {string} message Le message d'erreur associé
     */
    constructor(typeError: TypesFetchError, message?: string){
        this.#typeError = typeError;
        this.#message = (!message)? "" : message;
    }

    /**
     * Compare le type d'erreur de l'objet avec celui donné en paramètre
     * @param {TypesFetchError} type Le type d'erreur à comparer
     * @returns {boolean} `true` si le type d'erreur de l'objet correspond à celui donné, `false` sinon
     */
    isType(type: TypesFetchError): boolean {
        return this.#typeError === type;
    }

    /**
     * Vérifie qu'un objet est une instance de FetchError
     * @param error L'objet à vérifier
     * @returns Un booléen : `true` si l'objet est bien de la classe FetchError, `false` sinon
     */
    static isInstance(error: unknown): error is FetchError {
        if (error === undefined) return false;
        if (error === null) return false;
        if (typeof error !== 'object') return false;
        return error instanceof FetchError;
    }

    /**
     * Retourne le type d'erreur
     * @returns {string} Le type d'erreur, sous forme de chaîne de caractères
     */
    getTypeError(): string {
        return this.#typeError;
    }
    /**
     * Retourne le message associé à l'erreur
     * @returns {string} Le message associé à l'erreur, sous forme de chaîne de caractères
     */
    public getMessage(): string {
        return this.#message;
    }
}