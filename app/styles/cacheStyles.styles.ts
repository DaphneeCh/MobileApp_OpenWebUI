import { StyleSheet } from 'react-native';

export const cacheStyles = StyleSheet.create({
  detailsContainer: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: '#121212',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'right',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4a80f5',
    borderRadius: 4,
  },
  usageText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'right',
    marginTop: 4,
  },
});
export default cacheStyles;