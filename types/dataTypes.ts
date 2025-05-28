/** Types pour les données partagées sur l'application */

/** Contient les informations d'un modèle de langage */
export type ModeleInfos = {
    id: string,
    name: string
}

/** Liste de modèles de langages */
export type ListeModeles = {
    data: ModeleInfos[],
    horsLigne?: boolean
}

/** Contient les informations d'une conversations */
export type ConversationInfos = {
    id: string,
    title: string,
    /** Date de dernière modification, en secondes depuis l'epoch Unix */
    updated_at: number,
    /** Date de création, en secondes depuis l'epoch Unix */
    created_at: number,
    /** Informations du chat */
    chat?: ChatInfos,
    cache?: boolean
}

/** Liste des conversations */
export type ListeConversations = {
    data: ConversationInfos[],
    cache?: boolean
}

/** Informations du chat d'une conversation (les messages) */
export type ChatInfos = {
    /** Les paramètres de conversation (peut être vide) */
    params: ParametresInfos
    /** L'historique des messages */
    history: {
        /** La liste des messages */
        messages: ListeMessages
        /** L'ID du dernier message affiché (permet de remonter l'arbre des messages) */
        currentId: string | null
    }
}

/** La liste des messages d'un chat (généralement sous-objet de ChatInfos) */
export type ListeMessages = {
    [id: string]: MessageDemande | MessageReponse
}

/** Décrit un message de type demande (une requête de l'utilisateur auprès d'un LLM) */
export type MessageDemande = {
    /** ID du message */
    id: string
    /** ID du message parent (vaut null s'il n'y a pas de parent) */
    parentId: string | null
    /** Liste des IDs des enfants (tableau vide s'il n'y a pas d'enfants) */
    childrenIds: string[]
    /** Rôle du message (normalement 'user' pour ce type MessageDemande) */
    role: string
    /** Le contenu du message */
    content: string
    /** Date du message, en secondes depuis l'epoch Unix */
    timestamp?: number
}

/** Décrit un message de type réponse (la réponse d'un LLM à une requête de l'utilisateur) */
export type MessageReponse = {
    /** ID du message */
    id: string
    /** ID du message parent (vaut null s'il n'y a pas de parent) */
    parentId: string | null
    /** Liste des IDs des enfants (tableau vide s'il n'y a pas d'enfants) */
    childrenIds: string[]
    /** Rôle du message (normalement 'assistant' pour ce type MessageReponse) */
    role: string
    /** Le contenu du message */
    content: string
    /** ID du modèle de langage qui répond */
    model: string
    /** Nom du modèle de langage qui répond */
    modelName: string
    /** Date du message, en secondes depuis l'epoch Unix */
    timestamp?: number
    /** Statistiques de la réponse du LLM. Visible sur Open WebUI, peut-être pas sur cette application. 
     * À utiliser lorsqu'on ajoute un message à une conversation (on transmet l'information à Open WebUI).*/
    usage?: object
}

/** Objet contenant les paramètres de conversation (non obligatoires) */
export type ParametresInfos = {
    /** Paramètre "prompt système" */
    system?: string
    /** Paramètre "température" (un réel entre 0 et 2) */
    temperature?: number
    /** Paramètre "séquence d'arrêt" (plusieurs séquence d'arrêt possibles selon un string 'modelfile') */
    stop?: string[]
    /** Paramètre "nombre maximal de to" */
    max_tokens?: number
}





/** Objet pour envoyer une requête à un LLM */
export type BodyRequeteLLM = {
    /** Liste des messages, dans l'ordre logique */
    messages: MiniMessage[]
    /** ID du modèle de langage */
    model: string
    /** Paramètres de conversation */
    params: ParametresInfos,
    /** Features : web search... */
    features?: RequeteFeatures
}

/** Version miniature des messages, uniquement pour le type `BodyRequeteLLM` */
export type MiniMessage = {
    /** Contenu du message */
    content: string
    /** Rôle : 'user', 'assistant' ou 'system' (si prompt système) */
    role: string
}

/** Contient les informations d'une réponse de LLM */
export type ReponseLLM = {
    /** Le texte de la réponse du LLM */
    content: string
    /** Le rôle (normalement 'assistant') */
    role: string
    /** ID du modèle de langage qui a répondu */
    model: string
    /** Information qui peut être visible sur Open WebUI, mais pas prévue pour cette application mobile.
     * Il peut être intéressant de mettre à jour la conversation avec cette information.
     * (cependant on ne garde pas cette information sur l'application mobile)
     * À utiliser tel quel, lorsqu'on modifie la conversation côté serveur, pour ajouter le nouveau message.
     */
    usage?: object,
    /** La date du message, en nombre de secondes depuis l'epoch Unix */
    timestamp?: number
}

/** Objet qui contient les informations d'un serveur */
export type Serveur = {
    /** ID du serveur  */
    id : string
    /** Nom du serveur */
    name : string
    /** Nom du serveur choisi par l'utilisateur
     * Ce nom sera celui affiché dans la liste des serveurs
     */
    name_displayed : string
    /** Adresse du serveur*/
    url : string
    /** Clé API du serveur */
    cleApi : string
}


/** Caractéristiques pour les requêtes de LLM */
export type RequeteFeatures = {
    // code_interpreter? : boolean,     NON IMPLÉMENTÉ
    // image_generation? : boolean,     NON IMPLÉMENTÉ
    /** Active la recherche web */
    web_search? : boolean
}