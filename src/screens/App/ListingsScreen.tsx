import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { DESIGN_SYSTEM } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';

const ListingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Land Listings</Text>
      </View>
      <View style={styles.content}>
        <Ionicons name="search-outline" size={64} color={DESIGN_SYSTEM.COLORS.BORDER} />
        <Text style={styles.text}>Browse premium land connections</Text>
        <Text style={styles.subtext}>Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.COLORS.BACKGROUND,
  },
  header: {
    padding: 24,
    paddingTop: 40,
  },
  title: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.H1,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  text: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.SUBTITLE,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
    marginTop: 20,
    textAlign: 'center',
  },
  subtext: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.BODY,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    marginTop: 8,
  }
});

export default ListingsScreen;
