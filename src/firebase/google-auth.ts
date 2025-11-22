import { Auth, GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';

export async function signInWithGoogle(auth: Auth): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result;
    } catch (error: any) {
        console.error("Error signing in with Google", error);
        throw error;
    }
}
