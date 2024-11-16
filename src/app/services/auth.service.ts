import {inject, Injectable} from '@angular/core';
import {
  Auth, getAuth,
  GoogleAuthProvider, signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

// Define interface for user data
interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastLogin: string;
  updatedAt: string;
  createdAt?: string; // Optional field for new users
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserData | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  auth = inject(Auth);

  constructor(
    private firestore: Firestore
  ) {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userData = await this.getUserData(user.uid);
          this.currentUserSubject.next(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          this.currentUserSubject.next(null);
        }
      } else {
        this.currentUserSubject.next(null);
      }
    });

    this.auth = getAuth();
  }

  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);

      // Save user data to Firestore
      await this.saveUserData(credential.user);

      return credential;
    } catch (error: any) {
      console.error('Google sign-in error:', error);

      if (error.code === 'permission-denied') {
        throw new Error('Database permission denied. Please check Firestore rules.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed.');
      } else {
        throw new Error(error.message || 'An error occurred during sign-in');
      }
    }
  }

  private async saveUserData(user: any): Promise<void> {
    try {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      const userDoc = await getDoc(userRef);

      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (!userDoc.exists()) {
        // For new users, add creation date
        const newUserData: UserData = {
          ...userData,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newUserData);
      } else {
        // For existing users, update their data
        await setDoc(userRef, userData, { merge: true });
      }

    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('Failed to save user data');
    }
  }

  private async getUserData(uid: string): Promise<UserData> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      } else {
        throw new Error('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      this.currentUserSubject.next(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }


  signIn(email:any,password:any){
    return signInWithEmailAndPassword(this.auth,email,password);
  }
}
