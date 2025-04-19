import {inject, Injectable} from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, getAuth,
  GoogleAuthProvider, signInWithEmailAndPassword,
  signInWithPopup, updateProfile,
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

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  lastLogin: string;
  updatedAt: string;
  createdAt?: string;
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
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (!userDoc.exists()) {
        const newUserData: UserData = {
          ...userData,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newUserData);
      } else {
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

  async signUp(email: any, password: any, displayName: any,phoneNumber: any): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, {
          displayName: displayName,
        });
        const userData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          phoneNumber: phoneNumber,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        const userRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userRef, userData);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      throw new Error('Failed to sign up. Please try again.');
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
