
import { RequetesBasiques } from "../requetesServeur/requetesBasiques";
import { Parsers } from "../requetesServeur/outils/serverObjectParsers";
import { ModifierConversationBrute, ObjetConversationBrute } from "./outils/modificationObjetConversationBrute";

import { FetchError, TypesFetchError } from "../classes/FetchError";
import { ChatInfos, ConversationInfos, ReponseLLM, MessageDemande, MessageReponse } from "../types/dataTypes";

import 'react-native-get-random-values';
import { genererUUID } from "../outils/fonctionsOutils";

/**
 * Requêtes basiques + gestion conversation.
 * Il s'agit d'ajouter les fonctionnalités :
 * - créer une conversation
 * - modifier une conversation
 *      - modifier le titre de la conversation
 *      - modifier un message de la conversation
 *      - ajouter un message en fin de conversation
 *      - supprimer un message dans la conversation
 * - supprimer une conversation
 * @extends RequetesBasiques
 */
export class RequetesGestionConversation extends RequetesBasiques {

    /**
     * Crée une conversation à partir d'un début de chat (requête utilisateur et réponse du LLM)
     * @param {string} adresseWeb L'adresse web du site
     * @param {string} cleAPI La clé d'API de l'utilisateur pour ce serveur
     * @param {string} titreConversation Le titre de la conversation
     * @param {ChatInfos} debutChat Les informations de chat, telles quelles au début de cette nouvelle conversation
     * @returns {Promise<ConversationInfos | FetchError>} Un objet `ConversationInfos` (qui contient l'ID de la nouvelle conversation), ou une erreur `FetchError`
     */
    public static async creerConversation(adresseWeb: string, cleAPI: string, titreConversation: string, debutChat: ChatInfos): Promise<ConversationInfos | FetchError> {
        const url = adresseWeb + '/api/v1/chats/new';
        const init = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${cleAPI}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "chat": {
                    "title": titreConversation,
                    "history": debutChat.history,
                    "params": debutChat.params
                }
            })
        }

        const resultat = await this.modeleFetch(url, init);

        if (FetchError.isInstance(resultat))
            return resultat;

        const parsedResultat = Parsers.parseConversation(resultat, true);

        if (parsedResultat)
            return parsedResultat;
        return new FetchError(TypesFetchError.Developpement, "L'objet récupéré ne correspond pas à ce qui était attendu.")
    }

    /**
     * Modifie une conversation, selon la nouvelle representation donnée
     * @param {string} adresseWeb L'adresse web du site
     * @param {string} cleAPI La clé d'API de l'utilisateur pour ce serveur
     * @param {string} idConversation L'ID de la conversation à modifier
     * @param {ConversationInfos | ObjetConversationBrute | object} nouvelleConversationInfos Le nouvel état de la conversation après modification (ou juste les éléments à modifier)
     * @returns {Promise<ConversationInfos | FetchError>} Un objet `ConversationInfos`, ou une erreur `FetchError`
     */
    public static async modifierConversation(adresseWeb: string, cleAPI: string, idConversation: string, nouvelleConversationInfos: ConversationInfos | ObjetConversationBrute | object): Promise<ConversationInfos | FetchError> {
        const url = adresseWeb + '/api/v1/chats/' + idConversation;
        const init = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${cleAPI}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nouvelleConversationInfos)
        }

        const resultat = await this.modeleFetch(url, init);

        if (FetchError.isInstance(resultat))
            return resultat;

        const parsedResultat = Parsers.parseConversation(resultat, true);

        if (parsedResultat)
            return parsedResultat;
        return new FetchError(TypesFetchError.Developpement, "L'objet récupéré ne correspond pas à ce qui était attendu.")
    }

    /**
     * Modifie le titre de la conversation donnée
     * @param {string} adresseWeb L'adresse web du site
     * @param {string} cleAPI La clé d'API de l'utilisateur pour ce serveur
     * @param {string} idConversation L'ID de la conversation dont on veut modifier le titre
     * @param {string} nouveauTitre Le nouveau titre souhaité
     * @returns {Promise<ConversationInfos | FetchError>} Un objet `ConversationInfos`, ou une erreur `FetchError`
     */
    public static async modifierConversationTitre(adresseWeb: string, cleAPI: string, idConversation: string, nouveauTitre: string): Promise<ConversationInfos | FetchError> {
        const conversation = {
            chat: {
                title: nouveauTitre
            }
        }

        const resultat = await this.modifierConversation(adresseWeb, cleAPI, idConversation, conversation);
        return resultat;
    }

    /**
     * Modifie un message de la conversation, et met à jour la conversation sur le serveur
     * @param {string} adresseWeb L'adresse web du serveur d'inférence
     * @param {string} cleAPI La clé d'API de l'utilisateur pour le serveur
     * @param {string} idConversation L'ID de la conversation dont on veut modifier un message
     * @param {string} idMessage L'ID du message à modifier
     * @param {string} nouveauTexteMessage Le nouveau texte de message, qui remplace le précédent
     * @returns {ConversationInfos | FetchError} Un objet `ConversationInfos` (la conversation après modification du message), ou une erreur `FetchError`
     */
    public static async modifierConversationMessage(adresseWeb: string, cleAPI: string, idConversation: string, idMessage: string, nouveauTexteMessage: string): Promise<ConversationInfos | FetchError> {
        // On commence par récupérer la conversation brute (telle que renvoyée par le serveur)
        const conversation = await ModifierConversationBrute.obtenirConversationBrute(adresseWeb, cleAPI, idConversation);
        if (FetchError.isInstance(conversation))
            return conversation; // propage l'erreur

        // On modifie directement dans la conversation brute
        const nouveauObjetConversation = ModifierConversationBrute.modifierMessageDansObjetConversationBrute(conversation, idMessage, nouveauTexteMessage);
        if (FetchError.isInstance(nouveauObjetConversation))
            return nouveauObjetConversation; // propage l'erreur

        const resultat = await this.modifierConversation(adresseWeb, cleAPI, idConversation, nouveauObjetConversation);
        return resultat;
    }

    /**
     * Ajoute une demande utilisateur et la réponse associée, à la fin d'une conversation donnée.
     * @param {string} adresseWeb L'adresse web du site
     * @param {string} cleAPI La clé d'API de l'utilisateur du serveur
     * @param {string} idConversation L'ID de la conversation
     * @param {string} demandeTexte La demande de l'utilisateur (une requête à un LLM)
     * @param {ReponseLLM} reponse La réponse du LLM, sous la forme d'un objet `ReponseLLM`
     * @returns {Promise<ConversationInfos | FetchError>} Un objet `ConversationInfos` (la conversation après ajout des messages), ou une erreur `FetchError`
     */
    public static async ajouterMessagesEnFinDeConversation(adresseWeb: string, cleAPI: string, idConversation: string, demandeTexte: string, reponse: ReponseLLM): Promise<ConversationInfos | FetchError> {
        const conversation = await ModifierConversationBrute.obtenirConversationBrute(adresseWeb, cleAPI, idConversation);
        if (FetchError.isInstance(conversation))
            return conversation;

        // On commence par décider des IDs des deux messages à ajouter
        // Par sécurité, on récupère la liste des identifiants des messages de la conversation (car on ne veut surtout pas d'identifiant doublon)
        const listeIDs = ModifierConversationBrute.obtenirIdentifiantsDesMessagesDeConversation(conversation);
        if (FetchError.isInstance(listeIDs))
            return listeIDs; // propage l'erreur

        const idDemande = genererUUID(listeIDs);
        if (typeof idDemande === "string")
            listeIDs.push(idDemande); // On ajoute le dernier ID créé dans la liste des identifiants dont on ne veut pas de doublons
        const idReponse = genererUUID(listeIDs);

        if (typeof idDemande === "boolean" || typeof idReponse === "boolean")
            return new FetchError(TypesFetchError.Developpement, "Erreur de création d'ID pour un message");

        // Avant de créer les objets finaux des messages, on a besoin de l'ID du dernier message de conversation
        //  (car ce sera l'ID du "père" de l'objet 'demandeFinale')
        const idParent = ModifierConversationBrute.obtenirIdentifiantDuDernierMessage(conversation);
        if (FetchError.isInstance(idParent))
            return idParent; // propage l'erreur

        // On peut créer les objets finaux de messages
        const demandeFinale: MessageDemande = {
            id: idDemande,
            parentId: idParent,
            childrenIds: [idReponse],
            role: 'user',
            content: demandeTexte
        };
        const reponseFinale: MessageReponse = {
            id: idReponse,
            parentId: idDemande,
            childrenIds: [],
            role: 'assistant',
            content: reponse.content,
            model: reponse.model,
            modelName: reponse.model
        }
        if (reponse.timestamp)
            reponseFinale.timestamp = reponse.timestamp;
        if (reponse.usage)
            reponseFinale.usage = reponse.usage;

        // On peut enfin créer un objet de conversation modifié, avec les nouveaux messages intégrés
        const nouveauObjetConversation = ModifierConversationBrute.ajouterMessagesDansObjetConversationBrute(conversation, demandeFinale, reponseFinale);
        if (FetchError.isInstance(nouveauObjetConversation))
            return nouveauObjetConversation; // propage l'erreur

        // Finalement, on envoie au serveur l'objet de conversation après ajout des messages
        const resultat = await this.modifierConversation(adresseWeb, cleAPI, idConversation, nouveauObjetConversation);
        return resultat;
    }


    /**
     * Supprime le message désigné dans la conversation (et d'autres qui sont impliqués avec ce message)
     * @param {string} adresseWeb L'adresse web du serveur d'inférence
     * @param {string} cleAPI La clé d'API de l'utilisateur pour le serveur
     * @param {string} idConversation L'ID de la conversation dont on veut supprimer des messages
     * @param {string} idMessageASupprimer L'ID du message à supprimer
     * @returns {Promise<ConversationInfos | FetchError>} Un objet `ConversationInfos` (la conversation après suppression du ou des messages), ou une erreur `FetchError`
     */
    public static async supprimerMessageDansConversation(adresseWeb: string, cleAPI: string, idConversation: string, idMessageASupprimer: string): Promise<ConversationInfos | FetchError> {
        const conversationBrute = await ModifierConversationBrute.obtenirConversationBrute(adresseWeb, cleAPI, idConversation);
        if (FetchError.isInstance(conversationBrute))
            return conversationBrute; // propage l'erreur

        // On modifie directement dans la conversation brute
        const objConvApresSuppression = ModifierConversationBrute.supprimerMessageDansObjetConversationBrute(conversationBrute, idMessageASupprimer);
        if (FetchError.isInstance(objConvApresSuppression))
            return objConvApresSuppression;

        const resultat = await this.modifierConversation(adresseWeb, cleAPI, idConversation, objConvApresSuppression);
        return resultat;
    }

    /**
     * Supprime la conversation donnée par son ID
     * @param {string} adresseWeb L'adresse web du site
     * @param {string} cleAPI La clé d'API de l'utilisateur du serveur
     * @param {string} idConversation L'ID de la conversation à supprimer
     * @returns {Promise<true | FetchError>} `true` si l'opération a réussi, sinon une erreur `FetchError`
     */
    public static async supprimerConversation(adresseWeb: string, cleAPI: string, idConversation: string): Promise<true | FetchError> {
        const url = adresseWeb + '/api/v1/chats/' + idConversation;
        const init = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${cleAPI}`,
                'Accept': 'application/json'
            }
        }

        const resultat = await this.modeleFetch(url, init);
        if (FetchError.isInstance(resultat)) 
            return resultat;
        return true;
    }

}


