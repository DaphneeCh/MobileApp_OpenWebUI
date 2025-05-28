import { StyleSheet } from 'react-native';
/*Styles pour les controles du chat
*/
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'transparent',
    },
    chatControlsCard: {
      backgroundColor: '#333',
      borderRadius: 12,
      padding: 20,
      width: '100%',
      marginHorizontal: 0,
      marginBottom: 0,
    },
    cardTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16
    },
    paramRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    },
    paramLabel: {
      color: 'white',
      fontSize: 16
    },
    modifyButton: {
      color: '#999',
      fontSize: 14,
      textDecorationLine: 'underline'
    },
    sliderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16
    },
    slider: {
      flex: 1,
      height: 40
    },
    temperatureValue: {
      color: 'white',
      marginLeft: 10,
      fontSize: 16
    },
    resetButton: {
      alignSelf: 'flex-end'
    },
    resetButtonText: {
      color: '#999',
      fontSize: 14,
      textDecorationLine: 'underline'
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalContent: {
      backgroundColor: '#333',
      borderRadius: 12,
      padding: 20,
      width: '80%'
    },
    modalTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16
    },
    textInput: {
      backgroundColor: '#444',
      borderRadius: 8,
      padding: 12,
      color: 'white',
      marginBottom: 16,
      minHeight: 100
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
    saveButton: {
      backgroundColor: '#4a80f5'
    },
    saveButtonText: {
      color: 'white',
      fontWeight: 'bold'
    }
});

export default styles;