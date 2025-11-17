import { useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { getCurrentUser } from "@/services/auth";

export interface Subject {
  id: string;
  name: string;
  createdAt: Timestamp;
  color?: string;
}

// Mock subjects for local development
const mockSubjects: Subject[] = [
  {
    id: "1",
    name: "Mathematics",
    createdAt: Timestamp.now(),
    color: "bg-primary"
  },
  {
    id: "2",
    name: "Physics",
    createdAt: Timestamp.now(),
    color: "bg-secondary"
  },
  {
    id: "3",
    name: "Computer Science",
    createdAt: Timestamp.now(),
    color: "bg-accent"
  }
];

/**
 * Hook for managing user subjects
 * Handles CRUD operations for subjects subcollection
 */
export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = getCurrentUser();
  
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;

  // Load subjects from Firestore
  const loadSubjects = useCallback(async () => {
    if (isDevelopment) {
      // Mock implementation for local development
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSubjects(mockSubjects);
      setLoading(false);
      return;
    }
    
    if (!user) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const subjectsRef = collection(db, "users", user.uid, "subjects");
      const q = query(subjectsRef, orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);

      const subjectsData: Subject[] = [];
      querySnapshot.forEach((doc) => {
        subjectsData.push({
          id: doc.id,
          ...(doc.data() as Omit<Subject, "id">),
        });
      });

      setSubjects(subjectsData);
    } catch (err) {
      const error = err as Error;
      console.error("Error loading subjects:", error);
      setError(error.message || "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  }, [user, isDevelopment]);

  // Load subjects on mount and when user changes
  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  // Add a new subject
  const addSubject = useCallback(
    async (name: string, color?: string): Promise<string | null> => {
      if (isDevelopment) {
        // Mock implementation for local development
        try {
          setError(null);
          
          // Check if subject already exists
          const existingSubject = subjects.find(
            (s) => s.name.toLowerCase() === name.toLowerCase()
          );
          if (existingSubject) {
            setError("Subject already exists");
            return null;
          }
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const newSubject: Subject = {
            id: `mock-${Date.now()}`,
            name: name.trim(),
            createdAt: Timestamp.now(),
            color: color || "bg-primary",
          };
          
          setSubjects(prev => [...prev, newSubject]);
          return newSubject.id;
        } catch (err) {
          const error = err as Error;
          console.error("Error adding subject:", error);
          setError(error.message || "Failed to add subject");
          return null;
        }
      }
      
      if (!user) {
        setError("User not authenticated");
        return null;
      }

      // Check if subject already exists
      const existingSubject = subjects.find(
        (s) => s.name.toLowerCase() === name.toLowerCase()
      );
      if (existingSubject) {
        setError("Subject already exists");
        return null;
      }

      try {
        setError(null);
        const subjectsRef = collection(db, "users", user.uid, "subjects");
        const docRef = await addDoc(subjectsRef, {
          name: name.trim(),
          createdAt: Timestamp.now(),
          color: color || "bg-primary",
        });

        // Reload subjects to get updated list
        await loadSubjects();
        return docRef.id;
      } catch (err) {
        const error = err as Error;
        console.error("Error adding subject:", error);
        setError(error.message || "Failed to add subject");
        return null;
      }
    },
    [user, subjects, loadSubjects, isDevelopment]
  );

  // Remove a subject
  const removeSubject = useCallback(
    async (subjectId: string): Promise<boolean> => {
      if (isDevelopment) {
        // Mock implementation for local development
        try {
          setError(null);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          setSubjects(prev => prev.filter(s => s.id !== subjectId));
          return true;
        } catch (err) {
          const error = err as Error;
          console.error("Error removing subject:", error);
          setError(error.message || "Failed to remove subject");
          return false;
        }
      }
      
      if (!user) {
        setError("User not authenticated");
        return false;
      }

      try {
        setError(null);
        const subjectRef = doc(db, "users", user.uid, "subjects", subjectId);
        await deleteDoc(subjectRef);

        // Reload subjects to get updated list
        await loadSubjects();
        return true;
      } catch (err) {
        const error = err as Error;
        console.error("Error removing subject:", error);
        setError(error.message || "Failed to remove subject");
        return false;
      }
    },
    [user, loadSubjects, isDevelopment]
  );

  // Get subject names as array (for compatibility)
  const getSubjectNames = useCallback((): string[] => {
    return subjects.map((s) => s.name);
  }, [subjects]);

  return {
    subjects,
    loading,
    error,
    addSubject,
    removeSubject,
    getSubjectNames,
    reload: loadSubjects,
  };
};