import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { getDb, getAuth } from './firebase';
import { Recipe, RecipeInput } from '@/types';
import { FIREBASE_COLLECTIONS } from './constants';

export async function createRecipe(input: RecipeInput): Promise<string> {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error('로그인이 필요합니다');
  }

  const db = getDb();
  const now = Timestamp.now();

  const docRef = await addDoc(collection(db, FIREBASE_COLLECTIONS.RECIPES), {
    ...input,
    userId: auth.currentUser.uid,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

export async function getRecipes(categoryId?: string): Promise<Recipe[]> {
  const auth = getAuth();
  if (!auth.currentUser) {
    return [];
  }

  const db = getDb();
  let q;

  if (categoryId) {
    q = query(
      collection(db, FIREBASE_COLLECTIONS.RECIPES),
      where('userId', '==', auth.currentUser.uid),
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(
      collection(db, FIREBASE_COLLECTIONS.RECIPES),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Recipe[];
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const db = getDb();
  const docRef = doc(db, FIREBASE_COLLECTIONS.RECIPES, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Recipe;
}

export async function updateRecipe(id: string, input: Partial<RecipeInput>): Promise<void> {
  const db = getDb();
  const docRef = doc(db, FIREBASE_COLLECTIONS.RECIPES, id);

  await updateDoc(docRef, {
    ...input,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteRecipe(id: string): Promise<void> {
  const db = getDb();
  const docRef = doc(db, FIREBASE_COLLECTIONS.RECIPES, id);
  await deleteDoc(docRef);
}
