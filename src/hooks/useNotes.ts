import { useState, useEffect, useCallback } from "react";
import { collection, query, orderBy, getDocs, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";

export interface Note {
  id: string;
  subject: string;
  subjectConfidence?: number;
  title: string;
  transcript: string;
  summary: string;
  notes: string;
  createdAt: Timestamp | Date | null;
  durationMs?: number;
  audioUrl?: string | null;
  stats?: {
    words: number;
    characters: number;
  };
}

/**
 * Safely convert Firestore Timestamp to Date
 */
export const toDate = (value: Timestamp | Date | null | undefined): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === "object" && "seconds" in value) {
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  return null;
};

type TimestampValue = Timestamp | { seconds: number; nanoseconds: number } | null;

const parseTimestamp = (value: TimestampValue): Date | null => {
  if (!value) return null;
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (typeof value === "object" && "seconds" in value) {
    return new Date(value.seconds * 1000);
  }
  return null;
};

/**
 * Hook for managing user notes
 * Handles fetching notes from Firestore
 */
export const useNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notes from Firestore
  const loadNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const notesRef = collection(db, "users", user.uid, "notes");
      const q = query(notesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const notesData: Note[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const createdAt = data.createdAt ? (data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt) : null;
        notesData.push({
          id: docSnap.id,
          subject: data.subject || "General",
          subjectConfidence: data.subjectConfidence,
          title: data.title || "Untitled Note",
          transcript: data.transcript || "",
          summary: data.summary || "",
          notes: data.notes || "",
          createdAt: createdAt,
          durationMs: data.durationMs,
          audioUrl: data.audioUrl || null,
          stats: data.stats,
        });
      });

      setNotes(notesData);
    } catch (err) {
      const error = err as Error;
      console.error("Error loading notes:", error);
      setError(error.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load notes on mount and when user changes
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Get a single note by ID
  const getNote = useCallback(
    async (noteId: string): Promise<Note | null> => {
      if (!user) return null;

      try {
        const noteRef = doc(db, "users", user.uid, "notes", noteId);
        const noteSnap = await getDoc(noteRef);

        if (!noteSnap.exists()) {
          return null;
        }

        const data = noteSnap.data();
        const createdAt = data.createdAt ? (data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt) : null;
        return {
          id: noteSnap.id,
          subject: data.subject || "General",
          subjectConfidence: data.subjectConfidence,
          title: data.title || "Untitled Note",
          transcript: data.transcript || "",
          summary: data.summary || "",
          notes: data.notes || "",
          createdAt: createdAt,
          durationMs: data.durationMs,
          audioUrl: data.audioUrl || null,
          stats: data.stats,
        };
      } catch (err) {
        const error = err as Error;
        console.error("Error fetching note:", error);
        return null;
      }
    },
    [user]
  );

  return {
    notes,
    loading,
    error,
    loadNotes,
    getNote,
  };
};

