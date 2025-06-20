import {inject, Injectable} from '@angular/core';
import {Firestore, doc, setDoc, deleteDoc, getDocs, getDoc, collection} from '@angular/fire/firestore';
import {ref, Storage, uploadBytes, getDownloadURL, deleteObject} from '@angular/fire/storage';
import {v4 as uuidv4} from 'uuid';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface Lesson {
  lessonId: string;
  subject: string;
  title: string;
  subtitle: string;
  type: string;
  level: string;
  lessonUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private snackBar = inject(MatSnackBar);

  public async saveLesson(data: {
    file: File;
    subject: string;
    title: string;
    subtitle: string;
    type: string;
    level: string;
  }): Promise<void> {
    try {
      console.log('Starting to save lesson with data:', {
        subject: data.subject,
        title: data.title,
        subtitle: data.subtitle,
        type: data.type,
        level: data.level,
        fileName: data.file?.name
      });

      // Validate input data
      if (!data.file) {
        throw new Error('File is required');
      }

      if (!data.subject || !data.title || !data.subtitle || !data.type || !data.level) {
        throw new Error('All form fields are required');
      }

      const lessonId = uuidv4();
      const filePath = `lessons/${lessonId}/${data.file.name}`;
      const fileRef = ref(this.storage, filePath);
      const uploadResult = await uploadBytes(fileRef, data.file);
      const downloadURL = await getDownloadURL(fileRef);

      const lessonData = {
        lessonId,
        subject: data.subject,
        title: data.title,
        subtitle: data.subtitle,
        type: data.type,
        level: data.level,
        lessonUrl: downloadURL,
        fileName: data.file.name,
        fileSize: data.file.size,
        createdAt: new Date().toISOString()
      };

      // Save to Firestore
      const lessonDocRef = doc(this.firestore, `lessons/${lessonId}`);
      await setDoc(lessonDocRef, lessonData);

      this.snackBar.open('Lesson saved successfully', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });

    } catch (error) {
      console.error('Error saving lesson:', error);

      let errorMessage = 'Failed to save lesson';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      this.snackBar.open(`Error: ${errorMessage}`, 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error']
      });

      throw error;
    }
  }

  public async deleteLesson(lessonId: any, fileName: any): Promise<void> {
    try {
      const filePath = `lessons/${lessonId}/${fileName}`;
      const fileRef = ref(this.storage, filePath);
      await deleteObject(fileRef);
      const lessonDocRef = doc(this.firestore, `lessons/${lessonId}`);
      await deleteDoc(lessonDocRef);
      this.snackBar.open('Lesson deleted successfully', 'Close', {duration: 3000, panelClass: ['snackbar-success']});
    } catch (error) {
      this.snackBar.open('Failed to delete lesson', 'Close', {duration: 3000, panelClass: ['snackbar-error']});
      throw new Error('Failed to delete lesson');
    }
  }

  public async getAllLessons(): Promise<any[]> {
    try {
      const lessonsRef = collection(this.firestore, 'lessons');
      const querySnapshot = await getDocs(lessonsRef);
      return querySnapshot.docs.map(doc => ({lessonId: doc.id, ...doc.data()}));
    } catch (error) {
      this.snackBar.open('Failed to fetch lessons', 'Close', {duration: 3000, panelClass: ['snackbar-error']});
      throw new Error('Failed to fetch lessons');
    }
  }

  public async getLessonById(lessonId: any): Promise<any | null> {
    try {
      const lessonRef = doc(this.firestore, `lessons/${lessonId}`);
      const lessonSnap = await getDoc(lessonRef);
      if (lessonSnap.exists()) {
        return {lessonId, ...lessonSnap.data()};
      } else {
        return null;
      }
    } catch (error) {
      this.snackBar.open('Failed to fetch lesson', 'Close', {duration: 3000, panelClass: ['snackbar-error']});
      throw new Error('Failed to fetch lesson');
    }
  }
}
