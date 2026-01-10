import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { getDb, getAuth } from './firebase';
import { Category, CategoryInput } from '@/types';
import { FIREBASE_COLLECTIONS } from './constants';

export async function createCategory(input: CategoryInput): Promise<string> {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error('로그인이 필요합니다');
  }

  const db = getDb();
  const now = Timestamp.now();

  const docRef = await addDoc(collection(db, FIREBASE_COLLECTIONS.CATEGORIES), {
    name: input.name,
    userId: auth.currentUser.uid,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

export async function getCategories(): Promise<Category[]> {
  const auth = getAuth();
  if (!auth.currentUser) {
    return [];
  }

  const db = getDb();
  const q = query(
    collection(db, FIREBASE_COLLECTIONS.CATEGORIES),
    where('userId', '==', auth.currentUser.uid),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
}

export async function updateCategory(id: string, input: CategoryInput): Promise<void> {
  const db = getDb();
  const docRef = doc(db, FIREBASE_COLLECTIONS.CATEGORIES, id);

  await updateDoc(docRef, {
    name: input.name,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  const db = getDb();
  const docRef = doc(db, FIREBASE_COLLECTIONS.CATEGORIES, id);
  await deleteDoc(docRef);
}
