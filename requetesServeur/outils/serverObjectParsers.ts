
import { ConversationInfos, ParametresInfos, ListeMessages, MessageDemande, MessageReponse, ChatInfos, ReponseLLM, ListeModeles, ModeleInfos, ListeConversations } from "@/types/dataTypes";

/**
 * Fonctions pour 'parser' les réponses d'un serveur (généralement un objet, ou un tableau).
 * Permet d'obtenir les objets typés que l'on souhaite utiliser dans l'application.
 */
export class Parsers {

    /**
     * Un 'parser' pour déduire un objet `ModeleInfos`, à partir d'un objet censé représenter une liste de modèles de langages
     * @param {unknown} objet L'objet censé représenter une liste de modèles de langages
     * @returns {ListeModeles | null} Un objet `ModeleInfos`, ou `null` si cela ne correspond pas
     */
    public static parseListeModeles(objet: unknown): ListeModeles | null {
        if (objet && typeof objet === "object" && "data" in objet && Array.isArray(objet.data)) {
            const listeModeles: ListeModeles = { data: [] };
            // On crée un objet ListeModeles, contenant des sous-objets ModeleInfos

            objet.data.forEach( element => {
                if (element && typeof element === "object" && "id" in element && "name" in element){
                    const modele: ModeleInfos = {
                        id: element.id,
                        name: element.name
                    }
                    listeModeles.data.push(modele);
                }
            });
            return listeModeles;
        }
        return null;
    }

    /**
     * Un 'parser' pour déduire un objet `ListeConversations`, à partir d'un objet censé représenter une liste de conversations (seulement les informations de titre)
     * @param {unknown} objet L'objet censé représenter une liste de conversations (titres seulement)
     * @returns {ListeConversations | null} Un objet `ListeConversations`, ou `null` si cela ne correspond pas
     */
    public static parseListeConversations(objet: unknown): ListeConversations | null {
        if (Array.isArray(objet)) {
            const listeConversations: ListeConversations = { data: [] };
            // On crée un objet ListeConversations, contenant des sous-objets ConversationInfos

            objet.forEach( element => {
                if (element && typeof element === "object"
                    && "id" in element && typeof element.id === "string"
                    && "title" in element && typeof element.title === "string"
                    && "updated_at" in element && typeof element.updated_at === "number"
                    && "created_at" in element && typeof element.created_at === "number"
                ) {
                    const conversation: ConversationInfos = {
                        id: element.id,
                        title: element.title,
                        updated_at: element.updated_at,
                        created_at: element.created_at
                    }
                    listeConversations.data.push(conversation);
                }
            });
            return listeConversations;
        }
        return null;
    }


    ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////
    ////  Parser pour une conversation (et ses sous-fonctions)
    ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////

    /**
     * Un 'parser' pour déduire un objet `ConversationInfos`, à partir d'un objet censé représenter une conversation
     * @param {unknown} objet L'objet censé représenter la conversation
     * @param {boolean} chatIncluded Indique si l'on souhaite inclure la partie 'chat' de l'objet (`false` par défaut)
     * @returns {ConversationInfos | null} Un objet `ConversationInfos`, ou `null` si cela ne correspond pas
     */
    public static parseConversation(objet: unknown, chatIncluded: boolean = false): ConversationInfos | null {
        if (objet && typeof objet === 'object'
            && "id" in objet && typeof objet.id === "string"
            && "title" in objet && typeof objet.title === "string"
            && "updated_at" in objet && typeof objet.updated_at === "number"
            && "created_at" in objet && typeof objet.created_at === "number"
        ) {
            // Les informations de surface existent bien.
            const conversation: ConversationInfos = {
                id: objet.id,
                title: objet.title,
                updated_at: objet.updated_at,
                created_at: objet.created_at
            }
            if (!chatIncluded)
                return conversation; // pas besoin de continuer

            // On regarde s'il y a des informations dans 'chat'
            if ("chat" in objet && objet.chat && typeof objet.chat === "object") {
                const chatParsed = Parsers.parseChat(objet.chat);
                if (chatParsed)
                    conversation.chat = chatParsed;
                else
                    return null;
            }

            return conversation;
        }
        return null;
    }

    /**
     * Un 'parser' pour déduire un objet `ChatInfos` à partir d'un objet inconnu
     * @param {object} objet L'objet qui est censé contenir les informations de chat
     * @returns {ChatInfos | null} Un objet `ChatInfos`, ou `null` si cela ne correspond pas
     */
    public static parseChat(objet: object): ChatInfos | null {
        var parametres: ParametresInfos = {};

        // On regarde s'il y a des informations dans 'params'
        if ("params" in objet && objet.params && typeof objet.params === "object") {
            parametres = Parsers.parseParams(objet.params);
        }

        // On regarde s'il y a des informations dans 'history'
        if ("history" in objet && objet.history && typeof objet.history === "object"){
            
            // On vérifie qu'il y a les attributs 'messages' et 'currentId'
            if ("messages" in objet.history && objet.history.messages && typeof objet.history.messages === "object"
                && "currentId" in objet.history && objet.history.currentId && typeof objet.history.currentId === "string"
            ) {
                const listeMessages: ListeMessages = {};
        
                Object.values(objet.history.messages).forEach(element => {
        
                    // Pour chaque sous-objet, on vérifie qu'il représente bien un message conforme
                    // Attention, 'parentId' peut valoir 'null' !
                    if ("id" in element && element.id && typeof element.id === "string"
                        && "parentId" in element
                        && "childrenIds" in element && element.childrenIds && Array.isArray(element.childrenIds)
                        && "role" in element && element.role && typeof element.role === 'string'
                        && "content" in element && element.content && typeof element.content === "string"
                    ) {
                        // Le type de message (une demande ou une réponse) dépend la valeur de l'attribut 'role'
                        if (element.role === "user"){
                            const messageUser: MessageDemande = {
                                id: element.id,
                                parentId: element.parentId,
                                childrenIds: element.childrenIds.slice(),
                                role: element.role,
                                content: element.content
                            }
                            listeMessages[`${element.id}`] = messageUser;

                        }
                        else if (element.role === "assistant") {
                            if ("model" in element && element.model && typeof element.model === "string"
                                && "modelName" in element && element.modelName && typeof element.modelName === "string"
                                && "timestamp" in element && element.timestamp && typeof element.timestamp === "number"
                            ) {
                                const messageReponse: MessageReponse = {
                                    id: element.id,
                                    parentId: element.parentId,
                                    childrenIds: element.childrenIds.slice(),
                                    role: element.role,
                                    content: element.content,
                                    model: element.model,
                                    modelName: element.modelName,
                                    timestamp: element.timestamp
                                }
                                listeMessages[`${element.id}`] = messageReponse;

                            }
                        }
        
                    }
                });
        
                // On peut enfin créer l'objet ChatInfos
                const chat: ChatInfos = {
                    history: {
                        messages: listeMessages,
                        currentId: objet.history.currentId
                    },
                    params: parametres
                }

                return chat;
            }
        }
        return null;
    }

    /**
     * Un 'parser' pour déduire un objet `ParametresInfos` à partir d'un objet inconnu
     * @param {object} objet L'objet censé représenter les paramètres de conversation
     * @returns {ParametresInfos} Un objet `ParametresInfos`, ou `null` si cela ne correspond pas
     */
    public static parseParams(objet: object): ParametresInfos {
        var params: ParametresInfos = {};

        if ("system" in objet && objet.system && typeof objet.system === "string")
            params.system = objet.system;
        if ("temperature" in objet && objet.temperature && typeof objet.temperature === "number")
            params.temperature = objet.temperature;
        if ("stop" in objet && objet.stop) {
            if (typeof objet.stop === "string")
                params.stop = [objet.stop];
            if (Array.isArray(objet.stop))
                params.stop = objet.stop;
        }
        if ("max_tokens" in objet && objet.max_tokens && typeof objet.max_tokens === "number")
            params.max_tokens = objet.max_tokens;

        return params;
    }



    //////////////////////////////////////
    //////////////////////////////////////
    //// Parser pour une réponse de LLM
    //////////////////////////////////////
    //////////////////////////////////////

    /**
     * Un 'parser' pour déduire un objet 'ReponseLLM' à partir d'un objet inconnu
     * @param {unknown} objet L'objet censé représenter une réponse de LLM
     * @param {number} date La date du message, en nombre de secondes depuis l'epoch Unix (donné par Math.floor(Date.now()/1000) )
     * @returns {ReponseLLM | null} Un objet `ReponseLLM`, ou `null` si cela ne correspond pas
     */
    public static parseReponseLLM(objet: unknown, date: number): ReponseLLM | null {

        // On vérifie que l'objet contient bien le message de réponse
        if (objet && typeof objet === "object"
            && "choices" in objet && objet.choices && Array.isArray(objet.choices)
            && objet.choices.length > 0 && objet.choices[0] && typeof objet.choices[0] === "object"
            && "message" in objet.choices[0] && objet.choices[0].message && typeof objet.choices[0].message === "object"
            && "content" in objet.choices[0].message && objet.choices[0].message.content && typeof objet.choices[0].message.content === "string"
        ) {
            // Les autres champs 'role', 'model' et 'usage' ne sont pas forcément nécessaires
            const reponseLLM: ReponseLLM = {
                content: objet.choices[0].message.content,
                role: "assistant",
                model: ("model" in objet && objet.model && typeof objet.model === "string")? objet.model : "",
                usage: ("usage" in objet && objet.usage && typeof objet.usage === "object")? objet.usage : {},
                timestamp: date
            }
            return reponseLLM;
        }
        return null;
    }

}