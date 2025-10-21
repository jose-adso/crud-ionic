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

  constructor(private auth: Auth, private router: Router) {}

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
        this.message = 'Registro exitoso. Redirigiendo a login...';
        // Navegar al login después de breve pausa
        setTimeout(() => this.router.navigate(['/login']), 700);
      } else {
        this.message = 'El usuario o correo ya existe';
      }
    } catch (err) {
      console.error('register error', err);
      this.message = 'Error en el registro';
    } finally {
      this.busy = false;
    }
  }

  goToLogin() {
    // Navega de vuelta a la pantalla de login
    this.router.navigate(['/login']);
  }
}
