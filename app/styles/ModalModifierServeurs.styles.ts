import { StyleSheet } from 'react-native';
/**
 * Styles pour le composant ModalModifierServeurs
 */
export const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalView: {
        width: '80%',
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#fff',
      },
      label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff',
      },
      input: {
        backgroundColor: '#2a2a2a',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: '#fff',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
      },
      button: {
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
      },
      buttonCancel: {
        backgroundColor: '#555',
      },
      buttonSubmit: {
        backgroundColor: '#007AFF',
      },
      buttonDisabled: {
        backgroundColor: '#555',
        opacity: 0.7,
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
})

export default styles;