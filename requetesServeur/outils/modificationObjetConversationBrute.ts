import { FetchError, TypesFetchError } from "@/classes/FetchError";
import { MessageDemande, MessageReponse } from "@/types/dataTypes";
import { RequetesBasiques } from "../requetesBasiques";

/** Type pour reconnaître une conversation brute */
export type ObjetConversationBrute = { }

/**
 * Il s'agit de renvoyer au serveur Open WebUI des informations de conversation modifiées.
 * Les informations de conversation stockées par un serveur Open WebUI sont plus larges que ce que nous avons besoin pour cette application mobile.
 * Ainsi, si l'on essaie de modifier une conversation côté serveur à partir des informations de l'application mobile, alors il y a perte d'informations (par exemple les statistiques de LLM).
 * La solution est de récupérer un objet conversation brute, telle que renvoyée par le serveur Open WebUI, et de le modifier directement.
 * La démarche est un peu délicate, car on modifie un objet 'inconnu' (unknown) pour TypeScript, et nous ne pouvons pas le 'parser' en un type connu (car il y a beaucoup d'informations qui sont inutiles pour l'application mobile).
 * 
 * Dans ce module se trouvent plusieurs fonctions :
 *    - obtenirConversationBrute()
 *    - obtenirIdentifiantsDesMessagesDeConversation()
 *    - obtenirIdentifiantDuDernierMessage()
 *    - ajouterMessagesDansObjetConversationBrute()
 *    - modifierMessageDansObjetConversationBrute()
 *    - supprimerMessageDansObjetConversationBrute()
 */
export class ModifierConversationBrute {

    /**
     * Récupère l'objet brut (sans transformation) donné par le serveur concernant une conversation.
     * Cela permet de mettre à jour une conversation proprement, car nous n'avons délibéremment pas sauvegardé sur l'application certaines informations.
     * En effet, certaines informations sont utilisées sur Open WebUI, mais pas sur cette application. 
     * @param {string} adresseWeb L'adresse web du serveur d'inférence
     * @param {string} cleAPI La clé d'API de l'utilisateur pour ce serveur
     * @param {string} idConversation L'ID de la conversation à récupérer de manière brute
     * @returns {Promise<ObjetConversationBrute | FetchError>} Un objet de conversation brute (on ne s'intéresse pas à 'parser' immédiatement l'objet de type inconnu), ou une erreur `FetchError`
     */
    public static async obtenirConversationBrute(adresseWeb: string, cleAPI: string, idConversation: string): Promise<ObjetConversationBrute | FetchError> {
        const url = adresseWeb + "/api/v1/chats/" + idConversation;
        const init = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cleAPI}`
            }
        }

        const resultat = await RequetesBasiques.modeleFetch(url, init);
        if (FetchError.isInstance(resultat))
            return resultat;

        if (resultat && typeof resultat === "object") {
            const objetConvBrute: ObjetConversationBrute = resultat;
            return objetConvBrute;
        }

        return new FetchError(TypesFetchError.Developpement, "L'objet ne correspond pas à ce qui est attendu");
    }

    /**
     * Permet de récupérer la liste des identifiants de messages d'une conversation (utile pour générer des nouveaux identifiants différents)
     * @param {ObjetConversationBrute} objetConv Un objet censé représenter une conversation brute (telle que renvoyée par la fonction 'obtenirConversationBrute')
     * @returns {string[] | FetchError} La liste des identifiants de conversation (qui sont de type `string`), ou une erreur `FetchError`
     */
    public static obtenirIdentifiantsDesMessagesDeConversation(objetConv: ObjetConversationBrute): string[] | FetchError {
        // Une liste des identifiants des messages peut être obtenue,
        //     en récupérant la liste des clés de 'objetConv.chat.history.messages'
        if (objetConv && typeof objetConv === "object" 
            && "chat" in objetConv && typeof objetConv.chat === "object" && objetConv.chat 
            && "history" in objetConv.chat && typeof objetConv.chat.history === "object" && objetConv.chat.history 
            && "messages" in objetConv.chat.history && typeof objetConv.chat.history.messages === "object" && objetConv.chat.history.messages
        ) {
            const listeIDs = Object.keys(objetConv.chat.history.messages); // les clés sont les IDs des messages de la conversation
            return listeIDs;
        }

        return new FetchError(TypesFetchError.ObjetIncompatible, "L'objet ne correspond pas à ce qui est attendu");
    }

    /**
     * Donne l'ID du dernier message affiché (en bout de conversation), dans une conversation brute
     * @param {string} objetConv Un objet censé représenter une conversation brute (telle que renvoyée par la fonction 'obtenirConversationBrute')
     * @returns {string | FetchError} L'ID du dernier message affiché de la conversation (un `string`), ou une erreur `FetchError`
     */
    public static obtenirIdentifiantDuDernierMessage(objetConv : ObjetConversationBrute): string | FetchError {
        // L'identifiant du dernier message de la conversation
        //      se trouve à 'objetConv.chat.history.currentId'
        if (objetConv && typeof objetConv === "object" 
            && "chat" in objetConv && typeof objetConv.chat === "object" && objetConv.chat 
            && "history" in objetConv.chat && typeof objetConv.chat.history === "object" && objetConv.chat.history 
            && "currentId" in objetConv.chat.history && typeof objetConv.chat.history.currentId === "string" && objetConv.chat.history.currentId
        ) {
            return objetConv.chat.history.currentId;
        }

        return new FetchError(TypesFetchError.ObjetIncompatible, "L'objet ne correspond pas à ce qui est attendu");
    }

    /**
     * Modifie un objet donné, censé représenter une conversation, et ajoute les informations de nouveaux messages
     * @param {ObjetConversationBrute} objet L'objet à modifier, censé représenter une conversation
     * @param {MessageDemande} demande La demande, de type `MessageDemande`
     * @param {MessageReponse} reponse La réponse, de type `MessageReponse`
     * @returns {ObjetConversationBrute | FetchError} L'objet de départ, avec les nouveaux messages ajoutés, ou une erreur `FetchError`
     */
    public static ajouterMessagesDansObjetConversationBrute(objet: ObjetConversationBrute, demande: MessageDemande, reponse: MessageReponse): ObjetConversationBrute | FetchError {
        /*
        Il faut vérifier :
            - il existe objet.chat, de type "object"
            - il existe objet.chat.history, de type "object"
                - il existe objet.chat.history.messages, de type "object"
                - il existe objet.chat.history.currentId, de type "string"
            - optionnel : il existe objet.chat.messages, de type "array"
        Si toutes ces conditions sont réunies, on peut modifier l'objet
        (il faut aussi vérifier qu'il existe bien un objet d'ID 'currentId' dans objet.chat.history.messages, 
            et qu'on peut modifier son attribut 'childrenIds')
        */
        
        if (objet && "chat" in objet && typeof objet.chat === "object" && objet.chat 
            && "history" in objet.chat && typeof objet.chat.history === "object" && objet.chat.history 
            && "messages" in objet.chat.history && typeof objet.chat.history.messages === "object" && objet.chat.history.messages
            && "currentId" in objet.chat.history && typeof objet.chat.history.currentId === "string" && objet.chat.history.currentId
        ) {

            // On récupère les IDs nécessaires
            const idParent = objet.chat.history.currentId;

            const idDemande = demande.id;
            const idReponse = reponse.id;
            if (idDemande === idReponse)
                return new FetchError(TypesFetchError.IdInvalide, "Les IDs des messages de demande et réponse ne doivent pas être les mêmes.");

            // On copie la liste des messages dans un objet plus pratique à manipuler
            //  En effet, sans cela TypeScript est très capricieux sur les attributs d'objet dynamiques
            type LooseObject = {
                [id: string]: object;
            }

            var listeMsg: LooseObject = {};

            Object.values(objet.chat.history.messages).forEach( element => {
                if (element && typeof element === "object" && "id" in element && element.id && typeof element.id === "string")
                    listeMsg[element.id] = element;
            });
            // De cette manière, modifier 'listeMsg' modifie directement l'objet 'objet.chat.history.messages' (car 'listeMsg' lui fait référence, ce n'est pas une copie)


            // On complète les champs / les relations
            demande.parentId = idParent;
            demande.childrenIds.push(idReponse);
            reponse.parentId = idDemande;
        
            // On ajoute 'idDemande' aux enfants du dernier message de la conversation
            if (listeMsg[idParent] && "childrenIds" in listeMsg[idParent] && Array.isArray(listeMsg[idParent].childrenIds))
                listeMsg[idParent].childrenIds.push(idDemande);
            else
                return new FetchError(TypesFetchError.ObjetIncompatible, "L'algorithme ne trouve pas le message de fin de conversation.");

            listeMsg[idDemande] = demande;
            listeMsg[idReponse] = reponse;

            // On peut recopier proprement l'objet modifié, avec ses derniers ajouts
            objet.chat.history.messages = listeMsg;
        
            // On change l'attribut 'currentId' avec l'ID du dernier élément (la réponse)
            objet.chat.history.currentId = idReponse;

            // On modifie l'attribut 'chat.messages' (qui est un tableau d'objets correspondant aux messages, dans l'ordre de succession) :
            if ("messages" in objet.chat && Array.isArray(objet.chat.messages)) {
                // D'abord on modifie l'élément d'id 'idParent', afin de rajouter parmi ses enfants 'idDemande'
                Object.values(objet.chat.messages).some( element => {
                    if (element && "id" in element && element.id === idParent && "childrenIds" in element && Array.isArray(element.childrenIds)) {
                        element.childrenIds.push(idDemande);
                        return true;
                    }
                });
                // Puis on ajoute à la fin de 'chat.messages', les objets 'demande' et 'reponse'
                objet.chat.messages.push(demande);
                objet.chat.messages.push(reponse);
            }

            return objet;
        }
        return new FetchError(TypesFetchError.ObjetIncompatible, "L'objet ne correspond pas à ce qui est attendu");
    }

    /**
     * Modifie un objet donné, censé représenter une conversation, et modifie le texte du message souhaité
     * @param {ObjetConversationBrute} objet L'objet à modifier, censé représenter une conversation
     * @param {string} idMessage L'ID du message à modifier
     * @param {string} nouveauTexteMessage Le nouveau texte de message, qui doit remplacer l'ancien
     * @returns {ObjetConversationBrute | FetchError} L'objet de départ, avec le contenu du message souhaité modifié, ou une erreur `FetchError`
     */
    public static modifierMessageDansObjetConversationBrute(objet: ObjetConversationBrute, idMessage: string, nouveauTexteMessage: string): ObjetConversationBrute | FetchError {
        /*
        Il faut vérifier :
            - il existe objet.chat, de type "object"
            - il existe objet.chat.history, de type "object"
                - il existe objet.chat.history.messages, de type "object"
            - optionnel : il existe objet.chat.messages, de type "array"
        Si toutes ces conditions sont réunies, on peut modifier l'objet
        */
        
        if (objet && "chat" in objet && typeof objet.chat === "object" && objet.chat 
            && "history" in objet.chat && typeof objet.chat.history === "object" && objet.chat.history 
            && "messages" in objet.chat.history && typeof objet.chat.history.messages === "object" && objet.chat.history.messages
        ) {
            // Il s'agit de modifier le texte du message, à la fois dans 'chat.history.messages' et dans 'chat.messages'

            // D'abord dans 'chat.history.messages' :
            const trouve = Object.values(objet.chat.history.messages).some( element => {

                // On ne modifie que l'objet d'ID donné
                if (element && typeof element === "object"
                    && "id" in element && element.id && typeof element.id === "string"
                    && element.id === idMessage
                    && "content" in element && element.content && typeof element.content === "string"
                ) {
                    element.content = nouveauTexteMessage;
                    return true;
                }
            });
            if (!trouve)
                return new FetchError(TypesFetchError.ObjetInexistant, "L'objet à modifier, dont l'ID est donné, n'existe pas.");

            // Puis dans 'chat.messages' (optionnel) :
            if ("messages" in objet.chat && Array.isArray(objet.chat.messages)) {
                objet.chat.messages.some( element => {

                    // On ne modifie que l'objet d'ID donné
                    if (element && typeof element === "object"
                        && "id" in element && element.id && typeof element.id === "string"
                        && element.id === idMessage
                        && "content" in element && element.content && typeof element.content === "string"
                    ) {
                        element.content = nouveauTexteMessage;
                        return true;
                    }
                });
            }

            return objet;
        }
        return new FetchError(TypesFetchError.ObjetIncompatible, "L'objet ne correspond pas à ce qui est attendu");
    }


    /**
     * Modifie un objet donné, censé représenter une conversation, afin de supprimer le message indiqué (et d'autres impliqués)
     * - Si le message à supprimer est une requête utilisateur, supprime aussi les messages de réponse à cette requête
     * - Attention : on ne peut pas supprimer le message à la tête de la conversation
     * - Attention : on ne peut pas désigner à la suppression un message de réponse (c'est possible sur Open WebUI lorsqu'il y a plusieurs réponses à une même requête, mais on n'en tient pas compte dans cette application mobile)
     * @param {ObjetConversationBrute} objet L'objet à modifier, censé représenter une conversation
     * @param {string} idMessageASupprimer L'ID du message à modifier
     * @returns {ObjetConversationBrute | FetchError} L'objet de départ, avec le message souhaité supprimé (et d'autres impliqués), ou une erreur `FetchError`
     */
    public static supprimerMessageDansObjetConversationBrute(objet: ObjetConversationBrute, idMessageASupprimer: string): ObjetConversationBrute | FetchError {
        /*
        Il faut vérifier :
            - il existe objet.chat, de type "object"
            - il existe objet.chat.history, de type "object"
                - il existe objet.chat.history.messages, de type "object"
                - il existe objet.chat.history.currentId, de type "string"
            - il existe objet.chat.messages, de type "array"
        Si toutes ces conditions sont réunies, on peut modifier l'objet
        */

        if (objet && "chat" in objet && typeof objet.chat === "object" && objet.chat 
            && "history" in objet.chat && typeof objet.chat.history === "object" && objet.chat.history 
            && "messages" in objet.chat.history && typeof objet.chat.history.messages === "object" && objet.chat.history.messages
            && "currentId" in objet.chat.history && typeof objet.chat.history.currentId === "string" && objet.chat.history.currentId
        ) {

            // On copie la liste des messages dans un objet plus pratique à manipuler
            //  En effet, sans cela TypeScript est très capricieux sur les attributs d'objet dynamiques
            type LooseObject = {
                [id: string]: object;
            }

            var listeMsg: LooseObject = {};

            Object.values(objet.chat.history.messages).forEach( element => {
                if (element && typeof element === "object" && "id" in element && element.id && typeof element.id === "string")
                    listeMsg[element.id] = element;
            });
            // De cette manière, modifier 'listeMsg' modifie directement l'objet 'objet.chat.history.messages' (car 'listeMsg' lui fait référence, ce n'est pas une copie)

            
            // On commence par préparer 'idParent' et 'listeElementsASupprimer
            var idParent: string | undefined;
            const listeElementsASupprimer = [idMessageASupprimer];

            const objMsgASuppr = listeMsg[idMessageASupprimer];

            if (objMsgASuppr && "parentId" in objMsgASuppr && objMsgASuppr.parentId === null) // Le message de tête de conversation a son attribut 'parentId' qui vaut 'null'
                return new FetchError(TypesFetchError.IdInvalide, "On ne peut pas supprimer le message de tête de conversation.");
            if (objMsgASuppr && "role" in objMsgASuppr && objMsgASuppr.role && typeof objMsgASuppr.role === "string" && objMsgASuppr.role === "assistant")
                return new FetchError(TypesFetchError.IdInvalide, "On ne peut pas supprimer un message de réponse (dans cette version de l'application).");

            if (objMsgASuppr && "id" in objMsgASuppr && objMsgASuppr.id && typeof objMsgASuppr.id === "string"
                && "parentId" in objMsgASuppr && objMsgASuppr.parentId && typeof objMsgASuppr.parentId === "string"
                && "childrenIds" in objMsgASuppr && objMsgASuppr.childrenIds && Array.isArray(objMsgASuppr.childrenIds)
            ) {
                idParent = objMsgASuppr.parentId;
                objMsgASuppr.childrenIds.forEach( (element: string) => {
                    listeElementsASupprimer.push(element);
                });
            }
            else {
                return new FetchError(TypesFetchError.ObjetInexistant, "Le message d'ID donné n'existe pas, ou ne correspond pas à ce qui est attendu");
            }

            // On prépare la liste des petits-enfants du message à supprimer
            const listePetitsEnfants: string[] = [];
            const listeEnfantsDuMsgASuppr = listeElementsASupprimer.filter(element => element != idMessageASupprimer);

            listeEnfantsDuMsgASuppr.forEach( element => {
                const objMsg = listeMsg[element];

                if (objMsg && "childrenIds" in objMsg && objMsg.childrenIds && Array.isArray(objMsg.childrenIds)) {
                    objMsg.childrenIds.forEach( (id: string) => {
                        if (id && typeof id === "string" && !listePetitsEnfants.includes(id))
                            listePetitsEnfants.push(id);
                    });
                }
            });

            // Pour chaque message d'ID dans 'listePetitsEnfants', on lui attribue comme parent 'idParent'
            listePetitsEnfants.forEach( element => {
                const objMsg = listeMsg[element];

                if (objMsg && "parentId" in objMsg && objMsg.parentId && typeof objMsg.parentId === "string")
                    objMsg.parentId = idParent;
            });

            // Pour le message d'ID 'idParent' :
            //      - parmi ses enfants, on supprime l'ID du message à supprimer
            //      - on lui ajoute comme enfants les éléments de la liste d'IDs 'listePetitsEnfants'

            const msgParent = listeMsg[idParent];
            if (msgParent && "id" in msgParent && msgParent.id && typeof msgParent.id === "string"
                && "childrenIds" in msgParent && msgParent.childrenIds && Array.isArray(msgParent.childrenIds)
            ) {
                const indexMsgASuppr = msgParent.childrenIds.indexOf(idMessageASupprimer);
                if (indexMsgASuppr > -1)
                    msgParent.childrenIds.splice(indexMsgASuppr, 1); // supprime l'élément de la liste des enfants

                listePetitsEnfants.forEach( petitEnfant => {
                    if (Array.isArray(msgParent.childrenIds) && ! msgParent.childrenIds.includes(petitEnfant))
                        msgParent.childrenIds.push(petitEnfant);
                })
            }
            else {
                return new FetchError(TypesFetchError.ObjetIncompatible, "L'objet ne correspond pas à ce qui est attendu");
            }

            // On peut supprimer les messages dont les IDs sont dans 'listeElementsASupprimer'
            listeElementsASupprimer.forEach( id => {
                delete listeMsg[id];
                // Cette commande ne modifie que 'listeMsg' et pas 'objet.chat.history.messages' ...
            });
            objet.chat.history.messages = listeMsg; // ... donc il faut réassigner 

            // On cherche l'ID du message 'feuille' de l'arbre, et "le plus à droite" (dans chaque liste d'enfants).
            // On en profite pour recréer une liste des messages de la conversation, dans l'ordre depuis le message tête jusqu'au message "le plus à droite".
            const listeMessagesOrdonnes: object[] = [];

            var idTeteConversation: string | undefined;
            var idMessageSuivant: string | undefined;

            // On cherche le message en tête de conversation (son attribut 'parentId' vaut null)
            var trouve = Object.values(listeMsg).some( element => {
                if (element && "id" in element && element.id && typeof element.id === "string"
                    && "parentId" in element && element.parentId === null
                    && "childrenIds" in element && element.childrenIds && Array.isArray(element.childrenIds)
                ) {
                    idTeteConversation = element.id;
                    listeMessagesOrdonnes.push(element);
                    idMessageSuivant = element.childrenIds.slice(-1)[0]; // le dernier élément du tableau (l'enfant "le plus à droite")
                    return true;
                }
            });
            if (!trouve)
                return new FetchError(TypesFetchError.ObjetIncompatible, "L'algorithme n'a pas réussi à trouver le message de tête de conversation.");

            // Cherchons maintenant l'ID du message de fin (par défaut l'ID du message de tête de conversation)
            var idMessageDeFin: string | undefined = idTeteConversation;

            // S'il existe un message après le message de tête
            trouve = true;
            const tableauIDsBoucle: string[] = []; // tableau pour vérifier qu'il n'y a pas de boucle
            var boucle = false;

            while (idMessageSuivant && trouve && !boucle) {
                tableauIDsBoucle.push(idMessageSuivant);

                trouve = Object.values(listeMsg).some( element => {
                    if ("id" in element && element.id && typeof element.id === "string"
                        && element.id === idMessageSuivant
                        && "childrenIds" in element && element.childrenIds && Array.isArray(element.childrenIds)
                    ) {
                        idMessageSuivant = element.childrenIds.slice(-1)[0]; // le dernier élément du tableau (l'enfant "le plus à droite")
                        listeMessagesOrdonnes.push(element);

                        if (idMessageSuivant && tableauIDsBoucle.includes(idMessageSuivant))
                            boucle = true;
                        if (!idMessageSuivant)
                            idMessageDeFin = element.id;

                        return true;
                    }
                });
            }
            if (!trouve || typeof idMessageDeFin === "undefined")
                return new FetchError(TypesFetchError.ObjetIncompatible, "L'algorithme n'a pas trouvé le message de fin de conversation.");
            if (boucle)
                return new FetchError(TypesFetchError.Boucle, "L'algorithme est entré dans une boucle en cherchant le message de fin de conversation.");

            // On peut modifier l'attribut 'chat.history.currentId' (censé être l'ID du dernier message de la conversation)
            objet.chat.history.currentId = idMessageDeFin;

            // On peut modifier le tableau 'chat.messages' (qu'il existe ou non)
            Object.assign(objet.chat, {messages: listeMessagesOrdonnes});

            return objet;
        }
        return new FetchError(TypesFetchError.ObjetIncompatible, "L'objet ne correspond pas à ce qui est attendu");
    }

}