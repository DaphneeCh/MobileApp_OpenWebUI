import { ChatInfos} from "../types/dataTypes";
import { FetchError, TypesFetchError } from "../classes/FetchError";
import { RequetesGestionConversation } from "./requetesGestionConversation";
import { RequetesBasiques } from "./requetesBasiques";

/**
 * Requêtes de base + gestion conversation + requêtes annexes
 * @extends RequetesBasiques
 * @extends RequetesGestionConversation
 */
export class RequetesAnnexes extends RequetesGestionConversation {

    /**
     * Récupère une clé d'API, à partir des identifiants de connexion
     * @param {string} adresseWeb L'adresse web du serveur
     * @param {string} identifiant Une adresse mail normalement
     * @param {string} mdp Le mot de passe associé à l'identifiant
     * @returns {Promise<string | FetchError>} La clé d'API (de type `string`), ou une erreur `FetchError`
     */
    public static async seConnecterEtObtenirCleAPI(adresseWeb:string, identifiant: string, mdp: string): Promise<string | FetchError> {
        var url = adresseWeb + "/api/v1/auths/signin";
        if (!url.startsWith("http://") && !url.startsWith("https://"))
            url = "http://" + url; // le protocole est nécessaire dans l'URL

        var init = {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                'email': identifiant,
                'password': mdp
            })
        };

        try {
            const reponse = await fetch(url, init);
            if(!reponse.ok) {
                if (reponse.status===400)
                    return new FetchError(TypesFetchError.Utilisateur, "L'identifiant et/ou le mot de passe sont invalides."); // La réponse HTTP 400 (Bad Request) est spécifiquement en cas d'erreur dans les identifiants
                return new FetchError(TypesFetchError.Developpement, "Erreur de développement ou de serveur.");
            }
            const objetReponse = await reponse.json();
            // Le message de validation de connexion doit avoir une clé à l'attribut 'token'
            if (objetReponse && typeof objetReponse === "object"
                && "token" in objetReponse && objetReponse.token && typeof objetReponse.token === "string"
            ) {
                return objetReponse.token;
            }
            return new FetchError(TypesFetchError.Developpement, "L'objet reçu ne correspond pas à ce qui est attendu.");
        }
        catch(e) {
            return new FetchError(TypesFetchError.Reseau, "Une erreur est survenue avec le réseau");
        }
    }

    /**
     * Propose un titre pour une conversation donnée. Ce titre est généré par un LLM.
     * *NOTE : le LLM ne retourne pas forcément un titre en respectant les règles données*
     * @param {string} adresseWeb L'adresse web du serveur
     * @param {string} cleAPI La clé d'API de l'utilisateur pour ce serveur
     * @param {string} idModele L'ID du LLM à interroger, pour générer un titre
     * @param {ChatInfos} chat Le chat dont on veut un titre
     * @returns {Promise<string | FetchError>} Un titre pour le chat (de type `string`), ou une erreur `FetchError`
     */
    public static async genererTitreConversation(adresseWeb: string, cleAPI: string, idModele: string, chat: ChatInfos): Promise<string | FetchError> {
        // On récupère les deux derniers messages de la conversation
        const stringConversation = this.creerUniqueStringDesDeuxDerniersMessagesDeLaConversation(chat);

        // Le prompt suivant est basé sur le prompt par défaut pour générer un titre sur Open Web-UI
        // sources : https://github.com/open-webui/open-webui/discussions/9910#discussioncomment-12188896
        //           https://github.com/open-webui/open-webui/blob/f916fbba56ed894a5f627c71aabdc0e656fa4f23/backend/open_webui/config.py#L1105
        const prompt = "### Task:\n"
            +"Generate a concise, 3-5 word title with an emoji summarizing the chat history in json format. The title must be in the language of the conversation.\n"
            +"### Guidelines:\n"
            +"- The title should clearly represent the main theme or subject of the conversation.\n"
            +"- Use emojis that enhance understanding of the topic, but avoid quotation marks or special formatting.\n"
            +"- The main emoji is before the text of the title\n"
            +"- Write the title in the chat's primary language; default to English if multilingual.\n"
            +"- Prioritize accuracy over excessive creativity; keep it clear and simple.\n"
            +"### Output JSON Format:\n"
            +"{ 'title': 'your concise title with emoji here' }\n"
            +"### Examples:\n"
            +"{ 'title': '📉 Stock Market Trends' },\n"
            +"{ 'title': '🍪 Perfect Chocolate Chip Recipe' },\n"
            +"{ 'title': 'Evolution of Music Streaming' },\n"
            +"{ 'title': 'Remote Work Productivity Tips' },\n"
            +"{ 'title': 'Artificial Intelligence in Healthcare' },\n"
            +"{ 'title': '🎮 Video Game Development Insights' }\n"
            +"### Conversation History:\n"
            +stringConversation

        // On a un chat vide (car on n'a pas besoin d'informations de la conversation)
        const infosChat: ChatInfos = {
            params: {},
            history: {
                messages: {},
                currentId: null
            }
        }

        const resultat = await RequetesBasiques.envoyerRequete(adresseWeb, cleAPI, idModele, prompt, infosChat);
        if (FetchError.isInstance(resultat))
            return resultat; // propage l'erreur

        // regex pour identifier un substring du genre :
        //          { 'title' : '...' }
        const regex = /{[ ]*['"]title['"][ ]*:[ ]*['"].*['"][ ]*}/;
        const jsonTitre = resultat.content.match(regex)

        // Tente d'analyser la chaîne JSON si elle est trouvée dans la réponse
        let parsedTitle = null;
        try {
            if (jsonTitre && jsonTitre[0]) {
                // Nettoie la chaîne JSON avant l'analyse
                const cleanJson = jsonTitre[0]
                    .replace(/[']/g, '"') // Remplace les guillemets simples par des guillemets doubles pour un JSON valide
                    .replace(/(\w+):/g, '"$1":'); // Assure que les noms de propriétés sont entre guillemets doubles

                parsedTitle = JSON.parse(cleanJson);
            }
        } catch (error) {
            console.error("Échec de l'analyse du JSON du titre:", error);
        }

        // Si nous avons analysé le JSON avec succès et qu'il possède une propriété titre, on l'utilise
        if (parsedTitle && parsedTitle.title) {
            return parsedTitle.title;
        }


        return new FetchError(TypesFetchError.ObjetIncompatible, "Le LLM a répondu avec un objet incompatible.");
    }

    /**
     * Retourne le contenu des deux derniers messages d'un chat, dans un seul string
     * @param {ChatInfos} chat Le chat dont on veut les deux derniers messages
     * @returns {string} Un string contenant les deux derniers messages du chat
     */
    protected static creerUniqueStringDesDeuxDerniersMessagesDeLaConversation(chat: ChatInfos): string {
        var totalMessages = "";

        // On récupère les deux derniers messages de la conversation, dans un unique string
        const idDernierMessage = chat.history.currentId;
        var idAvantDernierMessage: string | null = null;

        // D'abord le dernier message
        if (idDernierMessage && chat.history.messages[idDernierMessage]) {
            totalMessages = chat.history.messages[idDernierMessage].content + "\n" + totalMessages;
            idAvantDernierMessage = chat.history.messages[idDernierMessage].parentId;
        }

        // Puis l'avant-dernier message
        if (idAvantDernierMessage && chat.history.messages[idAvantDernierMessage]) {
            totalMessages = chat.history.messages[idAvantDernierMessage].content + "\n" + totalMessages;
        }

        return totalMessages;
    }

    /**
     * Confirme ou non que l'option "web search" ou "recherche web" est utilisable sur le serveur, et l'utilisateur a le droit de l'utiliser
     * @param {string} adresseWeb L'adresse web du serveur
     * @param {string} cleAPI La clé d'API de l'utilisateur pour ce serveur
     * @returns {Promise<boolean | FetchError>} `true` si l'utilisateur peut utiliser l'option Web Search, `false` sinon, ou retourne une erreur `FetchError`
     */
    public static async verifierOptionRechercheWebUtilisable(adresseWeb: string, cleAPI: string): Promise<boolean | FetchError> {
        // Vérification en 2 temps :
        //    - d'abord on vérifie que l'option "recherche web" est activée sur le serveur
        //    - puis on vérifie que l'option "recherche web" est autorisée pour l'utilisateur

        // Tout d'abord, vérifions que l'option "recherche web" est activée sur le serveur
        var url = adresseWeb + '/api/v1/retrieval/config'; // lien pour 'Get Rag Config'
        var init = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cleAPI}`
            }
        }

        var resultat = await this.modeleFetch(url, init);

        if (FetchError.isInstance(resultat))
            return resultat; // propage l'erreur

        if (resultat && typeof resultat === "object"
            && "web" in resultat && resultat.web && typeof resultat.web === "object"
            && "search" in resultat.web && resultat.web.search && typeof resultat.web.search === "object"
            && "enabled" in resultat.web.search && typeof resultat.web.search.enabled === "boolean"
        ) {
            if (resultat.web.search.enabled === false)
                return false;
        }
        else
            return new FetchError(TypesFetchError.Developpement, "L'objet récupéré ne correspond pas à ce qui était attendu.");

        // Ensuite, on vérifie que l'option "recherche web" est autorisée pour l'utilisateur
        url = adresseWeb + '/api/v1/users/default/permissions'; // lien pour 'Get User Permissions'
        init = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cleAPI}`
            }
        }

        resultat = await this.modeleFetch(url, init);

        if (FetchError.isInstance(resultat))
            return resultat; // propage l'erreur

        if (resultat && typeof resultat === "object"
            && "features" in resultat && resultat.features && typeof resultat.features === "object"
            && "web_search" in resultat.features && typeof resultat.features.web_search
        ) {
            return (resultat.features.web_search === true);
        }

        return new FetchError(TypesFetchError.Developpement, "L'objet récupéré ne correspond pas à ce qui était attendu.");
    }

}

