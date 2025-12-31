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
} from 'firebase/firestore';
import { getDb } from './firebase';
import { Category, CategoryInput } from '@/types';
import { FIREBASE_COLLECTIONS } from './constants';

export async function createCategory(input: CategoryInput): Promise<string> {
  const db = getDb();
  const now = Timestamp.now();

  const docRef = await addDoc(collection(db, FIREBASE_COLLECTIONS.CATEGORIES), {
    name: input.name,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

export async function getCategories(): Promise<Category[]> {
  const db = getDb();
  const q = query(
    collection(db, FIREBASE_COLLECTIONS.CATEGORIES),
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
