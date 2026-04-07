import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import SecureStoreService from '../services/secureStore';
import { AuthContextValue, AppProfile, UserRole } from '../types/auth';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if onboarding is required
  const onboardingRequired = !!user && (!profile || !profile.isProfileComplete);

  useEffect(() => {
    // 1. Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth State Changed:', firebaseUser ? `User: ${firebaseUser.uid}` : 'No User');
      if (firebaseUser) {
        try {
          // 2. User is logged in. Get token and store securely
          const idToken = await firebaseUser.getIdToken();
          await SecureStoreService.saveToken(idToken);
          
          // 3. Fetch app-specific profile (Mocked logic for now)
          await fetchProfile(firebaseUser);
          
          setUser(firebaseUser);
        } catch (error) {
          console.error('Error during auth state processing:', error);
        }
      } else {
        // 4. User logged out. Clear all state
        setUser(null);
        setProfile(null);
        await SecureStoreService.removeToken();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (firebaseUser: User) => {
    try {
      // Use UID-specific key to isolate profiles on the same device
      const profileKey = `app_profile_metadata_${firebaseUser.uid}`;
      const storedProfile = await SecureStoreService.getGeneric(profileKey);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        setProfile(null);
      }
    } catch (e) {
      setProfile(null);
    }
  };

  const login = async (firebaseUser: User) => {
    // This is called after OTP or Google Sign-In success
    const idToken = await firebaseUser.getIdToken();
    await SecureStoreService.saveToken(idToken);
    await fetchProfile(firebaseUser);
    setUser(firebaseUser);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      await SecureStoreService.removeToken();
      setUser(null);
      setProfile(null);
    } catch (e) {
      // Handle logout error
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    if (auth.currentUser) {
      const idToken = await auth.currentUser.getIdToken(true);
      await SecureStoreService.saveToken(idToken);
    }
  };

  const completeOnboarding = async (name: string, role: UserRole, location: string) => {
    if (!user) return;
    
    const newProfile: AppProfile = { name, role, location, isProfileComplete: true };
    // 1. Save locally using UID-specific key (simulating backend storage)
    const profileKey = `app_profile_metadata_${user.uid}`;
    await SecureStoreService.saveGeneric(profileKey, JSON.stringify(newProfile));
    
    // 2. Update state
    setProfile(newProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        onboardingRequired,
        login,
        logout,
        completeOnboarding,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
