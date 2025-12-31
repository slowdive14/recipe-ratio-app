import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getStorage, Storage } from 'firebase-admin/storage';

let app: App | undefined;
let storage: Storage | undefined;

function getFirebaseAdminApp(): App {
  if (app) return app;

  const apps = getApps();
  if (apps.length > 0) {
    app = apps[0];
    return app;
  }

  // Initialize with service account credentials
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!privateKey || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PROJECT_ID) {
    throw new Error('Firebase Admin environment variables are not configured');
  }

  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  return app;
}

export function getAdminStorage(): Storage {
  if (storage) return storage;

  getFirebaseAdminApp();
  storage = getStorage();
  return storage;
}

export async function uploadImageToStorage(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const storage = getAdminStorage();
  const bucket = storage.bucket();

  const file = bucket.file(`recipes/${filename}`);

  await file.save(buffer, {
    metadata: {
      contentType: 'image/png',
    },
  });

  // Make the file publicly accessible
  await file.makePublic();

  // Return the public URL
  return `https://storage.googleapis.com/${bucket.name}/recipes/${filename}`;
}
