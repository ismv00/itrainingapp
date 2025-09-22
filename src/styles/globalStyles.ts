import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 6,
  },
  input: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    padding: 14,
    color: colors.text,
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: colors.greenText,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: colors.blackText,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
