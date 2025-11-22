import auth from "@react-native-firebase/auth";
import type { AuthUser } from "../../domain/entities/AuthUser";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import { firebaseAuth } from "../../services/firebase/firebase";

const toAuthUser = (user: auth.FirebaseAuthTypes.User): AuthUser => ({
  id: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoUrl: user.photoURL
});

export class AuthRepositoryFirebase implements AuthRepository {
  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    const cred = await firebaseAuth().signInWithEmailAndPassword(email, password);
    return toAuthUser(cred.user);
  }

  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<AuthUser> {
    const cred = await firebaseAuth().createUserWithEmailAndPassword(email, password);
    if (displayName) {
      await cred.user.updateProfile({ displayName });
    }
    return toAuthUser(cred.user);
  }

  async signInWithGoogleIdToken(idToken: string): Promise<AuthUser> {
    const credential = auth.GoogleAuthProvider.credential(idToken);
    const cred = await firebaseAuth().signInWithCredential(credential);
    return toAuthUser(cred.user);
  }
}
