import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  updateProfile,
  IdTokenResult,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

// Mock user for local development
let mockUser: User | null = null;

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

/**
 * Sign up a new user with email and password
 * Creates user document in Firestore with name and empty subjects array
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential | { user: User }> => {
  if (isDevelopment) {
    // Mock implementation for local development
    mockUser = {
      uid: "mock-user-id",
      email: email,
      displayName: displayName,
      isAnonymous: false,
      emailVerified: true,
      phoneNumber: null,
      photoURL: null,
      providerData: [],
      refreshToken: "",
      tenantId: null,
      delete: () => Promise.resolve(),
      getIdToken: () => Promise.resolve("mock-token"),
      getIdTokenResult: () => Promise.resolve({} as IdTokenResult),
      reload: () => Promise.resolve(),
      toJSON: () => ({})
    } as User;
    
    return { user: mockUser };
  }
  
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }

    // Create user document in Firestore
    const userDocRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userDocRef, {
      name: displayName,
      email: email,
      createdAt: serverTimestamp(),
      subjects: [],
    });

    return userCredential;
  } catch (error) {
    const err = error as Error;
    console.error("Error signing up:", err);
    throw err;
  }
};

/**
 * Sign in existing user with email and password
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential | { user: User }> => {
  if (isDevelopment) {
    // Mock implementation for local development
    mockUser = {
      uid: "mock-user-id",
      email: email,
      displayName: "Mock User",
      isAnonymous: false,
      emailVerified: true,
      phoneNumber: null,
      photoURL: null,
      providerData: [],
      refreshToken: "",
      tenantId: null,
      delete: () => Promise.resolve(),
      getIdToken: () => Promise.resolve("mock-token"),
      getIdTokenResult: () => Promise.resolve({} as IdTokenResult),
      reload: () => Promise.resolve(),
      toJSON: () => ({})
    } as User;
    
    return { user: mockUser };
  }
  
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    const err = error as Error;
    console.error("Error signing in:", err);
    throw err;
  }
};

/**
 * Sign out current user
 */
export const logout = async (): Promise<void> => {
  if (isDevelopment) {
    // Mock implementation for local development
    mockUser = null;
    return Promise.resolve();
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    const err = error as Error;
    console.error("Error signing out:", err);
    throw err;
  }
};

/**
 * Subscribe to authentication state changes
 * @param callback Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChangedListener = (
  callback: (user: User | null) => void
): (() => void) => {
  if (isDevelopment) {
    // Mock implementation for local development
    callback(mockUser);
    // Simulate auth state changes
    const interval = setInterval(() => {
      callback(mockUser);
    }, 1000);
    
    return () => clearInterval(interval);
  }
  
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  if (isDevelopment) {
    return mockUser;
  }
  
  return auth.currentUser;
};

/**
 * Check if user has completed onboarding (has subjects)
 */
export const hasUserCompletedOnboarding = async (
  userId: string
): Promise<boolean> => {
  if (isDevelopment) {
    // Mock implementation for local development
    return true;
  }
  
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    const subjects = userData?.subjects || [];

    return Array.isArray(subjects) && subjects.length > 0;
  } catch (error) {
    const err = error as Error;
    console.error("Error checking onboarding status:", err);
    return false;
  }
};