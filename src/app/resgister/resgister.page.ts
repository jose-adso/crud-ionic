import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-resgister',
  templateUrl: './resgister.page.html',
  styleUrls: ['./resgister.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    CommonModule,
    FormsModule
  ]
})
export class ResgisterPage implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  busy: boolean = false;
  message: string = '';

  constructor(private auth: Auth, private router: Router, private firebase: FirebaseService) {}

  ngOnInit() {}

  async register() {
    if (!this.username || !this.password) {
      this.message = 'Usuario y contraseña son obligatorios';
      return;
    }
    this.busy = true;
    this.message = '';
    try {
      const ok = await this.auth.register(this.username, this.password, this.email || undefined);
      if (ok) {
        // Intentar guardar también en Firestore en la colección "crud-maria"
        try {
          console.log('ResgisterPage: intentando guardar en Firestore', { username: this.username, email: this.email });
          const docId = await this.firebase.addToCollection('crud-maria', {
            username: this.username,
            email: this.email || null,
            createdAt: new Date().toISOString()
          });
          console.log('ResgisterPage: guardado en Firestore id=', docId);
          this.message = 'Registro exitoso. Redirigiendo a login...';
          setTimeout(() => this.router.navigate(['/login']), 700);
        } catch (fsErr: any) {
          // Mostrar detalles del error para diagnóstico
          console.error('ResgisterPage: error guardando en Firestore', fsErr);
          const code = fsErr?.code || fsErr?.name || 'unknown';
          const msg = fsErr?.message || String(fsErr);
          this.message = `Registro local OK, fallo al guardar en Firestore (${code}): ${msg}`;
          // Dejar usuario registrado localmente y no bloquear navegación si lo deseas.
          // Aquí no navegamos automáticamente para que el desarrollador pueda ver el error.
        }
      } else {
        this.message = 'El usuario o correo ya existe';
      }
    } catch (err: any) {
      console.error('register error', err);
      const code = err?.code || err?.name || 'unknown';
      const msg = err?.message || String(err);
      this.message = `Error en el registro (${code}): ${msg}`;
    } finally {
      this.busy = false;
    }
  }

  goToLogin() {
    // Navega de vuelta a la pantalla de login
    this.router.navigate(['/login']);
  }
}
