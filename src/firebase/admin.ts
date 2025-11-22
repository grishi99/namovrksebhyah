import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

function getFirebaseAdminApp(): App {
  if (getApps().length) {
    return getApps()[0]!;
  }

  if (serviceAccount) {
    return initializeApp({
      credential: cert(serviceAccount)
    });
  }

  return initializeApp();
}

const adminApp = getFirebaseAdminApp();

export const firestore = getFirestore(adminApp);
export const storage = getStorage(adminApp);
import { getAuth } from 'firebase-admin/auth';

export const adminAuth = getAuth(adminApp);
