import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

/**
 * Sign up a new user with email and password
 * Creates user document in Firestore with name and empty subjects array
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> => {
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
  } catch (error: any) {
    console.error("Error signing up:", error);
    throw error;
  }
};

/**
 * Sign in existing user with email and password
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw error;
  }
};

/**
 * Sign out current user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw error;
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
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Check if user has completed onboarding (has subjects)
 */
export const hasUserCompletedOnboarding = async (
  userId: string
): Promise<boolean> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    const subjects = userData.subjects || [];

    return Array.isArray(subjects) && subjects.length > 0;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
};

