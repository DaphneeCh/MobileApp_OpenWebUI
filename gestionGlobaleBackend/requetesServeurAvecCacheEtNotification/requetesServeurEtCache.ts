import RequetesServeur from "@/requetesServeur";

import { FetchError, TypesFetchError } from "@/classes/FetchError";
import { ChatInfos, ConversationInfos, ListeConversations, ListeModeles, ReponseLLM, RequeteFeatures } from "@/types/dataTypes";

import { cache } from "@/bdd/cache";

/**
 * Combine les requêtes serveur avec des opérations sur le cache. 
 * Cela concerne les liste de conversations, et le contenu des conversations. 
 * Les opérations sont :
 *    - ajouter / mettre à jour des informations sur le cache (à chaque màj de l'objet via le serveur Open Web-UI)
 *    - récupérer des informations du cache (lorsque la connexion avec le serveur ne se fait pas)
 * 
 * @extends RequetesServeur
 */
export class RequetesServeurEtCache extends RequetesServeur {


    /**
     * - Comme cette méthode est aussi utilisée pour tester la connexion au serveur, on veut pouvoir signaler que l'objet retourné ne correspond pas à la réalité côté serveur.
     * - Pour cela, l'objet retourné peut avoir un attribut 'cache' (ce qui signifie qu'il y a un problème réseau).
     * @override
     * @inheritdoc
     */
    public static async obtenirListeModeles(adresseWeb: string, cleAPI: string): Promise<ListeModeles | FetchError> {
        const result = await super.obtenirListeModeles(adresseWeb, cleAPI);

        // Condition pour activer le cache
        if (FetchError.isInstance(result) && result.isType(TypesFetchError.Reseau)) {
            // Problèmes de réseau, on retourne une liste de modèles invalide
            const listeModelesErreurCache: ListeModeles = {
                data: [ {
                    id: "placeholder pas de connexion",
                    name: "... pas de connexion."
                }],
                horsLigne: true // pour signaler que la donnée est retournée alors qu'il y a un problème de connexion
            } 
            return listeModelesErreurCache;
        }

        if (FetchError.isInstance(result))
            return result; // propage l'erreur
        return result;
    }

    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //// Récupérer infos depuis serveur + màj cache
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    /**
     * @param {string} idServeur L'ID du serveur (pour pouvoir sauvegarder dans le cache)
     * @param {boolean} fromCache Spécifie s'il faut forcer à récupérer les données depuis le cache, sans essayer de tester le serveur
     * @override
     * @inheritdoc
     */
    public static async obtenirListeConversations(adresseWeb: string, cleAPI: string, idServeur?: string, fromCache?: boolean): Promise<ListeConversations | FetchError> {
        if (idServeur && fromCache){
            const listeConvDansCache = await cache.getListeConversationsDansCache(idServeur);
            return (listeConvDansCache)? listeConvDansCache : new FetchError(TypesFetchError.Developpement, "La liste des conversations n'est pas dans le cache.");
        }
        
        const result = await super.obtenirListeConversations(adresseWeb, cleAPI);
        
        // Condition pour devoir récupérer la liste de conversations depuis le cache
        if (FetchError.isInstance(result) && result.isType(TypesFetchError.Reseau) && idServeur){
            // Problèmes de réseau, on récupère la liste de conversations dans le cache
            const listeConvDansCache = await cache.getListeConversationsDansCache(idServeur);
            return (listeConvDansCache)? listeConvDansCache : result; // Si la liste de conversations existe dans le cache, on la retourne ; sinon on propage l'erreur
        }

        if (FetchError.isInstance(result)) 
            return result; // propage l'erreur

        if (idServeur)
            await cache.ajouterListeConversationsDansCache(idServeur, result); // ajout dans le cache
        return result;
    }

    /**
     * @param {string} idServeur L'ID du serveur (pour pouvoir sauvegarder dans le cache)
     * @override
     * @inheritdoc
     */
    public static async obtenirConversationEtSonContenu(adresseWeb: string, cleAPI: string, idConversation: string, idServeur?: string): Promise<ConversationInfos | FetchError> {
        const result = await super.obtenirConversationEtSonContenu(adresseWeb, cleAPI, idConversation);
        
        // Condition pour devoir récupérer la conversation depuis le cache
        if (FetchError.isInstance(result) && result.isType(TypesFetchError.Reseau) && idServeur) {
            // Problèmes de réseau, on récupère la conversation dans le cache
            const conversationDansCache = await cache.getConversationDansCache(idServeur, idConversation);
            return (conversationDansCache)? conversationDansCache : result; // Si la conversation existe dans le cache, on la retourne ; sinon on propage l'erreur
        }
        
        if (FetchError.isInstance(result))
            return result; // propage l'erreur

        if (idServeur)
            await cache.ajouterConversationDansCache(idServeur, result); // ajout dans le cache
        return result;
    }


    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //// Suppression d'une conversation du cache
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    /**
     * @param {string} idServeur L'ID du serveur (pour pouvoir sauvegarder dans le cache)
     * @override
     * @inheritdoc
     */
    public static async supprimerConversation(adresseWeb: string, cleAPI: string, idConversation: string, idServeur?: string): Promise<true | FetchError> {
        const result = await super.supprimerConversation(adresseWeb, cleAPI, idConversation);
        if (FetchError.isInstance(result))
            return result; // propage l'erreur

        // On peut supprimer la conversation du cache
        if (idServeur)
            await cache.supprimerConversationDansCache(idServeur, idConversation);
        return true;
    }


    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //// Màj cache uniquement
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    /**
     * @param {string} idServeur L'ID du serveur (pour pouvoir sauvegarder dans le cache)
     * @override
     * @inheritdoc
     */
    public static async creerConversation(adresseWeb: string, cleAPI: string, titreConversation: string, debutChat: ChatInfos, idServeur?: string): Promise<ConversationInfos | FetchError> {
        const result = await super.creerConversation(adresseWeb, cleAPI, titreConversation, debutChat);
        if (FetchError.isInstance(result))
            return result; // propage l'erreur

        if (idServeur)
            await cache.ajouterConversationDansCache(idServeur, result);
        return result;
    }

    /**
     * @param {string} idServeur L'ID du serveur (pour pouvoir sauvegarder dans le cache)
     * @override
     * @inheritdoc
     */
    public static async modifierConversationTitre(adresseWeb: string, cleAPI: string, idConversation: string, nouveauTitre: string, idServeur?: string): Promise<ConversationInfos | FetchError> {
        const result = await super.modifierConversationTitre(adresseWeb, cleAPI, idConversation, nouveauTitre);
        if (FetchError.isInstance(result))
            return result; // propage l'erreur

        if (idServeur)
            await cache.ajouterConversationDansCache(idServeur, result);
        return result;
    }

    /**
     * @param {string} idServeur L'ID du serveur (pour pouvoir sauvegarder dans le cache)
     * @override
     * @inheritdoc
     */
    public static async modifierConversationMessage(adresseWeb: string, cleAPI: string, idConversation: string, idMessage: string, nouveauTexteMessage: string, idServeur?: string): Promise<ConversationInfos | FetchError> {
        const result = await super.modifierConversationMessage(adresseWeb, cleAPI, idConversation, idMessage, nouveauTexteMessage);
        if (FetchError.isInstance(result))
            return result; // propage l'erreur

        if (idServeur)
            await cache.ajouterConversationDansCache(idServeur, result);
        return result;
    }

    /**
     * @param {string} idServeur L'ID du serveur (pour pouvoir sauvegarder dans le cache)
     * @override
     * @inheritdoc
     */
    public static async ajouterMessagesEnFinDeConversation(adresseWeb: string, cleAPI: string, idConversation: string, demandeTexte: string, reponse: ReponseLLM, idServeur?: string): Promise<ConversationInfos | FetchError> {
        const result = await super.ajouterMessagesEnFinDeConversation(adresseWeb, cleAPI, idConversation, demandeTexte, reponse);
        if (FetchError.isInstance(result))
            return result; // propage l'erreur

        if (idServeur)
            await cache.ajouterConversationDansCache(idServeur, result);
        return result;
    }

    /**
     * @param {string} idServeur L'ID du serveur (pour pouvoir sauvegarder dans le cache)
     * @override
     * @inheritdoc
     */
    public static async supprimerMessageDansConversation(adresseWeb: string, cleAPI: string, idConversation: string, idMessageASupprimer: string, idServeur?: string): Promise<ConversationInfos | FetchError> {
        const result = await super.supprimerMessageDansConversation(adresseWeb, cleAPI, idConversation, idMessageASupprimer);
        if (FetchError.isInstance(result))
            return result; // propage l'erreur

        if (idServeur)
            await cache.ajouterConversationDansCache(idServeur, result);
        return result;
    }

}