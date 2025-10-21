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
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private auth: Auth, private router: Router, private toastCtrl: ToastController) { }
 
  ngOnInit() {}

  private async showToast(message: string, color: 'primary' | 'success' | 'danger' | 'warning' | 'medium' = 'primary') {
    try {
      const t = await this.toastCtrl.create({
        message,
        duration: 3000,
        color
      });
      await t.present();
    } catch (err) {
      console.debug('Toast error', err);
    }
  }

  async loginCP() {
    console.debug('loginCP start', { username: this.username });
    try {
      const ok = await this.auth.login(this.username, this.password);
      if (ok) {
        console.info('login successful', { username: this.username });
        await this.showToast('Inicio de sesión exitoso', 'success');
        // Navegar a la página principal (home)
        this.router.navigate(['/home']);
      } else {
        console.warn('login failed', { username: this.username });
        await this.showToast('Usuario o contraseña inválidos', 'danger');
      }
    } catch (err) {
      console.error('login error', err);
      await this.showToast('Error al iniciar sesión', 'danger');
    }
  }

  async loginGoogle() {
    console.debug('loginGoogle start');
    try {
      const ok = await this.auth.signInWithGoogle();
      if (ok) {
        console.info('Usuario Google autenticado');
        await this.showToast('Autenticado con Google', 'success');
        this.router.navigate(['/home']);
      } else {
        console.warn('Autenticación Google fallida (popup->redirect?)');
        await this.showToast('Autenticación Google iniciada (verifica ventana emergente)', 'warning');
      }
    } catch (err) {
      console.error('loginGoogle error', err);
      await this.showToast('Error en autenticación Google', 'danger');
    }
  }

  /**
   * Maneja "¿Olvidaste la contraseña?".
   * Usa el campo `username` como identificador (puede ser usuario o email).
   * Muestra en un toast la contraseña temporal generada o un error si no existe.
   */
  async forgotPassword() {
    const identifier = (this.username || '').trim();
    if (!identifier) {
      await this.showToast('Ingrese su usuario o correo para restablecer la contraseña', 'warning');
      return;
    }

    try {
      const result = await this.auth.resetPassword(identifier);
      if (!result) {
        await this.showToast('Usuario o correo no encontrado', 'danger');
      } else {
        // En un backend real no mostrarías la contraseña en pantalla; esto es solo para el mock/localStorage.
        await this.showToast(`Contraseña temporal: ${result}`, 'success');
      }
    } catch (err) {
      console.error('resetPassword error', err);
      await this.showToast('Error al restablecer la contraseña', 'danger');
    }
  }
 
  goToRegister() {
    // Navega a la página de registro
    this.router.navigate(['/resgister']);
  }
}
