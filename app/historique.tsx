import { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, SafeAreaView, Modal, ActivityIndicator, Alert, TextInput} from "react-native";
import { router } from "expo-router";

import { styles } from './styles/historique.styles';
import { ConversationInfos } from "@/types/dataTypes";
import { FetchError } from "@/classes/FetchError";

import RequetesServeur from "@/gestionGlobaleBackend/requetesServeurAvecCacheEtNotification";
import { Ionicons } from '@expo/vector-icons';

/**
 * PropsHistorique
 * @interface
 * @property {boolean} visible - Si l'écran est visible
 * @property {() => void} onClose - Fonction à appeler pour fermer l'écran
 * @property {string} adresseServeur - L'adresse du serveur
 * @property {string} cleAPI - La clé d'API
 */
interface PropsHistorique {
  visible: boolean; // Si l'écran est visible
  onClose: () => void; // Fonction à appeler pour fermer l'écran
  adresseServeur?: string; // L'adresse du serveur
  cleAPI?: string; // La clé d'API
  idServeur?: string; // L'ID du serveur
  horsLigne?: boolean; // signale si l'on est en mode hors-ligne ou non
}

/**
 * EcranHistorique
 * Composant qui affiche l'historique des conversations.
 * @param {boolean} visible Si l'écran est visible
 * @param {() => void} onClose Fonction à appeler pour fermer l'écran
 * @returns {TSX.Element} L'écran de l'historique des conversations
*/ 
export default function EcranHistorique({ visible, onClose, adresseServeur, cleAPI, idServeur, horsLigne }: PropsHistorique) {
    const [conversations, setConversations] = useState<ConversationInfos[]>([]);
    const [estEnChargement, setEstEnChargement] = useState(false);
    const [erreur, setErreur] = useState('');
    const [convAModifier,setConversationAModifier] = useState<ConversationInfos | null>(null);
    const [ModalRenommerVisible,setModalRenommerVisible] = useState(false);
    const [modeHorsLigne, setModeHorsLigne] = useState<boolean>(horsLigne ? horsLigne : false);

    // Charger les conversations quand le modal devient visible
    useEffect(() => {
        if (visible) {
            chargerConversations();
        }
    }, [visible, adresseServeur, cleAPI]);
    
    /**
     * Charge la liste des conversations depuis le serveur
     */
    const chargerConversations = async () => {
        
        if (!adresseServeur || !cleAPI) {
            setErreur('Adresse du serveur ou clé API manquante');
            return;
        }
        
        try {
            setEstEnChargement(true);
            setErreur('');
            
            const resultat = await RequetesServeur.obtenirListeConversations(adresseServeur, cleAPI, idServeur, modeHorsLigne);
            
            if (resultat instanceof FetchError) {
                setErreur(`Erreur: ${resultat.getMessage()}`);
            } else {
                setModeHorsLigne(resultat.cache? true : false) // mode hors-ligne activé ou désactivé selon la présence de l'attribut 'cache' (signifie que l'objet vient du cache)

                setConversations(resultat.data); // génère la liste des conversations
            }
        } catch (error) {
            setErreur('Erreur lors du chargement des conversations');
            console.error('Erreur:', error);
        } finally {
            setEstEnChargement(false);
        }
    };

    /**
     * Ouvre une conversation
     * @param {string} id L'ID de la conversation à ouvrir
     */
    const ouvrirConversation = (id: string) => {
        router.push({
            pathname: "/conversation",
            params: { 
                idConversation: id,
                serverAddress: adresseServeur,
                apiKey: cleAPI,
                serverId: idServeur
            }
        });
        onClose();
    };
    
    /**
     * Ouvre la fenêtre de nouvelle conversation
     */
    const ouvrirConfiguration = () => {
        onClose();
        router.push({
            pathname: "/conversation",
            params: {
                serverAddress: adresseServeur,
                apiKey: cleAPI,
                showControlChat: "true" 
            }
        });
    };
    
    /**
     * Formate la date pour l'affichage
     * @param {number} timestamp Un temps en secondes depuis l'Epoch Unix
     * @returns {string} La date en écriture française
     */
    const formaterDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000); // Convertir timestamp en millisecondes
        return date.toLocaleDateString('fr-FR');
    };
    
    /**
     * Fonction pour grouper les conversations par période de temps (aujourd'hui, hier, cette semaine, ce mois...)
     */
    const grouperConversationsParPeriode = () => {
        const maintenant = new Date();
        const aujourdhui = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate()).getTime() / 1000;
        const hier = aujourdhui - 86400; // 24 heures en secondes
        const semaineDerniere = aujourdhui - 7 * 86400; // 7 jours en secondes
        const moisDernier = aujourdhui - 30 * 86400; // 30 jours en secondes
        
        const groupes = {
            aujourdhui: [] as ConversationInfos[],
            hier: [] as ConversationInfos[],
            semaine: [] as ConversationInfos[],
            mois: [] as ConversationInfos[],
            plusAncien: [] as ConversationInfos[]
        };
        
        conversations.forEach(conversation => {
            const timestamp = conversation.updated_at;
            
            if (timestamp >= aujourdhui) {
                groupes.aujourdhui.push(conversation);
            } else if (timestamp >= hier) {
                groupes.hier.push(conversation);
            } else if (timestamp >= semaineDerniere) {
                groupes.semaine.push(conversation);
            } else if (timestamp >= moisDernier) {
                groupes.mois.push(conversation);
            } else {
                groupes.plusAncien.push(conversation);
            }
        });
        
        return groupes;
    };

    /**
     * Fonction qui permet d'afficher le menu d'option d'une conversation.
     * @param {ConversationInfos} conversation La conversation
     */
    const afficherMenuConversation = (conversation : ConversationInfos) =>{
        setConversationAModifier(conversation);
    }

    /**
    * Affiche une boîte de dialogue de confirmation pour la suppression d'une conversation
    * @param {ConversationInfos} conversation La conversation à supprimer
    */
    const confirmerSuppressionConversation = (conversation: ConversationInfos) => {
        Alert.alert(
            "Confirmer la suppression",
            `Êtes-vous sûr de vouloir supprimer cette conversation ?`,
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        if (adresseServeur && cleAPI && conversation.id) {
                            const resultat = await RequetesServeur.supprimerConversation(adresseServeur, cleAPI, conversation.id, idServeur);
                        }
                        await chargerConversations();
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            {/* DÉBUT zone d'historique des conversations */}
            <View style={styles.modalConteneur}>
                <View style={styles.conteneurSidebar}>

                    
                    <SafeAreaView style={styles.conteneur}>

                        {/* En-tête de l'historique des conversations */}
                        <View style={styles.entete}>
                            <Text style={styles.titre}>Historique des conversations</Text>
                            <TouchableOpacity onPress={ouvrirConfiguration}>
                                <Text style={styles.boutonConfig}>...</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {/* DÉBUT espace pour la liste des conversations */}
                        {estEnChargement ? (

                            // Affiche qu'on est en attente du chargement de la liste des conversations
                            <View style={styles.conteneurChargement}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={styles.texteChargement}>Chargement...</Text>
                            </View>

                        ) : erreur ? (

                            // Affiche qu'il y a une erreur, et propose de réessayer
                            <View style={styles.conteneurErreur}>
                                <Ionicons name="alert-circle-outline" size={50} color="#ff6b6b" />
                                <Text style={styles.texteErreur}>{erreur}</Text>
                                <TouchableOpacity 
                                    style={styles.boutonReessayer}
                                    onPress={chargerConversations}
                                >
                                    <Text style={styles.texteReessayer}>Réessayer</Text>
                                </TouchableOpacity>
                            </View>

                        ) : conversations.length > 0 ? (

                            // Affiche la liste des conversations
                            <FlatList
                                data={[
                                    { titre: "Aujourd'hui", donnees: grouperConversationsParPeriode().aujourdhui },
                                    { titre: "Hier", donnees: grouperConversationsParPeriode().hier },
                                    { titre: "7 derniers jours", donnees: grouperConversationsParPeriode().semaine },
                                    { titre: "30 derniers jours", donnees: grouperConversationsParPeriode().mois },
                                    { titre: "Plus ancien", donnees: grouperConversationsParPeriode().plusAncien }
                                ].filter(groupe => groupe.donnees.length > 0)}
                                keyExtractor={(item) => item.titre}
                                renderItem={({ item }) => (

                                    // Pour chaque objet "titre de conversation" :
                                    <View style={styles.sectionGroupe}>

                                        {/* Affiche la référence temporelle : aujourd'hui, hier, 7 derniers jours, etc. */}
                                        <Text style={styles.titreSectionMois}>
                                            {item.titre}
                                        </Text>

                                        {item.donnees.map(conversation => (
                                            <TouchableOpacity 
                                                key={conversation.id}
                                                style={ !modeHorsLigne? styles.elementConversation : conversation.cache? styles.elementConversation : styles.elementConversationNonCache}
                                                onPress={() => ouvrirConversation(conversation.id)}
                                                disabled={!modeHorsLigne? false :  conversation.cache? false: true} // en mode hors-ligne, si la conversation est dans le cache, on peut y accéder
                                            >

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <View>
                                                        {/* Titre de la conversation */}
                                                        <Text style={styles.titreConversation}>
                                                            {conversation.title}
                                                        </Text>

                                                        {/* Date de la conversation */}
                                                        <Text style={styles.dateConversation}>
                                                            {formaterDate(conversation.updated_at)}
                                                        </Text>
                                                    </View>

                                                    {/* Bouton pour afficher les options : modifier le titre, ou supprimer la conversation */}
                                                    <TouchableOpacity 
                                                        onPress={() => {afficherMenuConversation(conversation)}} 
                                                        style={{ padding: 10 }}
                                                    >
                                                        <Text style={styles.boutonModifConv}>...</Text>
                                                    </TouchableOpacity>
                                                </View>

                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                                style={styles.liste}
                                contentContainerStyle={styles.listeContenu}
                            />

                        ) : (

                            // S'il n'y a aucune conversation (dans la liste des conversations de l'utilisateur)
                            <View style={styles.conteneurVide}>
                                <Ionicons name="chatbubble-outline" size={50} color="#555" />
                                <Text style={styles.texteVide}>Aucune conversation</Text>
                                <Text style={styles.sousTitreVide}>
                                    Vos conversations apparaîtront ici
                                </Text>
                            </View>
                        )}
                        {/* FIN espace pour la liste des conversations */}
                        
                        {/* 
                            Au pied de la fenêtre d'historique de conversation : 
                            Bouton pour accéder aux paramètres de l'application
                        */}
                        <View style={styles.pageFooter}>
                            <TouchableOpacity 
                                style={styles.boutonParametres}
                                onPress={() => {
                                    router.push('/parametres');
                                    onClose();
                                }}
                            >
                                <Ionicons name="settings-outline" size={20} color="white" />
                                <Text style={styles.texteParametres}>Paramètres</Text>
                            </TouchableOpacity>
                        </View>

                    </SafeAreaView>

                    {/*
                        Zone invisible sur la droite de la fenêtre d'historique de conversation.
                        On voit la conversation derrière.
                        Appuyer sur cette zone ferme la fenêtre d'historique de conversation.
                    */}
                    <TouchableOpacity 
                        style={styles.zoneOmbre}
                        activeOpacity={1}
                        onPress={onClose}
                    />

                </View>
            </View>
            {/* FIN zone d'historique des conversations */}


            {/* Modal pour les options d'une conversation : modifier le titre de conversation, ou supprimer la conversation */}
            <Modal
                visible={!!convAModifier && !ModalRenommerVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setConversationAModifier(null)}
            >
                <TouchableOpacity
                    style= {styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setConversationAModifier(null)}
                >
                   {convAModifier &&(
                    <View style = {styles.convOptionsContainer}>

                        {/* Label titre en haut du Modal */}
                        <Text style={styles.convOptionsTitle}>
                            Options pour cette conversation
                        </Text>

                        {/* Bouton pour renommer la conversation */}
                        <TouchableOpacity
                            style={styles.convOptionButton}
                            onPress={()=>{
                                setModalRenommerVisible(true)
                            }}
                        >
                            <Text style={styles.convOptionText}>Renommer</Text>
                        </TouchableOpacity>

                        {/* Bouton pour supprimer la conversation */}
                        <TouchableOpacity
                            style={[styles.convOptionButton, styles.convOptionButtonDanger]}
                            onPress={()=>{
                                setConversationAModifier(null);
                                confirmerSuppressionConversation(convAModifier);
                            }}
                        >
                            <Text style ={styles.convOptionTextDanger}>Supprimer</Text>
                        </TouchableOpacity>

                        {/* Bouton pour annuler (sortir du Modal) */}
                        <TouchableOpacity
                            style={[styles.convOptionButton,styles.convOptionButtonCancel]}
                            onPress={()=> setConversationAModifier(null)}
                        >
                            <Text style={styles.convOptionText}>Annuler</Text>
                        </TouchableOpacity>

                    </View>
                   )} 
                </TouchableOpacity>
                
            </Modal>
                
            {/* Modal pour renommer le titre d'une conversation */ }
            <Modal
                visible={ModalRenommerVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalRenommerVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalRenommerVisible(false)}
                >
                    <View style={styles.renommerContainer}>

                        {/* Label titre du Modal */}
                        <Text style={styles.renommerTitre}>
                            Renommer la conversation
                        </Text>

                        {/* Espace de saisie de texte, pour modifier le titre de conversation */}
                        <TextInput
                            style={styles.inputRenommer}
                            value={convAModifier?.title}
                            onChangeText={(texte) => {
                            if (convAModifier) {
                                setConversationAModifier({ ...convAModifier, title: texte });
                            }
                            }}
                            placeholder="Nouveau titre"
                            placeholderTextColor="#aaa"
                        />

                        {/* Ligne des boutons 'Annuler' et 'Valider', en bas du Modal */}
                        <View style={styles.boutonsRenommer}>

                            {/* Bouton 'Annuler' */}
                            <TouchableOpacity
                                style={styles.boutonAnnuler}
                                onPress={() => setModalRenommerVisible(false)}
                            >
                                <Text style={styles.texteBouton}>
                                    Annuler
                                </Text>
                            </TouchableOpacity>

                            {/* Bouton 'Valider' */}
                            <TouchableOpacity
                                style={styles.boutonValider}
                                onPress={async () => {
                                    if (convAModifier && adresseServeur && cleAPI) {
                                        await RequetesServeur.modifierConversationTitre(adresseServeur, cleAPI, convAModifier.id, convAModifier.title.trim(), idServeur);
                                        setModalRenommerVisible(false);
                                        setConversationAModifier(null);
                                        await chargerConversations();
                                    }
                                }}
                            >
                                <Text style={styles.texteBouton}>
                                    Valider
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </TouchableOpacity>
            </Modal>

        </Modal>
    );
}