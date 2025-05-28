import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
/**
 * Styles pour la page d'historique.
 */
export const styles = StyleSheet.create({
    modalConteneur: {
        flex: 1,
    },
    conteneurSidebar: {
        flex: 1,
        flexDirection: 'row',
    },
    zoneOmbre: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    conteneur: {
        width: width * 0.8,
        height: height,
        backgroundColor: '#1a1a1a',
    },
    entete: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    titre: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    titreSectionMois: {
        color: '#888',
        fontSize: 14,
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    liste: {
        flex: 1,
        width: '100%',
    },
    listeContenu: {
        paddingVertical: 8,
    },
    sectionGroupe: {
        marginBottom: 16,
    },
    titreSectionMoisStyle: {
        color: '#888',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    elementConversation: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
    },
    titreConversation: {
        color: 'white',
        fontSize: 16,
    },
    conteneurVide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    texteVide: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
    },
    sousTitreVide: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
    },
    pageFooter: {
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingHorizontal: 20,
    },
    boutonParametres: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    texteParametres: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    boutonConfig: {
        color: 'white',
        fontSize: 24,
        marginTop: -10,
    },
    boutonModifConv:{
        color: 'white',
        fontSize: 24,
        marginTop: -10,
    },
    conteneurChargement: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    texteChargement: {
        color: 'white',
        marginTop: 15,
        fontSize: 16,
    },
    conteneurErreur: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    texteErreur: {
        color: '#ff6b6b',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 15,
    },
    boutonReessayer: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#333',
        borderRadius: 5,
    },
    texteReessayer: {
        color: 'white',
        fontSize: 14,
    },
    dateConversation: {
        color: '#888',
        fontSize: 12,
        marginTop: 4,
    },
    sectionGroupeContainer: {
        marginBottom: 20,

    },
    modalOverlay:{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    convOptionsContainer:{
        width: '80%',
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    convOptionsTitle:{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    convOptionButton:{
        width: '100%',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#3a3a3a',
        alignItems: 'center',
    },
    convOptionText:{
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    convOptionTextDanger:{
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    convOptionButtonDanger:{
        backgroundColor: '#ff4d4d',
    },
    convOptionButtonCancel:{
        backgroundColor: '#555',
    },
    renommerContainer: {
        backgroundColor: '#222',
        padding: 20,
        margin: 40,
        borderRadius: 10,
        alignItems: 'center'
    },
      renommerTitre: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#fff',
    },
      inputRenommer: {
        backgroundColor: '#2a2a2a',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: '#fff',
    },
      boutonsRenommer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
      boutonAnnuler: {
        padding: 10,
        backgroundColor: '#666',
        borderRadius: 5,
        flex: 1,
        marginRight: 5
    },
      boutonValider: {
        fontWeight : 'bold',
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
        flex: 1,
        marginLeft: 5
    },
      texteBouton: {
        color: '#fff',
        textAlign: 'center'
    },

    // mode hors-ligne
    // pour un élément de la liste des conversations, qui n'est pas dans le cache
    elementConversationNonCache: {
        opacity: 0.3,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
    },
 
});

export default styles;