import { StyleSheet } from 'react-native';
/**
 * Styles pour le selecteur de modele LLM.
 */
export const styles = StyleSheet.create({
  modelSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelText: {
    color: 'white',
    fontSize: 16,
    marginRight: 5,
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
});

export default styles;