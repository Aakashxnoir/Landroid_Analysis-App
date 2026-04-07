import React from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  Modal, 
  StyleSheet 
} from 'react-native';
import { THEME } from './theme';

export const LoadingOverlay: React.FC<{ visible: boolean }> = ({ visible }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
        <Text style={styles.loaderText}>Please wait...</Text>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    backgroundColor: THEME.COLORS.TEXT_LIGHT,
    padding: 30,
    borderRadius: THEME.RADIUS.XL,
    alignItems: 'center',
    width: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  loaderText: {
    marginTop: 15,
    fontSize: 14,
    color: THEME.COLORS.TEXT_DARK,
    fontWeight: '500',
  }
});
