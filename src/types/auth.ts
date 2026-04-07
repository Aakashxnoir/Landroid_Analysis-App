import { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'Land Consultant' | 'Landowner';

export interface AppProfile {
  name: string;
  role: UserRole;
  location: string;
  isProfileComplete: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: FirebaseUser | null;
  profile: AppProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboardingRequired: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (user: FirebaseUser) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (name: string, role: UserRole, location: string) => Promise<void>;
  refreshToken: () => Promise<void>;
}
