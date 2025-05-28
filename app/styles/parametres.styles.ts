import { StyleSheet } from 'react-native';

/**
 * Styles pour la page de paramètres.
 * @type {StyleSheet}
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: {
    fontSize: 16,
    color: 'white',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingSubText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  settingValue: {
    fontSize: 14,
    color: '#888',
  },
  actionButton: {
    backgroundColor: '#4a80f5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default styles;