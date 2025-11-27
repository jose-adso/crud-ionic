import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonMenuButton,
  IonButtons,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { Auth, UserRecord } from '../services/auth';
import { Router } from '@angular/router';
import { CowService, Cow } from '../services/cow.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonMenuButton,
    IonButtons,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule
  ],
})
export class HomePage implements OnInit {
  // Campos para registrar estudiante
  username: string = '';
  email: string = '';
  password: string = '';
  busy: boolean = false;
  message: string = '';

  // CRUD list / edit state
  users: UserRecord[] = [];
  editingUser: boolean = false;
  originalEditingUsername: string = '';
  editUsername: string = '';
  editEmail: string = '';
  editPassword: string = '';

  // Cows for filtering and liters
  cows: Cow[] = [];
  selectedCowId: string = '';
  liters: number = 0;

  // Dashboard
  totalDailyLiters: number = 0;
  totalMonthlyLiters: number = 0;
  cowMonthlyLiters: { cowName: string; liters: number }[] = [];
  filteredCowMonthlyLiters: { cowName: string; liters: number }[] = [];
  maxLiters: number = 1; // To avoid division by zero
  dailyChange: number = 0; // Percentage change from yesterday
  monthlyChange: number = 0; // Percentage change from last month
  selectedCowForLiters: string = ''; // Selected cow to show monthly liters

  constructor(private auth: Auth, private router: Router, private cowService: CowService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadCows();
  }

  async loadUsers() {
    try {
      this.users = await this.auth.listUsers();
    } catch (err) {
      console.error('loadUsers error', err);
      this.users = [];
    }
  }

  loadCows() {
    this.cows = this.cowService.getCows();
    this.calculateDashboard();
  }

  calculateDashboard() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const currentMonth = todayStr.substring(0, 7); // YYYY-MM
    const lastMonthDate = new Date(today);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const lastMonth = lastMonthDate.toISOString().substring(0, 7);

    this.totalDailyLiters = 0;
    this.totalMonthlyLiters = 0;
    this.cowMonthlyLiters = [];
    let yesterdayTotal = 0;
    let lastMonthTotal = 0;

    this.cows.forEach(cow => {
      const history = cow.productionHistory || [];
      let daily = 0;
      let monthly = 0;
      let yesterdayLiters = 0;
      let lastMonthLiters = 0;

      history.forEach(record => {
        if (record.date === todayStr) {
          daily += record.liters;
        }
        if (record.date === yesterdayStr) {
          yesterdayLiters += record.liters;
        }
        if (record.date.startsWith(currentMonth)) {
          monthly += record.liters;
        }
        if (record.date.startsWith(lastMonth)) {
          lastMonthLiters += record.liters;
        }
      });

      this.totalDailyLiters += daily;
      yesterdayTotal += yesterdayLiters;
      this.totalMonthlyLiters += monthly;
      lastMonthTotal += lastMonthLiters;
      this.cowMonthlyLiters.push({ cowName: cow.cowName, liters: monthly });
      if (monthly > this.maxLiters) this.maxLiters = monthly;
    });

    // Calculate changes
    this.dailyChange = yesterdayTotal > 0 ? ((this.totalDailyLiters - yesterdayTotal) / yesterdayTotal) * 100 : 0;
    this.monthlyChange = lastMonthTotal > 0 ? ((this.totalMonthlyLiters - lastMonthTotal) / lastMonthTotal) * 100 : 0;
  }

  getSelectedCowLiters(): number {
    if (this.selectedCowForLiters) {
      const cow = this.cowMonthlyLiters.find(c => c.cowName === this.selectedCowForLiters);
      return cow ? cow.liters : 0;
    }
    return 0;
  }

  saveLiters() {
    if (this.selectedCowId && this.liters > 0) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const record = { date: today, liters: this.liters };
      const cow = this.cows.find(c => c.id === this.selectedCowId);
      const history = cow?.productionHistory || [];
      // Check if already exists for today, update or add
      const existingIndex = history.findIndex(r => r.date === today);
      if (existingIndex >= 0) {
        history[existingIndex] = record;
      } else {
        history.push(record);
      }
      this.cowService.updateCow(this.selectedCowId, { productionHistory: history });
      this.message = 'Litros diarios guardados correctamente';
      this.selectedCowId = '';
      this.liters = 0;
      this.loadCows(); // Reload to reflect changes
    } else {
      this.message = 'Seleccione una vaca e ingrese litros válidos';
    }
  }

  async registerStudent() {
    if (!this.username || !this.password) {
      this.message = 'Usuario y contraseña son obligatorios';
      return;
    }
    this.busy = true;
    this.message = '';
    try {
      const ok = await this.auth.register(this.username, this.password, this.email || undefined);
      if (ok) {
        this.message = 'Estudiante registrado correctamente';
        // limpiar campos
        this.username = '';
        this.email = '';
        this.password = '';
        await this.loadUsers();
      } else {
        this.message = 'El usuario o correo ya existe';
      }
    } catch (err) {
      console.error('registerStudent error', err);
      this.message = 'Error al registrar estudiante';
    } finally {
      this.busy = false;
    }
  }

  startEdit(u: UserRecord) {
    this.editingUser = true;
    this.originalEditingUsername = u.username;
    this.editUsername = u.username;
    this.editEmail = u.email || '';
    this.editPassword = u.password;
  }

  async saveEdit() {
    console.log('saveEdit called');
    if (!this.editUsername || !this.editPassword) {
      this.message = 'Usuario y contraseña son obligatorios';
      console.log('missing username or password');
      return;
    }
    this.busy = true;
    try {
      const ok = await this.auth.updateUser(this.originalEditingUsername, {
        username: this.editUsername,
        email: this.editEmail || undefined,
        password: this.editPassword
      });
      if (ok) {
        this.message = 'Usuario actualizado';
        this.cancelEdit();
        await this.loadUsers();
      } else {
        this.message = 'No se pudo actualizar (usuario no encontrado o conflicto)';
      }
    } catch (err) {
      console.error('saveEdit error', err);
      this.message = 'Error al actualizar usuario';
    } finally {
      this.busy = false;
    }
  }

  cancelEdit() {
    this.editingUser = false;
    this.originalEditingUsername = '';
    this.editUsername = '';
    this.editEmail = '';
    this.editPassword = '';
    this.message = '';
  }

  async deleteUser(username: string) {
    if (!confirm(`Eliminar usuario ${username}?`)) return;
    try {
      const ok = await this.auth.deleteUser(username);
      if (ok) {
        this.message = 'Usuario eliminado';
        await this.loadUsers();
      } else {
        this.message = 'No se encontró el usuario';
      }
    } catch (err) {
      console.error('deleteUser error', err);
      this.message = 'Error al eliminar usuario';
    }
  }

}
