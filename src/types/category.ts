import { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CategoryInput {
  name: string;
}
