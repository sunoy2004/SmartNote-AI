import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  updateProfile,
  IdTokenResult,
  FirebaseError,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

// Mock user for local development
let mockUser: User | null = null;

// Check if we're using mock Firebase config (only use mocks when config is actually mock)
const isUsingMockConfig = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.REACT_APP_FIREBASE_API_KEY;
  return !apiKey || apiKey === "mock-api-key" || apiKey.startsWith("mock-");
};

/**
 * Convert Firebase auth errors to user-friendly messages
 */
const getAuthErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "code" in error) {
    const firebaseError = error as FirebaseError;
    switch (firebaseError.code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
        return "No account found with this email. Please sign up first.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "An account with this email already exists. Please login instead.";
      case "auth/weak-password":
        return "Password is too weak. Please use at least 6 characters.";
      case "auth/invalid-email":
        return "Invalid email address. Please check and try again.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      case "auth/operation-not-allowed":
        return "Email/password authentication is not enabled. Please contact support.";
      default:
        return firebaseError.message || "An error occurred. Please try again.";
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
};

/**
 * Sign up a new user with email and password
 * Creates user document in Firestore with name and empty subjects array
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential | { user: User }> => {
  if (isUsingMockConfig()) {
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
    console.error("Error signing up:", error);
    const friendlyMessage = getAuthErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

/**
 * Sign in existing user with email and password
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential | { user: User }> => {
  if (isUsingMockConfig()) {
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
    console.error("Error signing in:", error);
    const friendlyMessage = getAuthErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

/**
 * Sign out current user
 */
export const logout = async (): Promise<void> => {
  if (isUsingMockConfig()) {
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
  if (isUsingMockConfig()) {
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
  if (isUsingMockConfig()) {
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
  if (isUsingMockConfig()) {
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