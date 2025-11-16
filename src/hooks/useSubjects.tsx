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

/**
 * Hook for managing user subjects
 * Handles CRUD operations for subjects subcollection
 */
export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = getCurrentUser();

  // Load subjects from Firestore
  const loadSubjects = useCallback(async () => {
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
          ...doc.data(),
        } as Subject);
      });

      setSubjects(subjectsData);
    } catch (err: any) {
      console.error("Error loading subjects:", err);
      setError(err.message || "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load subjects on mount and when user changes
  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  // Add a new subject
  const addSubject = useCallback(
    async (name: string, color?: string): Promise<string | null> => {
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
      } catch (err: any) {
        console.error("Error adding subject:", err);
        setError(err.message || "Failed to add subject");
        return null;
      }
    },
    [user, subjects, loadSubjects]
  );

  // Remove a subject
  const removeSubject = useCallback(
    async (subjectId: string): Promise<boolean> => {
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
      } catch (err: any) {
        console.error("Error removing subject:", err);
        setError(err.message || "Failed to remove subject");
        return false;
      }
    },
    [user, loadSubjects]
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

