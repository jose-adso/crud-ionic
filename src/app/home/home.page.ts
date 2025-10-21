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
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';
import { Auth, UserRecord } from '../services/auth';
import { Router } from '@angular/router';

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
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
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

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      this.users = await this.auth.listUsers();
    } catch (err) {
      console.error('loadUsers error', err);
      this.users = [];
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
    if (!this.editUsername || !this.editPassword) {
      this.message = 'Usuario y contraseña son obligatorios';
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

  logout() {
    this.auth.logout();
    // navegar a login
    this.router.navigate(['/login']);
  }
}
