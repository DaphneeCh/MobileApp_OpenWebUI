import { StyleSheet } from 'react-native';
/**
 * Styles pour la page de conversation.
 */
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    menuButton: {
        padding: 5,
    },
    modelSelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modelName: {
        color: 'white',
        fontSize: 16,
        marginRight: 5,
    },
    newChatButton: {
        padding: 5,
    },
    chatArea: {
        flex: 1,
        padding: 1,
    },
    inputContainer: {
        padding: 10,
        paddingBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 25,
        paddingHorizontal: 10,
    },
    attachButton: {
        padding: 10,
    },
    input: {
        flex: 1,
        color: 'white',
        padding: 10,
        fontSize: 16,
    },
    sendButton: {
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    modalContent: {
        backgroundColor: '#222',
        marginTop: 60,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        padding: 15,
        maxHeight: '50%',
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modelItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    selectedModelItem: {
        backgroundColor: '#333',
    },
    modelItemText: {
        color: 'white',
        fontSize: 16,
    },
    historiqueContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    historiqueContent: {
        width: '80%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    historiqueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    historiqueTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    historiqueCloseButton: {
        color: 'white',
        fontSize: 24,
    },
    historiqueSection: {
        color: '#888',
        fontSize: 14,
        marginVertical: 10,
    },
    conversationItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    conversationTitle: {
        color: 'white',
        fontSize: 16,
    },
    parametresButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 30,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    parametresText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    messagesContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 10,
    },
    messageBox: {
        padding: 12,
        borderRadius: 12,
        marginVertical: 8,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#3a3a3a', 
        paddingHorizontal: 12,
        borderRadius: 12,
        marginVertical: 5,
        marginRight: 10,
        marginLeft: 50,
        borderWidth: 1,
        borderColor: '#444444',
        borderStyle: 'solid',
    },
    aiMessage: {
        backgroundColor: '#3a3a3a',
        paddingHorizontal: 12,
        borderRadius: 12,
        marginVertical: 5,
        marginRight: 50,
        marginLeft: 5,
        alignSelf: 'flex-start',
        width: "85%",
    },
    messageText: {
        color: 'white',
        fontSize: 16,  
        lineHeight: 22, 
    },
    messageRole: {
        color: '#ccc',
        fontSize: 12,
        marginTop: 4,
    },
    messagesContent: {
        padding: 10,
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
    },
    emptyConversationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        minHeight: 300,
    },
    emptyConversationText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 15,
        textAlign: 'center',
    },
    emptyConversationSubtext: {
        fontSize: 14,
        color: '#777',
        marginTop: 8,
        textAlign: 'center',
    },
    parametresModalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 100,
        alignItems: 'flex-end',
        paddingRight: 20,
        maxWidth: '100%', 
    },
    modalOptions: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
      
    optionBox: {
        backgroundColor: '#3a3a3a',
        padding: 15,
        borderRadius: 10,
        elevation: 5,
        width: 200,
        gap: 10,
    },
      
    optionText: {
        fontSize: 16,
        textAlign: 'center',
    },
    messageInfoContainer: {
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#444',
        paddingTop: 8,
    },
    messageTimestamp: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 8,
    },
    messageActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 5,
    },
    textInputEdition: {
        fontSize: 16,
        color: 'white',
        backgroundColor: 'gray',
        padding: 8,
        borderRadius: 8,
    },
    // Mode hors-ligne
    labelTitreHorsLigne: {
        color: 'orange',
        fontSize: 16,
        fontWeight: "bold",
    },
    conteneurLabelTitreHorsLigne: {
        borderWidth: 2,
        borderBlockColor: "orange",
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
    },
    newChatButtonDisabled: {
        padding: 5,
        color: 'red',
    },
    conteneurCommentaireHorsLigne: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentaireHorsLigne: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputContainerInvisible: {
        display: 'none',
    },
    boutonRecharger: {
        padding: 5,
    },
    optionsModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    optionsModalContent: {
        position: 'absolute',
        top:460,
        left:10,
        backgroundColor: '#333',
        borderRadius: 12,
        padding: 20,
        width: '80%'
    },
    titreModal: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    optionsLigne: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    optionLabel: {
        color: 'white',
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalButton: {
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5
    },
    modalButtonText: {
        color: '#999'
    },
});
export default styles;