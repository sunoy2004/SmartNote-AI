import { useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";

export interface Subject {
  id: string;
  name: string;
  createdAt: Timestamp;
  color?: string;
}

const subjectColors = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-cyan-500",
];

const getColorForSubject = (index: number) => {
  return subjectColors[index % subjectColors.length];
};

/**
 * Hook for managing user subjects
 * Handles CRUD operations for subjects subcollection
 */
export const useSubjects = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      querySnapshot.forEach((docSnap, index) => {
        subjectsData.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Subject, "id">),
          color:
            (docSnap.data().color as string | undefined) ??
            getColorForSubject(index),
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

      // Ensure name is a string
      if (typeof name !== "string") {
        setError("Subject name must be a string");
        return null;
      }

      const subjectName = name.trim();
      if (!subjectName) {
        setError("Subject name cannot be empty");
        return null;
      }

      const exists = subjects.find(
        (s) => s.name.toLowerCase() === subjectName.toLowerCase()
      );
      if (exists) {
        setError("Subject already exists");
        return null;
      }

      try {
        setError(null);
        const subjectsRef = collection(db, "users", user.uid, "subjects");
        const docRef = await addDoc(subjectsRef, {
          name: subjectName,
          createdAt: Timestamp.now(),
          color: color || getColorForSubject(subjects.length),
        });

        await loadSubjects();
        return docRef.id;
      } catch (err) {
        const error = err as Error;
        console.error("Error adding subject:", error);
        setError(error.message || "Failed to add subject");
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
        await loadSubjects();
        return true;
      } catch (err) {
        const error = err as Error;
        console.error("Error removing subject:", error);
        setError(error.message || "Failed to remove subject");
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