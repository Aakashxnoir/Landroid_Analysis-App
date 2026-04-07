import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('CRITICAL APP CRASH:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaProvider>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 24 }}>
            <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 20, width: '100%', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}>
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 8 }}>Something went wrong</Text>
              <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 24 }}>The app encountered an unexpected error.</Text>
              
              <View style={{ backgroundColor: '#FEE2E2', padding: 16, borderRadius: 12, marginBottom: 24 }}>
                <Text style={{ color: '#B91C1C', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 12 }}>
                  {String(this.state.error)}
                </Text>
              </View>

              <TouchableOpacity 
                style={{ backgroundColor: '#4F46E5', height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  this.setState({ hasError: false, error: null });
                  // Optionally RELOAD here if possible in the environment
                }}
              >
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Try to Recover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaProvider>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <View style={styles.container}>
            <StatusBar style="auto" />
            <AppNavigator />
          </View>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
