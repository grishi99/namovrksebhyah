import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const { firestore } = initializeFirebase();

export type SharePlatform = 'whatsapp' | 'facebook' | 'instagram' | 'copy_link' | 'native_share';

export interface ShareEvent {
    userId?: string;
    userEmail?: string;
    platform: SharePlatform;
    location: 'header' | 'thank_you_page';
}

export const logShareEvent = async (event: ShareEvent) => {
    try {
        const eventsRef = collection(firestore, 'share_events');
        await addDoc(eventsRef, {
            ...event,
            timestamp: serverTimestamp(),
        });
        console.log('Share event logged:', event);
    } catch (error) {
        console.error('Error logging share event:', error);
    }
};
