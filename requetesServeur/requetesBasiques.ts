import { FetchError, TypesFetchError } from "../classes/FetchError";
import { ListeModeles, ListeConversations, ChatInfos, ConversationInfos, BodyRequeteLLM, MiniMessage, ReponseLLM, RequeteFeatures } from "../types/dataTypes";
import { Parsers } from "./outils/serverObjectParsers";

/**
 * Requêtes de base
 */
export class RequetesBasiques {

    /**
     * Réalise une opération Fetch, vers l'URL et selon les paramètres donnés
     * @param {string} url L'URL vers lequel envoyer la requête
     * @param {object} init Les paramètres de la requête
     * @returns {Promise<unknown | FetchError>} Un objet de la forme JSON correspondant à la réponse du serveur, ou un FetchError
     */
    public static async modeleFetch(url: string, init: object) : Promise<unknown | FetchError> {
        if (!url.startsWith("http://") && !url.startsWith("https://"))
            url = "http://" + url; // le protocole est nécessaire dans l'URL

        try {
            const reponse = await fetch(url, init);
            if (!reponse.ok) {
                if (reponse.status == 401 || reponse.status == 403){
                    // Code de statut HTTP 401 (Unauthorized) ou 403 (Forbidden)
                    return new FetchError(TypesFetchError.Utilisateur, "La clé d'authentification est peut-être invalide.")
                }
                return new FetchError(TypesFetchError.Developpement, "Erreur de développement ou de serveur");
                // Exemples de code de statut HTTP : 400 (Bad Request) ou 405 (Method Not Allowed)
                // Cependant, le code 400 est parfois renvoyé avec un texte affirmant plutôt l'erreur 500 (Internal Server Error)
                // (p. ex. Ollama n'est pas à jour, et ne supporte pas un modèle de langage récent)
            }
            return reponse.json(); // réussite

        } catch(e) {
            return new FetchError(TypesFetchError.Reseau, "Une erreur est survenue avec le réseau");
        }
    }

    /**
     * Récupère la liste des modèles de langage accessibles par l'utilisateur sur le serveur
     * @param {string} adresseWeb L'adresse du site web
     * @param {string} cleAPI La clé d'API de l'utilisateur pour ce serveur
     * @returns {Promise<ListeModeles | FetchError>} Un objet ListeModeles, décrivant les modèles de langage, ou un FetchError
     */
    public static async obtenirListeModeles(adresseWeb: string, cleAPI: string): Promise<ListeModeles | FetchError>{
        const url: string = adresseWeb + '/api/models';
        const init = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cleAPI}`
            }
        }

        const resultat = await this.modeleFetch(url, init);

        if (FetchError.isInstance(resultat))
            return resultat;

        // On 'parse' le résultat, pour obtenir un objet clair et typé
        const parsedResultat = Parsers.parseListeModeles(resultat);

        if (parsedResultat)
            return parsedResultat;
        return new FetchError(TypesFetchError.Developpement, "L'objet récupéré ne correspond pas à ce qui était attendu.");
    }

    /**
     * Récupère la liste des conversations de l'utilisateur sur le serveur
     * @param {string} adresseWeb L'adresse web du site
     * @param {string} cleAPI La clé d'API de l'utilisateur pour ce serveur
     * @returns {Promise<ListeConversations | FetchError>} Un objet ListeConversations, ou un FetchError
     */
    public static async obtenirListeConversations(adresseWeb: string, cleAPI: string): Promise<ListeConversations | FetchError>{
        const url = adresseWeb + "/api/v1/chats/list";
        const init = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cleAPI}`
            }
        }

        const resultat = await this.modeleFetch(url, init);

        if (FetchError.isInstance(resultat))
            return resultat;

        // On 'parse' le résultat, pour obtenir un objet clair et typé
        const parsedResultat = Parsers.parseListeConversations(resultat);

        if (parsedResultat)
            return parsedResultat;
        return new FetchError(TypesFetchError.Developpement, "L'objet récupéré ne correspond pas à ce qui était attendu.");
    }

    /**
     * Récupère la conversation, ses messages, et ses derniers paramètres de connexion
     * @param {string} adresseWeb L'adresse web du site
     * @param {string} cleAPI La clé d'API de l'utilisateur pour ce serveur
     * @param {string} idConversation L'ID de la conversation souhaitée sur ce serveur
     * @returns {Promise<ConversationInfos | FetchError>} Un objet ConversationInfos, ou une erreur FetchError
     */
    public static async obtenirConversationEtSonContenu(adresseWeb: string, cleAPI: string, idConversation: string): Promise<ConversationInfos | FetchError> {
        const url = adresseWeb + "/api/v1/chats/" + idConversation;
        const init = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cleAPI}`
            }
        }

        const resultat = await this.modeleFetch(url, init);

        if (FetchError.isInstance(resultat))
            return resultat;

        // On 'parse' le résultat, pour obtenir un objet clair et typé
        const parsedResultat = Parsers.parseConversation(resultat, true);

        if (parsedResultat)
            return parsedResultat;
        return new FetchError(TypesFetchError.Developpement, "L'objet récupéré ne correspond pas à ce qui était attendu.")
    }

    /**
     * Génère l'objet `BodyRequeteLLM` nécessaire pour envoyer une demande à un LLM
     * @param {string} idModele ID du modèle de langage désigné
     * @param {string} texteNouvelleRequete Texte de la demande au LLM
     * @param {ChatInfos} chatInfos Les informations du chat : les anciens messages (s'ils existent)
     * @param {RequeteFeatures} features Les caractéristiques de la requête : si l'on veut utiliser la fonctionnalité web search, etc.
     * @returns {BodyRequeteLLM} Un objet `BodyRequeteLLM`
     */
    protected static genererBodyRequeteLLM(idModele: string, texteNouvelleRequete: string, chatInfos: ChatInfos, features?: RequeteFeatures): BodyRequeteLLM {
        const bodyRequete: BodyRequeteLLM = {
            messages: [],
            model: idModele,
            params: chatInfos.params,
            features: features
        }

        // On insère les objets MiniMessage dans le sens inverse, puis on inverse le tableau
        // D'abord le nouveau message (il doit être à la fin)
        const msgNouvelleRequete: MiniMessage = { content: texteNouvelleRequete, role: 'user' };
        bodyRequete.messages.push(msgNouvelleRequete);

        // Puis chacun des messages de la conversation (on les récupère depuis le dernier, et on remonte)
        var idParent = chatInfos.history.currentId;
        while (idParent != null) {
            var msgAncien: MiniMessage = {
                content: chatInfos.history.messages[`${idParent}`].content,
                role: chatInfos.history.messages[`${idParent}`].role
            };
            bodyRequete.messages.push(msgAncien);
            idParent = chatInfos.history.messages[`${idParent}`].parentId;
        }

        // Et enfin le prompt système, au tout début
        if (chatInfos.params.system){
            const msgPromptSysteme: MiniMessage = { content: chatInfos.params.system, role: 'system'};
            bodyRequete.messages.push(msgPromptSysteme);
        }

        bodyRequete.messages.reverse();

        return bodyRequete;
    }

    /**
     * Envoie une requête à un LLM du serveur, et récupère sa réponse
     * @param {string} adresseWeb L'adresse web du site
     * @param {string} cleAPI La clé d'API de l'utilisateur pour ce serveur
     * @param {string} idModele L'ID du modèle de langage à qui on adresse la requête
     * @param {string} texteRequete Le texte de la requête au LLM
     * @param {ChatInfos} chatInfos Les informations du chat / conversation (même si c'est une nouvelle conversation)
     * @param {RequeteFeatures} features Les caractéristiques de la requête : si l'on veut utiliser la fonctionnalité web search, etc.
     * @returns {Promise<ReponseLLM | FetchError>} Un objet `ReponseLLM`, ou une erreur `FetchError`
     */
    public static async envoyerRequete(adresseWeb: string, cleAPI: string, idModele: string, texteRequete: string, chatInfos: ChatInfos, features?: RequeteFeatures): Promise<ReponseLLM | FetchError>{
        const url = adresseWeb + '/api/chat/completions';
        const bodyRequete = this.genererBodyRequeteLLM(idModele, texteRequete, chatInfos, features);

        const init = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${cleAPI}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyRequete)
        }

        const resultat = await this.modeleFetch(url, init);

        if (FetchError.isInstance(resultat))
            return resultat;

        // On 'parse' le résultat, pour obtenir un objet clair et typé
        const date = Math.floor(Date.now()/1000);
        const reponseLLM = Parsers.parseReponseLLM(resultat, date);

        if (reponseLLM)
            return reponseLLM;
        return new FetchError(TypesFetchError.Developpement, "L'objet récupéré ne correspond pas à ce qui était attendu.")
    }
}