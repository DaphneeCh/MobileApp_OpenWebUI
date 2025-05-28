import { CacheMaxCharacterSize } from "./cacheMaxCharacterSize";
import { ListeConversations, ConversationInfos } from "@/types/dataTypes";
import { BddError, TypesBddError } from "@/classes/BddError";
import { Parsers } from "@/requetesServeur/outils/serverObjectParsers";

const TAILLE_MAX_NB_CAR_CACHE_LISTE_CONV = 250000; // 250 000
const TAILLE_MAX_NB_CAR_CACHE_CONTENU_CONV = 2000000; // 2 000 000

/** Cache pour l'application */
export class CacheApp {
    public cacheListeConversations: CacheMaxCharacterSize;
    public cacheContenuConversations: CacheMaxCharacterSize;

    /**
     * Cache pour l'application.
     * @param maxCharSizeCacheListeConversations Le taille maximale du cache pour les listes de conversations (en nombre de caractères)
     * @param maxCharSizeCacheContenuConversations La taille maximale du cache pour les conversations (en nombre de caractères)
     * @param backend Une solution d'enregistrement : 'AsyncStorage' ou 'MemoryStore' marchent
     */
    constructor(maxCharSizeCacheListeConversations: number, maxCharSizeCacheContenuConversations: number, backend: any) {
        var maxCharCache1 = maxCharSizeCacheListeConversations;
        maxCharCache1 = (0 <= maxCharCache1 && maxCharCache1 <= TAILLE_MAX_NB_CAR_CACHE_LISTE_CONV)?
            maxCharCache1 : TAILLE_MAX_NB_CAR_CACHE_LISTE_CONV;

        this.cacheListeConversations = new CacheMaxCharacterSize({
            namespace: "cacheListeConversations",
            policy: {
                maxEntries: 20,
                stdTTL: 3000000 // 3 millions de secondes : environ 34 jours
            },
            backend: backend
        },
            maxCharCache1 // 500 000 caractères total max
        );

        var maxCharCache2 = maxCharSizeCacheContenuConversations;
        maxCharCache2 = (0 <= maxCharCache2 && maxCharCache2 <= TAILLE_MAX_NB_CAR_CACHE_CONTENU_CONV)?
            maxCharCache2 : TAILLE_MAX_NB_CAR_CACHE_CONTENU_CONV;

        this.cacheContenuConversations = new CacheMaxCharacterSize({
            namespace: "cacheContenuConversations",
            policy: {
                maxEntries: 100,
                stdTTL: 3000000
            },
            backend: backend
        },
            maxCharCache2 // 4 millions de caractères total max
        );
    };

    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    //// CACHE pour les listes de conversations
    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    
    /**
     * Ajoute une liste de conversations dans le cache
     * @param {string} idServeur L'ID du serveur, qui sert de clé
     * @param {ListeConversations} listeConversations La liste de conversations à mettre dans le cache
     */
    public async ajouterListeConversationsDansCache(idServeur: string, listeConversations: ListeConversations): Promise<void> {
        // [ajoute / met à jour] la liste des conversations d'un serveur dans le cache, à chaque appel de cette fonction 
        // -> màj : quand on récupère la liste des serveurs, quand on crée / modifie / supprime une conversation
    
        await this.cacheListeConversations.set(idServeur, JSON.stringify(listeConversations.data) );
        // c'est bien le sous-objet '.data' qu'il faut insérer dans le cache
    }
    
    /**
     * Récupère une liste de conversations dans le cache. Cela réinitialise sa position dans la file LRU (Least Recently Used) du cache.
     * @param idServeur L'ID du serveur concerné, qui sert de clé
     * @returns {Promise<ListeConversations | null>} La liste de conversations du serveur telle que sauvegardée dans le cache, ou `null` si cela n'existe pas dans le cache.
     */
    public async getListeConversationsDansCache(idServeur: string): Promise<ListeConversations | null> {
        // récupère une liste de conversations depuis le cache
        // à utiliser quand on sélectionne un serveur, mais que l'état du réseau ne permet pas de récupérer la liste des conversations depuis le serveur
    
        var value = await this.cacheListeConversations.get(idServeur);
        if (!value)
            return null;
        
        value = JSON.parse(value);
        const parsedListeConversations = Parsers.parseListeConversations(value);
        if (parsedListeConversations) {
            parsedListeConversations.cache = true; // on lui ajoute l'attribut 'cache' pour signaler que cette donnée provient du cache

            //On ajoute l'attribut 'cache' aux conversations qui sont disponibles dans le cache
            for (const conversation of parsedListeConversations.data) {
                const cle = this.getCleConversationPartitionnee(idServeur, conversation.id);
                if (await this.cacheContenuConversations.hasKey(cle))
                    conversation.cache = true;
            }
        }

        return parsedListeConversations;
    }
    
    /**
     * Supprime une liste de conversations dans le cache. Supprime aussi les conversations dans le cache qui sont associées au même serveur.
     * @param idServeur L'ID du serveur dont on veut supprimer la liste des conversations du cache
     */
    public async supprimerListeConversationsDansCache(idServeur: string): Promise<void> {
        // à utiliser quand on supprime un serveur de la liste des serveurs
    
        await this.cacheListeConversations.remove(idServeur);
    
        // supprime aussi les conversations du serveur associé
        const allConversations = await this.cacheContenuConversations.getAll();
        const listeClesASupprimer = Object.keys(allConversations).filter((value) => value.startsWith(idServeur));
        for (const cle of listeClesASupprimer) {
            await this.cacheContenuConversations.remove(cle);
        }
    }
    
    
    
    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    //// CACHE pour les contenus de conversations
    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    
    /**
     * Ajoute une conversation et son contenu dans le cache.
     * @param {string} idServeur L'ID du serveur qui contient la conversation
     * @param {ConversationInfos} conversation La conversation à mettre dans le cache
     */
    public async ajouterConversationDansCache(idServeur: string, conversation: ConversationInfos): Promise<void> {
        // [ajoute / met à jour] une conversation dans le cache
        // -> màj : quand on récupère la conversation, quand on ajoute / modifie / supprime un message de la conversation
    
        // On met dans le cache une version réduite de la conversation (sans les messages qui ne font pas partie de la branche principale)
        const conversationReduite = CacheApp.minimiserConversation(conversation);
        const clePartitionnee = this.getCleConversationPartitionnee(idServeur, conversation.id);
        await this.cacheContenuConversations.set(clePartitionnee, JSON.stringify(conversationReduite) );
    }
    
    /**
     * Récupère une conversation dans le cache. Cela réinitialise sa position dans la file LRU (Least Recently Used) du cache.
     * @param {string} idServeur L'ID du serveur contenant la conversation
     * @param {string} idConversation L'ID de la conversation
     * @returns {Promise<ConversationInfos | null>} La conversation telle que sauvegardée dans le cache, ou `null` si cela n'existe pas dans le cache. 
     */
    public async getConversationDansCache(idServeur: string, idConversation: string): Promise<ConversationInfos | null> {
        // récupère une conversation et son contenu depuis le cache
        // à utiliser quand on sélectionne une conversation dans la liste des conversation, mais que l'état du réseau ne permet pas de récupérer la conversation depuis le serveur
    
        const clePartitionnee = this.getCleConversationPartitionnee(idServeur, idConversation);
        var value = await this.cacheContenuConversations.get(clePartitionnee);
        if (!value)
            return null;

        value = JSON.parse(value);
        const parsedConversation = Parsers.parseConversation(value, true);
        if (parsedConversation)
            parsedConversation.cache = true; // on ajouter cet attribut 'cache' pour signaler que cette donnée provient du cache
        return parsedConversation;
    }
    
    /**
     * Supprime une conversation dans le cache.
     * @param idServeur L'ID du serveur qui contient la conversation
     * @param idConversation L'ID de la conversation à supprimer du cache
     */
    public async supprimerConversationDansCache(idServeur: string, idConversation: string): Promise<void> {
        // à utiliser quand on supprime une conversation d'un serveur
    
        const clePartitionnee = this.getCleConversationPartitionnee(idServeur, idConversation);
        await this.cacheContenuConversations.remove(clePartitionnee);
    }
    
    /**
     * Crée une clé pour une conversation, qui combine l'ID du serveur et l'ID de conversation. Cela permet d'unifier la méthode de génération de cette clé.
     * @param {string} idServeur L'ID du serveur
     * @param {string} idConversation L'ID de la conversation
     * @returns {string} La clé combinée : idServeur + '_' + idConversation
     */
    protected getCleConversationPartitionnee(idServeur: string, idConversation: string): string {
        return idServeur + "_" + idConversation;
    }

    // Vide le cache
    public async viderCache(): Promise<void> {
        await this.cacheListeConversations.clearAll();
        await this.cacheContenuConversations.clearAll();
    }

    public async getTailleTotaleActuelle(): Promise<number> {
        const tailleActuelleCacheListeConversations = await this.cacheListeConversations.getCurrentTotalCharacterSize();
        const tailleActuelleCacheContenuConversations = await this.cacheContenuConversations.getCurrentTotalCharacterSize();
        return tailleActuelleCacheListeConversations + tailleActuelleCacheContenuConversations;
    }
    
    
    
    
    
    /**
     * Réduit une conversation au minimum : supprime les messages qui ne sont pas sur la branche principale de la conversation.
     * En effet, pour la première version de l'application mobile, nous ne nous intéressons pas aux autres branches que la branche principale de la conversation.
     * @param {ConversationInfos} conversation Une conversation et ses messages
     * @returns {ConversationInfos | BddError} La conversation après réduction, ou une erreur `BddError` si la conversation donnée a un problème dans sa conception.
     */
    public static minimiserConversation(conversation: ConversationInfos): ConversationInfos | BddError {
        if (!conversation.chat)
            return conversation;
    
        // On commence par récupérer la liste des IDs des messages qui sont dans la branche de base
        const listeIDsMsgBranchePrincipale: string[] = [];
        var currentId = conversation.chat.history.currentId;
    
        var boucle = false;
        while (currentId != null && !boucle) {
            listeIDsMsgBranchePrincipale.push(currentId);
            currentId = conversation.chat?.history.messages[currentId].parentId;
    
            if (currentId && listeIDsMsgBranchePrincipale.includes(currentId))
                boucle = true;
        }
        if (boucle)
            return new BddError(TypesBddError.ParametreIncompatible, "La conversation donnée a une boucle dans ses messages.");
    
        // Puis on supprime tous les messages qui ne sont pas dans cette branche
        // On supprime aussi les références dans 'childrenIds'
        if (conversation.chat) {
            const listeIds = Object.keys(conversation.chat.history.messages);
            for (const idMsg of listeIds) {
                if (! listeIDsMsgBranchePrincipale.includes(idMsg))
                    delete conversation.chat.history.messages[idMsg]; // supprime le message
                else {
                    const nouveauTab = conversation.chat.history.messages[idMsg].childrenIds.filter((id) => listeIDsMsgBranchePrincipale.includes(id));
                    conversation.chat.history.messages[idMsg].childrenIds = nouveauTab; // supprime les références aux messages supprimés dans 'childrenIds'
                }
            }
        }
    
        return conversation;
    }


    
}