import * as SQLite from 'expo-sqlite';
import { DonneesServeur } from '@/types/typesBDD';
import { BddError, TypesBddError } from '@/classes/BddError';

import * as SecureStore from 'expo-secure-store';

/** Le nom de la BDD qui contient la liste des serveurs (cette BDD est manipulée par les fonctions du fichier 'bddListeServeurs') */
const nomBDD = "bddListeServeurs";
/** Le nombre maximal de serveurs dans la table 'serveurs'. Il n'est pas possible d'en ajouter plus. */
const nbMaxServeurs = 20;

export default class BddListeServeurs {

    /**
     * Crée la table 'serveurs'. Si elle existe déjà, cela n'a aucun effet.
     * @returns {Promise<true | BddError>} `true` si l'opération s'est bien passée, ou une erreur `BddError` sinon
     */
    public static async creerTableServeurs(): Promise<true | BddError> {
        try {
            const db = await SQLite.openDatabaseAsync(nomBDD);

            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS serveurs
                (
                id_serveur INTEGER PRIMARY KEY,
                id_nom_serveur TEXT NOT NULL UNIQUE,
                nom_serveur_affiche TEXT NOT NULL,
                adresse NOT NULL UNIQUE
                )
            `);
            return true;
        }
        catch(e) {
            return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD.");
        }
    }

    /**
     * Détermine un identifiant de serveur unique. Pour cela, on vérifie que l'identifiant donné n'existe pas déjà dans la table 'serveurs'.
     * @param {string} idServeurPropose L'ID dont on veut tester son existence dans la BDD
     * @returns {Promise<string | BddError>} L'identifiant s'il n'existe pas dans la BDD (ou un identifiant semblable qui n'existe pas encore dans la BDD), ou `BddError` si l'opération a échoué.
     */
    protected static async obtenirIdServeurUnique(idServeurPropose: string): Promise<string | BddError> {
        try {
            const db = await SQLite.openDatabaseAsync(nomBDD);

            // On commence par vérifier s'il n'existe pas déjà un 'nomServeur' similaire dans la table 'serveurs'
            const rowList = await db.getAllAsync(`
                SELECT id_nom_serveur FROM serveurs WHERE id_nom_serveur LIKE ?
            `, idServeurPropose+'%'); // le '%' permet de récupérer tous les noms de serveur commençant par le string dans 'nomServeur'
            
            // On parse le résultat dans un tableau de strings (plus facile à manipuler)
            const tabNomsServeurs = [];
            if (rowList) {
                for (const row of rowList) {
                    if (row && typeof row === "object" && "id_nom_serveur" in row)
                        tabNomsServeurs.push(row.id_nom_serveur);
                }
            }

            // On décide de l'ID final
            var idServeurFinal = idServeurPropose;

            // Pour cela, on vérifie que l'ID n'existe pas déjà dans la BDD. Sinon, on essaie d'ajouter un numéro en fin d'ID, pour le distinguer.
            if (tabNomsServeurs.includes(idServeurPropose)) {
                var i = 2;
                while (tabNomsServeurs.includes(idServeurPropose + i.toString()) && i < 50)
                    i++;
                if (i >= 50)
                    return new BddError(TypesBddError.IdServeurIndeterminable, "Erreur de création d'un ID unique pour un serveur.");
                idServeurFinal = idServeurPropose + i.toString();
            }
            return this.obtenirCleCorrecte(idServeurFinal); // On retourne une clé qui est compatible avec Secure Store
        }
        catch(e) {
            return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD.");
        }
    }

    /**
     * Permet de vérifier qu'une adresse donnée n'existe pas déjà dans la table 'serveurs' (on interdit les adresses en double)
     * @param {string} adresse L'adresse de serveur à vérifier
     * @returns {Promise<true | BddError>} `true` si l'adresse n'existe pas dans la table 'serveurs', ou une erreur `BddError` sinon
     */
    protected static async verifierAdresseNonExistante(adresse: string): Promise<true | BddError> {
        try {
            const db = await SQLite.openDatabaseAsync(nomBDD);

            // On commence par vérifier s'il n'existe pas déjà une 'adresse' similaire dans la table 'serveurs'
            const rowList = await db.getAllAsync(`
                SELECT adresse FROM serveurs WHERE id_nom_serveur = ?
            `, adresse);

            // Si le tableau 'rowList' n'est pas vide, c'est qu'il existe déjà une adresse identique dans la table 'serveurs'
            if (rowList.length > 0)
                return new BddError(TypesBddError.AdresseDejaExistante, "L'adresse existe déjà dans la liste des serveurs.");
            return true;
        }
        catch(e) {
            return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD.");
        }
    }

    /**
     * Récupère le nombre de lignes de la table 'serveurs'
     * @returns {Promise<number | BddError>} Le nombre de lignes de la table 'serveurs', ou une erreur `BddError`
     */
    public static async obtenirNombreDeServeursDansLaTable(): Promise<number | BddError> {
        try {
            const db = await SQLite.openDatabaseAsync(nomBDD);

            const result = await db.getFirstAsync(`
            SELECT COUNT(*) FROM serveurs 
            `);

            // Le résultat devrait être donné dans un objet du genre : { 'COUNT(*)' : 2 }
            if (result && typeof result === "object" && "COUNT(*)" in result && typeof result['COUNT(*)'] === "number")
                return result['COUNT(*)'];

            return new BddError(TypesBddError.Developpement, "Erreur lors du comptage du nombre de lignes de la table.");
        }
        catch(e) {
            return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD.");
        }
    }

    /**
     * Ajoute les informations d'un serveur dans la table 'serveurs'. La clé d'API est sauvegardée à part.
     * @param {string} idNomServeur Le nom du serveur 
     * @param {string} adresse L'adresse du serveur
     * @param {string} cleAPI La clé d'API pour le serveur
     * @returns {Promise<true | BddError>} `true` si l'ajout s'est bien réalisé, ou une erreur `BddError` sinon
     */
    public static async ajouterServeurDansTableServeurs(idNomServeur: string, adresse: string, cleAPI: string): Promise<true | BddError> {
        // On commence par vérifier que la table 'serveurs' n'a pas déjà atteint le nombre maximal de serveurs autorisé
        const nbServeurs = await this.obtenirNombreDeServeursDansLaTable();
        if (typeof nbServeurs === "number" && nbServeurs >= nbMaxServeurs)
            return new BddError(TypesBddError.NombreMaxServeursAtteint, "Le nombre de serveurs a atteint le plafond de "+nbMaxServeurs+" ; pour ajouter un nouveau serveur, il faut en supprimer un autre.");

        // On vérifie que l'adresse n'existe pas déjà dans la table 'serveurs'
        const verifAdresse = await this.verifierAdresseNonExistante(adresse);
        if (BddError.isInstance(verifAdresse))
            return verifAdresse; // propage l'erreur

        // On obtient un ID de serveur qui est certifié unique (au cas où)
        const idServeurFinal = await this.obtenirIdServeurUnique(idNomServeur);
        if (BddError.isInstance(idServeurFinal))
            return idServeurFinal; // propage l'erreur

        // Avant de modifier la table 'serveurs', on va créer une donnée sécurisée pour la clé d'API
        const securiserCleAPI = await this.creerObjetSecurise(idServeurFinal, cleAPI);
        if (BddError.isInstance(securiserCleAPI))
            return securiserCleAPI; // propage l'erreur
        
        try {
            const db = await SQLite.openDatabaseAsync(nomBDD);
        
            // On peut ajouter les informations de serveur
            const result = await db.runAsync(`
                INSERT INTO serveurs (id_nom_serveur, nom_serveur_affiche, adresse)
                VALUES (?, ?, ?)
                `,
                idServeurFinal, idNomServeur, adresse
            );
        
            if (result && result.changes > 0) {
                return true;
            }

            // Si erreur, on supprime la clé d'API
            await this.supprimerObjetSecurise(idServeurFinal);
            return new BddError(TypesBddError.Developpement, "Erreur de mise à jour de la BDD.");   
        }
        catch(e) {
            await this.supprimerObjetSecurise(idServeurFinal);
            return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD.");
        }
    }

    /**
     * Récupère la liste des serveurs depuis la table 'serveurs'
     * @returns {Promise<DonneesServeur[] | BddError>} Un tableau d'objets de type `DonneesServeur`, qui donnent les informations d'un serveurs, ou une erreur `BddError` sinon
     */
    public static async obtenirListeServeursDepuisTableServeurs(): Promise<DonneesServeur[] | BddError> {
        try {
            const db = await SQLite.openDatabaseAsync(nomBDD);

            // const result = await db.getAllAsync(`
            //     SELECT id_serveur, id_nom_serveur, nom_serveur_affiche, adresse FROM serveurs
            // `);
            const result = await db.getAllAsync(`
                SELECT * FROM serveurs
            `);

            // On parse le résultat, dans un tableau de type 'DonneesServeur'
            const tableauServeurs: DonneesServeur[] = [];

            // Pour chaque ligne de 'result', on ajoute les informations de serveur
            for (const row of result) {
                if (row && typeof row === 'object' && 
                    'id_serveur' in row && typeof row.id_serveur === "number"
                    && 'id_nom_serveur' in row && typeof row.id_nom_serveur === "string" 
                    && 'nom_serveur_affiche' in row && typeof row.nom_serveur_affiche === "string" 
                    && 'adresse' in row && typeof row.adresse === "string"
                ) {
                    var nouveauObjetServeur = {id_serveur: row.id_serveur, id_nom_serveur: row.id_nom_serveur, nom_serveur_affiche: row.nom_serveur_affiche, adresse: row.adresse};
                    tableauServeurs.push(nouveauObjetServeur);
                }
            }
            return tableauServeurs;
        }
        catch(e) {
            return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD.");
        }
    }
    /**
     * Supprime toutes les clés d'API. On ne peut pas juste réinitialiser la BDD qui contient les clés d'API, il faut les supprimer une par une.
     * @returns {Promise<true | BddError>} `true` si les suppressions se sont bien réalisées, `false` sinon
     */
    protected static async supprimerToutesLesClesAPI(): Promise<true | BddError> {
        try {
            const db = await SQLite.openDatabaseAsync(nomBDD);

            const rowList = await db.getAllAsync(`
                SELECT id_nom_serveur FROM serveurs 
            `);

            // On parse le résultat dans un tableau de strings (plus facile à manipuler)
            const tabNomsServeurs: string[] = [];
            if (rowList) {
                for (const row of rowList) {
                    if (row && typeof row === "object" && "id_nom_serveur" in row 
                        && row.id_nom_serveur && typeof row.id_nom_serveur === "string")
                        tabNomsServeurs.push(row.id_nom_serveur);
                }
            }

            for (const idNomServeur of tabNomsServeurs) {
                var result = await this.supprimerObjetSecurise(idNomServeur);
                if (BddError.isInstance(result))
                    return result; // propage l'erreur
            }

            return true;

        } catch(e) {
            return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD.");
        }
    }

    /**
     * Réinitialise la table 'serveurs' (supprime toutes les lignes de la table)
     * @returns {boolean} `true` si l'opération s'est bien réalisée, `false` sinon
     */
    public static async reinitialiserTableServeurs(): Promise<boolean | BddError> {
        // On commence par supprimer toutes les clés d'API
        const supprClesAPI = await this.supprimerToutesLesClesAPI();
        if (BddError.isInstance(supprClesAPI))
            return supprClesAPI; // propage l'erreur 

        try {
            const db = await SQLite.openDatabaseAsync(nomBDD);

            const result = await db.runAsync(`
                DELETE FROM serveurs
            `);

            if (result)
                return true;
            // On peut ne rien supprimer, par exemple si la table est déjà vide. 
            // Donc ce n'est pas pertinent de vérifier la suppression par le nombre de lignes affectées.
            return new BddError(TypesBddError.Developpement, "Erreur lors de la suppression des éléments de la BDD.");
        }
        catch(e) {
            return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD.");
        }
    }

    /**
     * Modifie le nom d'affiche du serveur.
     * @param {string} idNomServeur L'ID du serveur (une chaîne de caractères)
     * @param {string} nouveauNom Le nouveau nom d'affiche du serveur
     * @returns {Promise<true | BddError>} `true` si la modification s'est bien réalisée, ou une erreur `BddError` sinon
     */
    public static async modifierNomServeur(idNomServeur: string, nouveauNom: string): Promise<true | BddError> {
        try {
            const db = await SQLite.openDatabaseAsync(nomBDD);

            const result = await db.runAsync(`
                UPDATE serveurs SET nom_serveur_affiche = ? WHERE id_nom_serveur = ?
            `, nouveauNom, idNomServeur);

            if (result && result.changes > 0)
                return true;
            return new BddError(TypesBddError.ParametreIncompatible, "L'ID de serveur passé en paramètre n'existe pas dans la BDD.");
        }
        catch(e) {
            return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD.");
        }
    }


    /**
     * Modifie l'adresse du serveur.
     * @param {string} idNomServeur L'ID du serveur (une chaîne de caractères)
     * @param {string} nouvelleAdresse La nouvelle adresse du serveur
     * @returns {Promise<true | BddError>} `true` si la modification s'est bien réalisée, ou une erreur `BddError` sinon
     */
    public static async modifierAdresseServeur(idNomServeur: string, nouvelleAdresse: string): Promise<true | BddError> {
        // On commence par vérifier que la nouvelle adresse n'existe pas déjà dans la BDD
        const verifAdresse = this.verifierAdresseNonExistante(nouvelleAdresse);
        if (BddError.isInstance(verifAdresse))
            return verifAdresse; // propagation de l'erreur
        
        try {
            const db = await SQLite.openDatabaseAsync(nomBDD);

            const result = await db.runAsync(`
                UPDATE serveurs SET adresse = ? WHERE id_nom_serveur = ?    
            `, nouvelleAdresse, idNomServeur);

            if (result && result.changes > 0)
                return true;
            return new BddError(TypesBddError.ParametreIncompatible, "L'ID de serveur passé en paramètre n'existe pas dans la BDD.");
        }
        catch(e) {
            return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD.");
        }
    }

    /**
     * Supprime un serveur de la table 'serveurs'
     * @param {string} idNomServeur L'ID du serveur à supprimer (une chaîne de caractères)
     * @returns {Promise<true | BddError>} `true` si la suppression s'est bien réalisée, ou une erreur `BddError` sinon
     */
    public static async supprimerServeur(idNomServeur: string): Promise<true | BddError> {
        // On supprime d'abord la clé d'API associée au serveur
        const supprCleAPI = await this.supprimerObjetSecurise(idNomServeur);
        if (BddError.isInstance(supprCleAPI))
            return supprCleAPI; // propage l'erreur

        try {
            const db = await SQLite.openDatabaseAsync(nomBDD);

            const result = await db.runAsync(`
                DELETE FROM serveurs WHERE id_nom_serveur = ?    
            `, idNomServeur);

            if (result && result.changes > 0)
                return true;
            return new BddError(TypesBddError.ParametreIncompatible, "L'ID de serveur passé en paramètre n'existe pas dans la BDD.");
        }
        catch(e) {
            return new BddError(TypesBddError.Developpement, "Erreur lors de l'accès à la BDD.");
        }
    }

    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    ////////// Gestion des clés d'API pour chaque serveur
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

    /**
     * Crée une clé correcte pour Secure Store : elle ne doit contenir que des caractères alphanumérique, ou '.', '_' et '-'
     * @param {string} cle La clé à corriger
     * @returns {string} La clé corrigée, les caractères invalides étant remplacés par un caractère alphanumérique au hasard
     */
    protected static obtenirCleCorrecte(cle: string): string {
        // Une clé n'est acceptée (dans Secure Store) que s'il contient des caractères alphanumérique, ou '.', '_' et '-' 
        const regex = /[^A-Za-z0-9._-]/g;

        const getRandomAlphanumeric = () => {
            const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-";
            const randomIndex = Math.floor(Math.random() * characters.length);
            return characters.charAt(randomIndex);
        }
        const nouvelleCle = cle.replace(regex, getRandomAlphanumeric);
        return nouvelleCle;
    }

    /**
     * Crée une donnée sécurisée, à l'aide de sa clé et de sa valeur.
     * @param {string} cle Identifiant unique nécessaire pour accéder à la valeur
     * @param {string} valeur La valeur à sauvegarder
     * @returns {Promise<true | BddError>} `true` si l'opération s'est bien réalisée, une erreur `BddError` sinon
     */
    protected static async creerObjetSecurise(cle: string, valeur: string): Promise<true | BddError> {
        try {
            const get = await SecureStore.getItemAsync(cle);
            if (get)
                return new BddError(TypesBddError.ObjetSecuriseDejaExistant, "Impossible de créer une donnée sécurisée, la clé est déjà utilisée.");
            
            const result = await SecureStore.setItemAsync(cle, valeur);
            return true;

        } catch(e) {
            return new BddError(TypesBddError.ObjetSecuriseErreur, "Erreur lors de l'accès à la BDD sécurisée.");
        }
    }

    /**
     * Supprime une donnée sécurisée à partir de sa clé
     * @param {string} cle La clé de la donnée à supprimer
     * @returns {Promise<true | BddError>} `true` si l'opération s'est bien réalisée, une erreur `BddError` sinon
     */
    public static async supprimerObjetSecurise(cle: string): Promise<true | BddError> {
        try {
            const result = await SecureStore.deleteItemAsync(cle);
            // On ne s'intéresse pas à confirmer qu'il existait bien un objet à la clé donnée.
            return true;

        } catch(e) {
            return new BddError(TypesBddError.ObjetSecuriseErreur, "Erreur lors de l'accès à la BDD sécurisée.");
        }
    }

    /**
     * Modifie une donnée sécurisée à partir de sa clé. La nouvelle valeur ne doit pas être vide (car cela est équivalent à supprimer).
     * @param {string} cle La clé de la donnée à modifier
     * @param {string} nouvelleValeur La nouvelle valeur à associer à la clé. Ne doit pas être une chaîne de caractères vide.
     * @returns {Promise<true | BddError>} `true` si l'opération s'est bien réalisée, une erreur `BddError` sinon
     */
    public static async modifierObjetSecurise(cle: string, nouvelleValeur: string): Promise<true | BddError> {
        if (nouvelleValeur.trim() === "")
            return new BddError(TypesBddError.ParametreIncompatible, "On ne peut pas changer la clé d'API par une chaîne vide.");
        
        try {
            const result = await SecureStore.setItemAsync(cle, nouvelleValeur);
            return true;
            // On peut 'modifier' une valeur même s'il n'y a rien à la clé donnée
        
        } catch(e) {
            return new BddError(TypesBddError.ObjetSecuriseErreur, "Erreur lors de l'accès à la BDD sécurisée.");
        }
    }

    /**
     * Récupère une donnée sécurisée à l'aide de sa clé
     * @param {string} cle La clé de la donnée sécurisée
     * @returns {Promise<string | BddError>} La valeur associée à la clé (un `string`), ou une erreur `BddError` sinon
     */
    public static async obtenirObjetSecurise(cle: string): Promise<string | BddError> {
        try {
            const valeur = await SecureStore.getItemAsync(cle);
            if (valeur)
                return valeur;
            return new BddError(TypesBddError.ObjetSecuriseNonExistant, "Impossible de récupérer une donnée sécurisée non existante.")
        } catch(e) {
            return new BddError(TypesBddError.ObjetSecuriseErreur, "Erreur lors de l'accès à la BDD sécurisée.");
        }
    }

}