'use client';

import { useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db as firestoreDb } from '@/lib/firebase/client';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'consumer' | 'provider' | 'admin';
  [key: string]: any;
}

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser) => {
        if (!mounted) return;
        setUser(firebaseUser);
        setLoading(false);

        if (firebaseUser) {
          try {
            const userDoc = await getDoc(
              doc(firestoreDb, 'users', firebaseUser.uid)
            );
            if (userDoc.exists()) {
              const data = userDoc.data();
              setAuthUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: data.role || 'consumer',
                ...data,
              } as AuthUser);
            } else {
              // User doc doesn't exist yet - treat as consumer
              setAuthUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: 'consumer',
              } as AuthUser);
            }
          } catch (err) {
            setError(err as Error);
          }
        } else {
          setAuthUser(null);
        }
      },
      (err) => {
        if (!mounted) return;
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userDoc = await getDoc(
          doc(firestoreDb, 'users', currentUser.uid)
        );
        if (userDoc.exists()) {
          const data = userDoc.data();
          setAuthUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role: data.role || 'consumer',
            ...data,
          } as AuthUser);
        }
      } catch (err) {
        console.error('Failed to refresh user data:', err);
      }
    }
  };

  return {
    user: authUser,
    firebaseUser: user,
    loading,
    error,
    refreshUser,
    isAuthenticated: !!authUser,
    isProvider: authUser?.role === 'provider' || authUser?.role === 'admin',
    isAdmin: authUser?.role === 'admin',
  };
}
