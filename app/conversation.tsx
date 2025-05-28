import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    SafeAreaView, 
    KeyboardAvoidingView, 
    Platform, 
    Modal, 
    Alert,
    TouchableWithoutFeedback,
    Button,
    ActivityIndicator,
    Switch,
} from 'react-native';
import { useState, useEffect, useRef } from "react";
import { useLocalSearchParams, router } from "expo-router";
import * as ClipBoard from 'expo-clipboard';

import { Ionicons } from '@expo/vector-icons';

import { styles } from "./styles/conversation.styles";
import { ChatInfos, ListeMessages, ConversationInfos, MessageDemande, MessageReponse, ParametresInfos, RequeteFeatures } from "@/types/dataTypes";
import { FetchError } from "@/classes/FetchError";

import SelecteurModele from "./SelecteurModele";
import EcranHistorique from './historique';
import EcranControleChat from './controlChat';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'
import ThinkingAnimation from './ThinkingAnimation';
import RequetesServeur from '@/gestionGlobaleBackend/requetesServeurAvecCacheEtNotification';
import ParserMessage from '@/outils/ParserMessage';

export default function EcranConversation() {
    // Référence pour faire défiler automatiquement vers le dernier message
    const scrollViewRef = useRef<ScrollView>(null);
    
    // Paramètres de l'URL
    const params = useLocalSearchParams();
    
    // États pour la gestion de l'interface utilisateur
    const [estHistoriqueVisible, setEstHistoriqueVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [nomModele, setNomModele] = useState("Chargement...");
    const [modelesDisponibles, setModelesDisponibles] = useState<string[]>([]);
    const [estEnChargement, setEstEnChargement] = useState(true);
    const [messagesConversation, setMessagesConversation] = useState<(MessageDemande | MessageReponse)[]>([]);
    const [parametresConversation, setParametresConversation] = useState<ParametresInfos>({});
    const [estParametresVisible, setEstParametresVisible] = useState(false);
    const [estModalOptionsVisible, setEstModalOptionsVisible] = useState(false);
    const [rechercheWebActive, setRechercheWebActive] = useState(false);
    /** Définit si l'option 'recherche web' est autorisée : l'utilisateur a le droit de l'utiliser pour ce serveur */
    const [rechercheWebAutorisee, setRechercheWebAutorisee] = useState(false);
    //const [conversationId, setConversationId] = useState<string | undefined>(params.idConversation as string | undefined);
    const adresseServeur = params.serverAddress as string;
    const cleAPI = params.apiKey as string;
    const idConversation = params.idConversation as string | undefined;
    const idServeur = params.serverId as string | undefined;
    const [hasShownControlChat, setHasShownControlChat] = useState(false);
    const [messageSelectionne,setMessageSelectionne] = useState<MessageReponse | MessageDemande | null >(null);
    const [modalOptionsConvVisible,setModalOptionsConvVisible] = useState(false);
    const [messageEnEdition, setMessageEnEdition] = useState<string | null>(null);
    const [texteEdition, setTexteEdition] = useState<string>('');
    /** Donne le statut hors-ligne ou non */
    const [modeHorsLigne, setModeHorsLigne] = useState<boolean>(false);
    /** L'état du bouton 'Recharger' (en mode hors-ligne) */
    const [estEnRechargement, setEstEnRechargement] = useState<boolean>(false);
    
    useEffect(() => {
        if (params.showControlChat === "true" && !hasShownControlChat) {
            setEstParametresVisible(true);
            setHasShownControlChat(true);
        }
    }, [params, hasShownControlChat]);
    
    /**
     * Effet pour récupérer la liste des modèles disponibles au chargement
     */
    useEffect(() => {
        recupererModeles();
    }, [adresseServeur, cleAPI]);

    /**
     * Effet pour charger une conversation existante lorsque l'ID de conversation change
     */
    useEffect(() => {
        if (modelesDisponibles.length === 0)
            recupererModeles();
        chargerConversation();
    }, [idConversation, adresseServeur, cleAPI]);

    /**
     * Effet pour faire défiler automatiquement vers le dernier message
     * lorsque la liste des messages est mise à jour
     */
    useEffect(() => {
        if (messagesConversation.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: false });
            }, 100);
        }
    }, [messagesConversation]);

    /**
     * Effectue la récupération des LLM, et les place dans la liste des LLM
     */
    async function recupererModeles() {
        if (!adresseServeur || !cleAPI) {
            Alert.alert("Erreur", "Adresse du serveur ou clé API manquante");
            return;
        }
        try {
            const resultat = await RequetesServeur.obtenirListeModeles(adresseServeur, cleAPI);
            if (resultat instanceof FetchError) {
                Alert.alert("Erreur");
            } else {
                
                if (resultat.horsLigne) {
                    setModeHorsLigne(true); // mode hors-ligne activé
                    return;
                }
                else {
                    setModeHorsLigne(false); // désactive le mode hors-ligne
                }

                const nomsModeles = resultat.data.map(modele => modele.name);
                setModelesDisponibles(nomsModeles);
                if (nomsModeles.length > 0) {
                    setNomModele(nomsModeles[0]);
                }
            }
        } catch (erreur) {
            Alert.alert("Erreur", "Impossible de récupérer la liste des modèles");
            console.error(erreur);
            return;
        } finally {
            setEstEnChargement(false);
        }
    }

    /**
     * Effectue la récupération de la conversation et son contenu
     */
    async function chargerConversation() {
        if (modelesDisponibles.length <= 1) {
            await recupererModeles();
        }

        // Vider les messages de la conversation si l'ID de conversation change
        setMessagesConversation([]);
        
        if (!idConversation || !adresseServeur || !cleAPI) return;
        
        try {
            setEstEnChargement(true); 
            // Obtenir les détails de la conversation spécifique
            const resultat = await RequetesServeur.obtenirConversationEtSonContenu(adresseServeur, cleAPI, idConversation, idServeur);
            
            if (resultat instanceof FetchError) {
                Alert.alert("Erreur", "Impossible de charger la conversation");
                console.error(resultat);
            } else {
                // Traiter la conversation comme un objet ConversationInfos
                const conversation: ConversationInfos = resultat;

                if (conversation.cache){
                    setModeHorsLigne(true); // le mode hors-ligne est activé si l'objet vient du cache
                }
                else {
                    setModeHorsLigne(false); // désactive le mode hors-ligne
                }
            
                // Extraire les messages de la conversation
                if (conversation.chat && conversation.chat.history) {
                    const messages: (MessageDemande | MessageReponse)[] = [];
                    const history = conversation.chat.history;
                    let currentId = history.currentId;
                    const messageIds: string[] = [];
                    
                    // Collecter d'abord tous les IDs des messages dans le chemin de l'actuel à la racine
                    while (currentId) {
                        const currentMessage = history.messages[currentId];
                        if (!currentMessage) break;
                        
                        messageIds.unshift(currentId); // Ajouter à la liste des IDs inversée
                        currentId = currentMessage.parentId;
                    }
                    
                    // Créer les messages en ordre correct
                    for (const msgId of messageIds) {
                        const msg = history.messages[msgId];
                        messages.push(msg);
                    }
                    setMessagesConversation(messages);
                }
            
                // Extraire les paramètres de la conversation
                if (conversation.chat && conversation.chat.params) {
                    setParametresConversation({
                        system: conversation.chat.params.system,
                        temperature: conversation.chat.params.temperature,
                        stop: conversation.chat.params.stop,
                        max_tokens: conversation.chat.params.max_tokens,
                    });
                }
            }
        } catch (erreur) {
            Alert.alert("Erreur", "Impossible de charger la conversation");
            console.error(erreur);
        } finally {
            setEstEnChargement(false);
        }
    }

    /**
     * Envoie une requête au modèle d'IA et gère la réception de la réponse
     * 
     * Cette fonction:
     * 1. Valide l'entrée utilisateur
     * 2. Prépare l'historique des messages
     * 3. Envoie la requête au serveur
     * 4. Affiche la réponse
     * 5. Gère la création ou mise à jour de la conversation
     * 
     * @returns {Promise<null|void>} Null en cas d'erreur, void sinon
     */
    const envoyerRequeteEtGererReceptionReponse = async() => {
        const texteRequete = message.trim();
        const messageId = uuidv4();
        
        // Vérfie si le texte a bien été saisi
        if(!texteRequete){
            Alert.alert("Requête vide", "Veuillez saisir un message avant de l'envoyer");
            return null;
        }
        
        //Vérifie si un modèle est sélectionné
        if(!nomModele || nomModele === "Chargement..."){
            Alert.alert("Modèle non sélectionné","Veuillez sélectionner un modèle avant d'envoyer un message.");
            return null;
        }
        
        const promptSysteme = parametresConversation.system || "";
        const temperature = parametresConversation.temperature ?? 0.7;
        const sequenceArret = parametresConversation.stop || [];
        const nbMaxTokens = parametresConversation.max_tokens ?? 1048;
        
        // Création d'un objet pour stocker tous les messages existants
        const messagesHistorique: ListeMessages = {};
        
        // Récupérer le dernier message ID s'il existe
        let lastMessageId = null;
        if (messagesConversation.length > 0) {
            lastMessageId = messagesConversation[messagesConversation.length - 1].id;
        }
        
        // Construire l'historique des messages existants avec la structure correcte
        for (let i = 0; i < messagesConversation.length; i++) {
            const msg = messagesConversation[i];
            const parentId = i > 0 ? messagesConversation[i - 1].id : null;
            const childrenIds = i < (messagesConversation.length - 1) ? [messagesConversation[i + 1].id] : [];
            
            if (msg.role === 'user') {
                messagesHistorique[msg.id] = {
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    parentId: parentId,
                    childrenIds: childrenIds
                } as MessageDemande;
            } else {
                messagesHistorique[msg.id] = {
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    parentId: parentId,
                    childrenIds: childrenIds,
                    model: "unknown", 
                    modelName: nomModele,
                    timestamp: Date.now() / 1000
                } as MessageReponse;
            }
        }
        
        // Créer le nouveau message utilisateur
        const nouveauMessage: MessageDemande = {
            id: messageId,
            parentId: lastMessageId,
            childrenIds: [],
            role: "user",
            content: texteRequete,
        };
        
        // Construire l'objet ChatInfos avec l'historique complet
        const chatInfos: ChatInfos = {
            history: {
                currentId: lastMessageId,
                messages: messagesHistorique
            },
            params: {
                system: promptSysteme,
                temperature: temperature,
                stop: sequenceArret,
                max_tokens: nbMaxTokens,
            }
        };
        
        try {
            // Ajouter le message utilisateur à l'interface
            setMessagesConversation(prev => [
                ...prev,
                { 
                    id: messageId, 
                    role: 'user', 
                    content: texteRequete,
                    parentId: lastMessageId,
                    childrenIds: []
                } as MessageDemande
            ]);
            
            // Ajouter un message "thinking" temporaire
            const thinkingId = "thinking-" + Date.now();
            setMessagesConversation(prev => [
                ...prev,
                { 
                    id: thinkingId, 
                    role: 'assistant', 
                    content: "...",
                    parentId: messageId,
                    childrenIds: [],
                    model: "unknown",
                    modelName: nomModele,
                    timestamp: Math.floor(Date.now() / 1000),
                    usage: {}
                } as MessageReponse
            ]);
            
            // Vider le champ de saisie
            setMessage("");
            
            // Faire défiler vers le bas pour voir le nouveau message
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 50);

            const requestFeatures: RequeteFeatures = {
                web_search: rechercheWebActive
            }
            
            // Envoyer la requête au serveur
            const reponse = await RequetesServeur.envoyerRequete(adresseServeur, cleAPI, nomModele, texteRequete, chatInfos, requestFeatures);
            
            // Vérifier si la réponse est une erreur
            if(reponse instanceof FetchError){
                // Replace the thinking message with an error message
                setMessagesConversation(prev => prev.map(msg => 
                    msg.id === thinkingId 
                    ? {
                        ...msg,
                        content: "Une erreur s'est produite lors de la génération de la réponse.",
                        error: true
                      } 
                    : msg
                ));
                setMessagesConversation(prev => prev.filter(msg => msg.id !== thinkingId));
                // Afficher une alerte d'erreur
                Alert.alert("Erreur", reponse.getMessage());
                console.error(reponse);
                return null;
            }

            // Supprimer le message "thinking"
            setMessagesConversation(prev => prev.filter(msg => msg.id !== thinkingId));
            
            // Créer la réponse du modèle
            const reponseId = uuidv4();
            const nouvelleReponse: MessageReponse = {
                id: reponseId,
                parentId: messageId,
                childrenIds: [],
                role: "assistant",
                content: reponse.content,
                model: reponse.model || "unknown",
                timestamp: reponse.timestamp || Math.floor(Date.now() / 1000),
                modelName: nomModele,
                usage: reponse.usage || {}
            };
            
            // Ajouter le nouveau message à l'historique
            messagesHistorique[messageId] = nouveauMessage;
            
            // Mettre à jour les childrenIds du dernier message s'il existe
            if (lastMessageId && messagesHistorique[lastMessageId]) {
                messagesHistorique[lastMessageId].childrenIds = [messageId];
            }

            // Mettre à jour l'historique avec la réponse
            messagesHistorique[messageId].childrenIds = [reponseId];
            messagesHistorique[reponseId] = nouvelleReponse;
            
            // Mettre à jour le currentId pour pointer vers la réponse
            chatInfos.history.currentId = reponseId;
            
            // Ajouter la réponse à l'interface
            setMessagesConversation(prev => [
                ...prev,
                { 
                    id: reponseId, 
                    role: 'assistant', 
                    content: reponse.content,
                    parentId: messageId,
                    childrenIds: [],
                    model: reponse.model || "unknown",
                    modelName: nomModele,
                    timestamp: reponse.timestamp || Math.floor(Date.now() / 1000),
                    usage: reponse.usage || {}
                } as MessageReponse
            ]);
            
            // Faire défiler vers le bas pour voir la réponse immédiatement
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
            
            // Si c'est une nouvelle conversation (pas d'ID de conversation existant)
            if (!params.idConversation) {
                try {

                    // Créer l'objet ChatInfos pour la nouvelle conversation
                    const debutChat: ChatInfos = {
                        history: {
                            currentId: reponseId,
                            messages: {
                                [messageId]: nouveauMessage,
                                [reponseId]: nouvelleReponse
                            }
                        },
                        params: {
                            system: promptSysteme,
                            temperature: temperature,
                            stop: sequenceArret,
                            max_tokens: nbMaxTokens,
                        }
                    };

                    // On génère un titre en demandant au LLM
                    var titreConversation = await RequetesServeur.genererTitreConversation(adresseServeur, cleAPI, nomModele, debutChat);
                    // S'il y a erreur, le titre est basé sur le début de la première requête
                    if (FetchError.isInstance(titreConversation)) {
                        titreConversation = texteRequete.length > 30 
                        ? texteRequete.substring(0, 30) + "..." 
                        : texteRequete;
                    }
                    
                    // Appeler l'API pour créer une nouvelle conversation
                    const resultatCreation = await RequetesServeur.creerConversation(
                        adresseServeur, 
                        cleAPI, 
                        titreConversation,
                        debutChat,
                        idServeur
                    );
                    
                    if (resultatCreation instanceof FetchError) {
                        Alert.alert("Erreur", "Impossible de créer une nouvelle conversation");
                        console.error(resultatCreation);
                    } else {
                        // Récupérer l'ID de la nouvelle conversation
                        const nouvelIdConversation = resultatCreation.id;
                        // Mettre à jour l'URL avec le nouvel ID de conversation
                        router.setParams({
                            idConversation: nouvelIdConversation
                        });
                    }
                } catch (error) {
                    console.error("Erreur lors de la création de la conversation:", error);
                    Alert.alert("Erreur", "Impossible de créer une nouvelle conversation");
                }
                // Si c'est une conversation existante, ajouter les messages à la conversation
            } else {
                try {
                    // Ajouter les messages à la conversation existante
                    const resultatAjout = await RequetesServeur.ajouterMessagesEnFinDeConversation(
                        adresseServeur,
                        cleAPI,
                        idConversation as string,
                        nouveauMessage.content,
                        {
                            content: nouvelleReponse.content,
                            role: "assistant",
                            model: nouvelleReponse.model,
                            usage: nouvelleReponse.usage,
                            timestamp: nouvelleReponse.timestamp
                        },
                        idServeur
                    );
                    
                    if (resultatAjout instanceof FetchError) {
                        Alert.alert("Erreur", "Impossible d'ajouter les messages à la conversation");
                        console.error(resultatAjout);
                    }
                } catch (error) {
                    console.error("Erreur lors de l'ajout des messages:", error);
                    Alert.alert("Erreur", "Impossible d'ajouter les messages à la conversation");
                }
            }
            
            // Faire défiler vers le bas pour voir la réponse
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
            
        } catch (error) {
            Alert.alert("Erreur", "Une erreur est survenue lors de l'envoi de la requête.");
            console.error(error);
        } finally {
            setEstEnChargement(false);
            // Supprimer le message "thinking" en cas d'erreur
            setMessagesConversation(prev => prev.filter(msg => !msg.id.startsWith('thinking-')));
        }
    };

    /**
     * Gère le clic sur le bouton "controlChat"
     */
    const handleOptionsPress = () => {
        setEstParametresVisible(true);
        setHasShownControlChat(false);
    };

    /**
     * Gère le clic sur le bouton "Nouvelle conversation"
     */
    const handleNewChat = () => {
        setMessagesConversation([]);
        setMessage("");
        // Réinitialiser les paramètres de la conversation
        setParametresConversation({
            system: "",
            temperature: 0.7,
            stop: [],
            max_tokens: 1048
        });
        
        // Naviger vers la page de conversation avec un nouvel ID de conversation
        router.replace({
            pathname: "/conversation",
            params: { 
                serverAddress: adresseServeur, 
                apiKey: cleAPI
            }
        });
    };

    /**
     * Gère l'appui sur un message (affiche les options du message)
     */
    const ouvrirOptions = (msg : MessageDemande | MessageReponse) => {
        setMessageSelectionne(msg);
        setModalOptionsConvVisible(true);
    }

    /**
     * Gère l'appui sur le bouton 'Recharger' (en mode hors-ligne)
     */
    const recharger = async () => {
        setModelesDisponibles([]); // vide la liste des LLM
        setEstEnRechargement(true);
        await recupererModeles();
        if (idConversation)
            await chargerConversation();
        setEstEnRechargement(false);
    }

    /**
     * Gère le clic sur le bouton "+" dans la zone de saisie du chat.
     * Ouvre le modal des options de requête.
     */
    const handleOptionsRequetePress = async () => {
        const autorisation = await RequetesServeur.verifierOptionRechercheWebUtilisable(adresseServeur,cleAPI);
        if(autorisation === true){
            setRechercheWebAutorisee(true);
        } else {
            setRechercheWebAutorisee(false);
            setRechercheWebActive(false);
        }
        setEstModalOptionsVisible(true);
    }

    return (
        <KeyboardAvoidingView
            behavior='padding'
            style={{ flex: 1 }}
        >
                {/* Conteneur de la fenêtre 'conversation' */}
                <SafeAreaView style={styles.container}>

                    {/* 
                        DÉBUT En-tête (en haut de la fenêtre): 
                            - bouton pour ouvrir l'historique de conversations
                            - liste déroulante pour choisir un LLM
                            - bouton pour créer une nouvelle conversation
                    */}
                    <View style={styles.header}>

                        {/* Bouton pour ouvrir l'historique de conversation */}
                        <TouchableOpacity 
                            style={styles.menuButton}
                            onPress={() => setEstHistoriqueVisible(true)}
                        >
                            <Ionicons name="menu-outline" size={24} color="white" />
                        </TouchableOpacity>

                        {/* Liste déroulante pour choisir un LLM */}
                        {!modeHorsLigne ? (
                            <SelecteurModele
                                modeleSelectionne={nomModele}
                                modelesDisponibles={modelesDisponibles}
                                onSelectionModele={setNomModele}
                            />
                            ) : (
                                // Mode hors-ligne : l'emplacement est utilisé pour rappeler que l'on est en mode hors-ligne
                                <View style={styles.conteneurLabelTitreHorsLigne}>
                                    <Text style={styles.labelTitreHorsLigne}>Mode hors-ligne</Text>
                                </View>
                            )
                        }

                        {/* Bouton pour créer une nouvelle conversation */}
                        {!modeHorsLigne? (
                            <TouchableOpacity 
                                style={styles.newChatButton}
                                onPress={handleNewChat}
                            >
                                <Ionicons name="create-outline" size={24} color='white' />
                            </TouchableOpacity>
                        ) : (
                            // Mode hors-ligne : l'emplacement est utilisé pour un bouton pour recharger
                            <TouchableOpacity
                                style={styles.boutonRecharger}
                                onPress={recharger}
                                disabled={estEnRechargement}
                            >
                                {estEnRechargement? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Ionicons name="refresh-outline" size={24} color='white'/>
                                )}
                            </TouchableOpacity>
                        )}

                    </View>
                    {/* 
                        FIN En-tête 
                    */}


                    {/* 
                        DÉBUT Zone de chat 
                    */}
                    <View style={styles.chatArea}>
                        {modeHorsLigne && messagesConversation.length === 0 ? (

                            // En mode hors-ligne, on signale à l'utilisateur qu'il est possible de recharger
                            <View style={styles.conteneurCommentaireHorsLigne}>
                                <Text style={styles.commentaireHorsLigne}>Vous êtes en mode hors-ligne.</Text>
                                <Text style={styles.commentaireHorsLigne}>Essayez de recharger.</Text>
                            </View>
                        
                        ) : estEnChargement && messagesConversation.length === 0 ? (
                            
                            // La zone de chat affiche que la conversation est en chargement
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingText}>Chargement de la conversation...</Text>
                            </View>


                        ) : (

                            // La zone de chat affiche quelque chose en fonction du nombre de messages
                            <ScrollView 
                                ref={scrollViewRef}
                                style={styles.messagesContainer}
                                contentContainerStyle={styles.messagesContent}
                                keyboardShouldPersistTaps="handled"
                            >
                                {messagesConversation.length > 0 ? (

                                    // La zone de chat affiche les messages de la conversation
                                    messagesConversation.map((msg) => (

                                        // DÉBUT conteneur du message
                                        <View 
                                            key={msg.id} 
                                            style={msg.role === 'user' ? styles.userMessage : styles.aiMessage} 
                                            // L'affichage du message dépend de si c'est une question de l'utilisateur, ou une réponse d'un LLM
                                        >
                                            {msg.id.startsWith('thinking-') ? (

                                                // Animation si le message est en attente de réception
                                                <ThinkingAnimation style={styles.messageText} />

                                            ) : (

                                                // On peut toucher le bouton pour le sélectionner (ce qui montre les boutons pour copier le message, le modifier ou le supprimer)
                                                <TouchableOpacity 
                                                    onLongPress={() => ouvrirOptions(msg)}
                                                    onPress={() => {
                                                        // Si le message est déjà sélectionné, le désélectionner
                                                        // Sinon, le sélectionner
                                                        setMessageSelectionne(
                                                            messageSelectionne?.id === msg.id ? null : msg
                                                        );
                                                    }}
                                                >
                                                    {messageEnEdition === msg.id ? (

                                                        // Si le message en mode "édition", son affichage est une zone de texte modifiable par l'utilisateur
                                                        <>
                                                        <TextInput
                                                            value={texteEdition}
                                                            onChangeText={setTexteEdition}
                                                            autoFocus
                                                            multiline
                                                            textAlignVertical='top'
                                                            onBlur={() => setMessageEnEdition(null)} // Sortir de l'édition en quittant le champ.
                                                            style={styles.textInputEdition}
                                                        />
                                                        {/* Bouton pour valider l'édition du message */}
                                                        <Button
                                                            title="Valider"
                                                            onPress={async () => {
                                                                if (idConversation) {
                                                                    try {
                                                                        const resultat = await RequetesServeur.modifierConversationMessage(adresseServeur, cleAPI, idConversation, msg.id, texteEdition, idServeur);
                                                                        if (!FetchError.isInstance(resultat)) {
                                                                            // Modification réussie côté serveur, donc on modifie le message localement
                                                                            setMessagesConversation(prev =>
                                                                                prev.map(m => m.id === msg.id ? { ...m, content: texteEdition } : m)
                                                                            );
                                                                            setMessageEnEdition(null);
                                                                            setMessageSelectionne(null);
                                                                        } else {
                                                                            Alert.alert("Erreur", "Impossible de modifier le message");
                                                                        }
                                                                    } catch (e) {
                                                                        console.error(e);
                                                                        Alert.alert("Erreur", "Impossible de modifier le message");
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        </>

                                                    ) : (

                                                            // 'ParserMessage' traduit les caractères de balise dans le string, en des styles (gras, italique, liste...)
                                                            <ParserMessage content={msg.content}/>
                                                        

                                                    )}
                    
                                                    {/* DÉBUT infos du message et boutons de modification du message (visibles seulement si le message est sélectionné) */}
                                                    {messageSelectionne?.id === msg.id && (
                                                        <View style={styles.messageInfoContainer}>

                                                            {/* Affiche la date du message (elle est sauvegardée en secondes depuis l'Epoch Unix, il faut donc la convertir) */}
                                                            <Text style={styles.messageTimestamp}>
                                                            {(() => {
                                                                const timestamp = msg.timestamp ?? Date.now();
                                                                const date = new Date(timestamp > 1000000000000 ? timestamp : timestamp * 1000);
                                                                return (
                                                                    <Text style={styles.messageTimestamp}>
                                                                        {date.toLocaleString()}
                                                                    </Text>
                                                                );
                                                            })()}
                                                            </Text>

                                                            {/* Liste des boutons de modification : copier / éditer / supprimer */}
                                                            <View style={styles.messageActions}>

                                                                {/* Bouton pour copier le message dans le presse-papier */}
                                                                <TouchableOpacity onPress={() => {
                                                                    ClipBoard.setStringAsync(msg.content);
                                                                    Alert.alert("Copié");
                                                                }}>
                                                                    <Ionicons name="copy-outline" size={20} color="#aaa" />
                                                                </TouchableOpacity>

                                                                {/* Bouton pour activer l'édition du message */}
                                                                <TouchableOpacity onPress={() => {
                                                                    setMessageEnEdition(msg.id);
                                                                    setTexteEdition(msg.content);
                                                                }}>
                                                                    <Ionicons name="create-outline" size={20} color="#aaa" />
                                                                </TouchableOpacity>
                                                                
                                                                {/* 
                                                                    Bouton pour supprimer le message
                                                                    Le bouton 'supprimer' n'est affiché que pour les messages :
                                                                        - utilisateur (et non les réponses de LLM)
                                                                        - le message de début de conversation ne peut pas être supprimé (pour éviter de se retrouver avec une conversation vide)
                                                                */}
                                                                {msg.role === 'user' && messagesConversation.indexOf(msg) > 0 && (
                                                                    <TouchableOpacity onPress={() => {
                                                                        Alert.alert(
                                                                            "Confirmation",
                                                                            "Voulez-vous vraiment supprimer ce message ?",
                                                                            [
                                                                                {
                                                                                    text: "Annuler",
                                                                                    style: "cancel"
                                                                                },
                                                                                {
                                                                                    text: "Supprimer",
                                                                                    style: "destructive",
                                                                                    onPress: () => {
                                                                                        if(idConversation) {
                                                                                            RequetesServeur.supprimerMessageDansConversation(adresseServeur, cleAPI, idConversation, msg.id, idServeur)
                                                                                            .then(() => {
                                                                                                // Trouver et supprimer localement à la fois le message et sa réponse
                                                                                                if (msg.role === 'user') {
                                                                                                    // Si c'est un message utilisateur, trouver sa réponse
                                                                                                    const responseIndex = messagesConversation.findIndex(
                                                                                                        m => m.parentId === msg.id && m.role === 'assistant'
                                                                                                    );
                                                                                                    
                                                                                                    if (responseIndex !== -1) {
                                                                                                        // Obtenir l'ID de la réponse
                                                                                                        const responseId = messagesConversation[responseIndex].id;
                                                                                                        // Supprimer à la fois le message et sa réponse
                                                                                                        setMessagesConversation(prev => 
                                                                                                            prev.filter(m => m.id !== msg.id && m.id !== responseId)
                                                                                                        );
                                                                                                    } else {
                                                                                                        // Juste supprimer le message si aucune réponse trouvée
                                                                                                        setMessagesConversation(prev => 
                                                                                                            prev.filter(m => m.id !== msg.id)
                                                                                                        );
                                                                                                    }
                                                                                                } else {
                                                                                                    // Si c'est un message assistant, juste le supprimer
                                                                                                    setMessagesConversation(prev => 
                                                                                                        prev.filter(m => m.id !== msg.id)
                                                                                                    );
                                                                                                }
                                                                                                
                                                                                                setMessageSelectionne(null);
                                                                                            })
                                                                                            .catch(error => {
                                                                                                console.error("Error deleting message:", error);
                                                                                                Alert.alert("Erreur", "Impossible de supprimer le message");
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                }
                                                                            ]
                                                                        );
                                                                    }}>
                                                                        <Ionicons name="trash-outline" size={20} color="#ff4444" />
                                                                    </TouchableOpacity>
                                                                )}
                                                            </View>
                                                        </View>
                                                    )}
                                                    {/* FIN infos du message et boutons de modification du message (visibles seulement si le message est sélectionné) */}

                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        // FIN conteneur du message
                                    ))


                                ) : (

                                    // La zone de chat affiche que la conversation est vide
                                    <View style={styles.emptyConversationContainer}>
                                        <Ionicons 
                                            name={idConversation ? "chatbubble-ellipses-outline" : "chatbubble-outline"} 
                                            size={50} 
                                            color="#555" 
                                        />
                                        <Text style={styles.emptyConversationText}>
                                            {idConversation ? 'Aucun message dans cette conversation' : 'Nouvelle conversation'}
                                        </Text>
                                        <Text style={styles.emptyConversationSubtext}>
                                            {idConversation ? 'Cette conversation est vide' : 'Posez votre question pour commencer'}
                                        </Text>
                                    </View>
                                )}

                            </ScrollView>
                        )}

                    </View>
                    {/* 
                        FIN Zone de chat
                    */}
                    

                    {/* DÉBUT Zone de saisie de requête, et ses options (en bas de la fenêtre) */}
                    <View
                        style={!modeHorsLigne? styles.inputContainer : styles.inputContainerInvisible}
                    >
                        <View style={styles.inputWrapper}>

                            {/* Bouton pour afficher des options */}
                            <TouchableOpacity style={styles.attachButton} onPress={handleOptionsRequetePress}>
                                <Ionicons name="add-circle-outline" size={24} color="white" />
                            </TouchableOpacity>

                            {/* Espace de saisie de la requête */}
                            <TextInput
                                style={styles.input}
                                placeholder={nomModele !== "Chargement..." ? `Demander à ${nomModele}` : "Demander à ..."}
                                placeholderTextColor="#999"
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                editable={!estEnChargement}
                            />

                            {/* Bouton pour envoyer la requête */}
                            <TouchableOpacity 
                                style={styles.sendButton}
                                onPress={message.trim() ? envoyerRequeteEtGererReceptionReponse : handleOptionsPress}
                                disabled={estEnChargement}
                            >
                                {message.trim() ? (
                                    <Ionicons name="send" size={24} color="white" />
                                ) : (
                                    <Ionicons name="options-outline" size={24} color="white" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* FIN Zone de saisie de requête */}

                    {/* Modal historique des conversations */}
                    <EcranHistorique 
                        visible={estHistoriqueVisible}
                        onClose={() => setEstHistoriqueVisible(false)}
                        adresseServeur={adresseServeur}
                        cleAPI={cleAPI}
                        idServeur={idServeur}
                        horsLigne={modeHorsLigne}
                    />

                    {/* DÉBUT Modal Paramètres du chat */}
                    <Modal
                        visible={estParametresVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setEstParametresVisible(false)}
                    >
                        <TouchableWithoutFeedback onPress={() => setEstParametresVisible(false)}>
                            <View style={styles.parametresModalContainer}>
                                <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                                    <View>
                                        <EcranControleChat 
                                            onClose={() => {
                                                setEstParametresVisible(false);
                                                setHasShownControlChat(false);
                                            }}
                                            parametres={parametresConversation}
                                            onSaveParametres={(setParametresConversation)}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                    {/* FIN Modal Paramètres du chat */}

                    {/* DÉBUT Modal Options zone de saisie (*/}
                    <Modal
                        visible = {estModalOptionsVisible}
                        transparent={true}
                        animationType = "fade"
                        onRequestClose={() => setEstModalOptionsVisible(false)}
                    >
                        <TouchableWithoutFeedback onPress={() => setEstModalOptionsVisible(false)}>
                            <View style ={styles.optionsModalContainer}>
                                <TouchableWithoutFeedback>
                                    <View style = {styles.optionsModalContent}>
                                        <Text style={styles.titreModal}>Options de requête</Text>
                                        <View style= {styles.optionsLigne}>
                                            <Text style={styles.optionLabel}>
                                                Recherche Web { rechercheWebAutorisee? ('') : ('(non autorisé)') }
                                            </Text>
                                            <Switch
                                                value={rechercheWebActive}
                                                onValueChange={setRechercheWebActive}
                                                disabled={ ! rechercheWebAutorisee}
                                            />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>

                    </Modal>
                    {/* FIN Modal Options zone de saisie */}



                </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

