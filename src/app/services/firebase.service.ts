import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;

  constructor() {
    // No lanzar errores en constructor; init() intenta inicializar y registra errores.
    try {
      this.init();
    } catch (err) {
      console.error('FirebaseService constructor init failed', err);
    }
  }

  /**
   * Inicializa Firebase si no está inicializado aún.
   * Usa la configuración expuesta en src/environments/environment.ts
   */
  init(): void {
    try {
      if (!this.app) {
        // Evita inicializar múltiples apps si ya existe alguna (útil en HMR / tests)
        if (getApps().length === 0) {
          this.app = initializeApp(environment.firebase);
          console.log('FirebaseService: initialized new Firebase app');
        } else {
          // Reusar la primera app existente
          this.app = getApps()[0] as FirebaseApp;
          console.log('FirebaseService: reused existing Firebase app');
        }
        this.db = getFirestore(this.app);
      }
    } catch (err) {
      console.error('FirebaseService: init error', err);
      // Re-lanzar para que los llamadores puedan detectar el fallo si lo desean
      throw err;
    }
  }

  isInitialized(): boolean {
    return !!this.app && !!this.db;
  }

  getDb(): Firestore {
    if (!this.db) {
      this.init();
    }
    if (!this.db) {
      // Si por alguna razón no se pudo inicializar, lanzar error descriptivo
      throw new Error('Firestore no está inicializado. Revisa la configuración de Firebase y las reglas.');
    }
    return this.db as Firestore;
  }

  /**
   * Agrega un documento a la colección indicada.
   * Devuelve el id del documento creado.
   */
  async addToCollection(collectionName: string, data: any): Promise<string> {
    try {
      const db = this.getDb();
      const colRef = collection(db, collectionName);
      const docRef = await addDoc(colRef, data);
      console.log(`FirebaseService: documento añadido a ${collectionName} id=${docRef.id}`);
      return docRef.id;
    } catch (err) {
      console.error('FirebaseService: addToCollection error', err);
      throw err;
    }
  }

  /**
   * Asigna (create/replace) un documento con id específico.
   */
  async setDocument(collectionName: string, docId: string, data: any): Promise<void> {
    try {
      const db = this.getDb();
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data);
      console.log(`FirebaseService: documento guardado en ${collectionName}/${docId}`);
    } catch (err) {
      console.error('FirebaseService: setDocument error', err);
      throw err;
    }
  }
}