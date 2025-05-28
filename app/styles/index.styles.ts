import { StyleSheet } from "react-native";
/**
 * Styles pour la page de Serveur .
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 30,
    marginVertical: 5,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  serverSection: {
    flex: 2,
    marginTop: -50,
    justifyContent: 'center',
    color: 'white',
  },
  serverTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    marginTop: -150,
    textAlign: 'center',
  },
  serverList: {
    backgroundColor: '#e9e3e3',
    borderRadius: 15,
    padding: 10,
  },
  serverButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff20',
  },
  serverNameButton: {
    flex: 1,
  },
  serverText: {
    color: 'black',
    fontSize: 16,
  },
  ellipsis: {
    color: 'black',
    fontSize: 20,
  },
  addServer: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  emptyServerList: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serverOptionsContainer: {
    width: '80%',
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  serverOptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  serverOptionButton: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
  },
  serverOptionButtonDanger: {
    backgroundColor: '#ff4d4d',
  },
  serverOptionButtonCancel: {
    backgroundColor: '#555',
  },
  serverOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  serverOptionTextDanger: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  settingsButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#f0f0f0',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addServerButton: {
    backgroundColor: 'gray', 
    width: 50,
    height: 50,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default styles;