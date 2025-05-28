import { StyleSheet } from 'react-native';
/**
 * Styles pour la page de Ajouter un serveur.
 */
export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#444',
    borderRadius: 5,
    padding: 10,
    color: 'white',
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  validateButton: {
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  validateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  validateButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.7,
  },

  ligneChoixTypeConnexion: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 20,
    marginTop: 5,
    marginBottom: 10,
  },
  boutonChoixTypeConnexion: {
    backgroundColor: "black",
    color: "white",
    borderColor: "white",
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
    opacity: 0.4,
  },
  boutonChoixTypeConnexionAppuye: {
    backgroundColor: "white",
    color: "black",
    borderColor: "gray",
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 3,
    padding: 7,
  }

});

export default styles;