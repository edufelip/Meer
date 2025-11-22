import type { AuthUser } from "../../domain/entities/AuthUser";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import { firebaseAuth } from "../../services/firebase/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithCredential, GoogleAuthProvider } from "firebase/auth";

const toAuthUser = (user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }): AuthUser => ({
  id: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoUrl: user.photoURL
});

export class AuthRepositoryFirebase implements AuthRepository {
  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    const auth = firebaseAuth();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return toAuthUser(cred.user);
  }

  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<AuthUser> {
    const auth = firebaseAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    return toAuthUser(cred.user);
  }

  async signInWithGoogleIdToken(idToken: string): Promise<AuthUser> {
    const auth = firebaseAuth();
    const credential = GoogleAuthProvider.credential(idToken);
    const cred = await signInWithCredential(auth, credential);
    return toAuthUser(cred.user);
  }
}
