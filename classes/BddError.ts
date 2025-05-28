/** Énumération décrivant les types d'erreurs acceptés par la classe BddError
 *  - Developpement : l'erreur est survenue en raison d'une négligeance dans le code
 *  - IdServeurIndeterminable : échec de création d'un ID de serveur qui n'existe pas déjà dans la BDD.
 *  - AdresseDejaExistante : l'adresse donnée existe déjà dans la BDD (on n'accepte pas les doublons)
 *  - ParametreIncompatible : le paramètre d'une fonction est incompatible (par exemple, on passe l'ID d'un serveur à modifier, mais il n'existe pas dans la table)
 *  - NombreMaxServeursAtteint : si le nombre maximal de serveurs dans la table 'serveurs' est atteint, on ne peut pas en ajouter
 *  - ObjetSecuriseDejaExistant : on veut créer un nouvel objet sécurisé avec une clé donnée, mais la clé est déjà utilisée 
 *  - ObjetSecuriseNonExistant : on veut récupérer / modifier un objet sécurisé avec une clé donnée, mais la clé ne renvoie à rien
 *  - ObjetSecuriseErreur : l'erreur est survenue en manipulant la BDD pour les objets sécurisés
*/
export enum TypesBddError {
    Developpement = "DEVELOPPEMENT",
    IdServeurIndeterminable = "ID_SERVEUR_INDETERMINABLE",
    AdresseDejaExistante = "ADRESSE_DEJA_EXISTANTE",
    ParametreIncompatible = "PARAMETRE_INCOMPATIBLE",
    NombreMaxServeursAtteint = "NOMBRE_MAX_SERVEURS_ATTEINT",
    ObjetSecuriseDejaExistant = "OBJET_SECURISE_DEJA_EXISTANT",
    ObjetSecuriseNonExistant = "OBJET_SECURISE_NON_EXISTANT",
    ObjetSecuriseErreur = "OBJET_SECURISE_ERREUR"
}

/** Représente une erreur lors de la manipulation de la BDD */
export class BddError {
    /** Le type d'erreur */
    #typeError: TypesBddError
    /** Le message associé à l'erreur */
    #message: string

    /**
     * Crée une erreur pour les opérations de manipulation de BDD
     * @param {TypesFetchError} typeError Le type d'erreur
     * @param {string} message Le message d'erreur associé
     */
    constructor(typeError: TypesBddError, message: string) {
        this.#typeError = typeError;
        this.#message = message;
    }

    /**
     * Compare le type d'erreur de l'objet avec celui donné en paramètre
     * @param {TypesFetchError} type Le type d'erreur à comparer
     * @returns {boolean} `true` si le type d'erreur de l'objet correspond à celui donné, `false` sinon
     */
    isType(type: TypesBddError): boolean {
        return this.#typeError === type;
    }

    /**
     * Vérifie qu'un objet est une instance de BddError
     * @param error L'objet à vérifier
     * @returns Un booléen : `true` si l'objet est bien de la classe BddError, `false` sinon
     */
    static isInstance(error: unknown): error is BddError {
        if (error === undefined) return false;
        if (error === null) return false;
        if (typeof error !== 'object') return false;
        return error instanceof BddError;
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