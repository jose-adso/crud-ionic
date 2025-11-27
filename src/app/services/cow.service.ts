import { Injectable } from '@angular/core';

export interface HealthRecord {
  id: string;
  date: string; // ISO date
  type: 'visita_veterinario' | 'vacunacion' | 'tratamiento' | 'otro';
  description: string;
  details?: string;
}

export interface ProductionRecord {
  date: string; // ISO date
  liters: number;
}

export interface Cow {
  id: string;
  cowName: string;
  registrationNumber: string;
  breed: string;
  purchaseDate: string;
  status: 'cargada' | 'en seguimiento' | 'sana';
  inseminationDay: string;
  birthDay: string;
  inseminationBreed: string;
  calfSex: 'pendiente' | 'macho' | 'hembra';
  cowPhoto?: string;
  calfPhoto?: string;
  saleDate?: string;
  purgingDate?: string;
  vaccinationDate?: string;
  vaccines?: string[];
  otherProblems?: string;
  healthHistory?: HealthRecord[];
  productionHistory?: ProductionRecord[];
}

@Injectable({
  providedIn: 'root'
})
export class CowService {
  private STORAGE_KEY = 'cows';

  constructor() { }

  saveCow(cow: Cow): void {
    try {
      const cows = this.getCows();
      cows.push(cow);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cows));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Error: El almacenamiento local está lleno. Por favor, borra algunos datos o fotos para liberar espacio.');
      } else {
        console.error('Error saving cow:', error);
      }
      throw error;
    }
  }

  getCows(): Cow[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) as Cow[] : [];
    } catch (err) {
      return [];
    }
  }

  updateCow(id: string, data: Partial<Cow>): void {
    try {
      const cows = this.getCows();
      const index = cows.findIndex(c => c.id === id);
      if (index !== -1) {
        cows[index] = { ...cows[index], ...data };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cows));
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Error: El almacenamiento local está lleno. Por favor, borra algunos datos o fotos para liberar espacio.');
      } else {
        console.error('Error updating cow:', error);
      }
      throw error;
    }
  }

  deleteCow(id: string): void {
    try {
      const cows = this.getCows().filter(c => c.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cows));
    } catch (error) {
      console.error('Error deleting cow:', error);
      throw error;
    }
  }

  // Health records helpers
  getHealthHistory(cowId: string): HealthRecord[] {
    const cows = this.getCows();
    const cow = cows.find(c => c.id === cowId);
    return cow ? (cow.healthHistory || []) : [];
  }

  addHealthRecord(cowId: string, record: Omit<HealthRecord, 'id'>): HealthRecord | null {
    try {
      const cows = this.getCows();
      const index = cows.findIndex(c => c.id === cowId);
      if (index === -1) return null;
      const newRecord: HealthRecord = { id: Date.now().toString(), ...record };
      cows[index].healthHistory = cows[index].healthHistory || [];
      cows[index].healthHistory!.push(newRecord);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cows));
      return newRecord;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Error: El almacenamiento local está lleno. Por favor, borra algunos datos o fotos para liberar espacio.');
      } else {
        console.error('Error adding health record:', error);
      }
      return null;
    }
  }

  updateHealthRecord(cowId: string, recordId: string, data: Partial<HealthRecord>): boolean {
    try {
      const cows = this.getCows();
      const index = cows.findIndex(c => c.id === cowId);
      if (index === -1 || !cows[index].healthHistory) return false;
      const rIndex = cows[index].healthHistory!.findIndex(r => r.id === recordId);
      if (rIndex === -1) return false;
      cows[index].healthHistory![rIndex] = { ...cows[index].healthHistory![rIndex], ...data };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cows));
      return true;
    } catch (error) {
      console.error('Error updating health record:', error);
      return false;
    }
  }

  deleteHealthRecord(cowId: string, recordId: string): boolean {
    try {
      const cows = this.getCows();
      const index = cows.findIndex(c => c.id === cowId);
      if (index === -1 || !cows[index].healthHistory) return false;
      cows[index].healthHistory = cows[index].healthHistory!.filter(r => r.id !== recordId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cows));
      return true;
    } catch (error) {
      console.error('Error deleting health record:', error);
      return false;
    }
  }
}