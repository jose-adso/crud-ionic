import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonMenuButton, IonButtons } from '@ionic/angular/standalone';
import { Auth, UserRecord } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonMenuButton, IonButtons, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  user: UserRecord | null = null;
  editEmail: string = '';
  editPassword: string = '';
  busy: boolean = false;
  message: string = '';

  constructor(private auth: Auth, private router: Router) { }

  ngOnInit() {
    this.user = this.auth.getCurrentUser();
    console.log('user in profile', this.user);
    if (this.user) {
      this.editEmail = this.user.email || '';
      this.editPassword = this.user.password;
    }
  }

  onPhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const photoURL = reader.result as string;
        if (this.user) {
          this.user.photoURL = photoURL;
          this.auth.updateCurrentUser({ photoURL });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async saveProfile() {
    console.log('saveProfile called');
    if (!this.user) {
      console.log('no user');
      return;
    }
    if (!this.editPassword) {
      this.message = 'La contraseña es obligatoria';
      console.log('no password');
      return;
    }
    this.busy = true;
    this.message = '';
    try {
      const ok = await this.auth.updateUser(this.user.username, {
        email: this.editEmail || undefined,
        password: this.editPassword
      });
      if (ok) {
        this.message = 'Perfil actualizado correctamente';
        // Update current user in service
        this.auth.updateCurrentUser({
          email: this.editEmail || undefined,
          password: this.editPassword
        });
        // Update local
        if (this.user) {
          this.user.email = this.editEmail || undefined;
          this.user.password = this.editPassword;
        }
      } else {
        this.message = 'No se pudo actualizar el perfil';
      }
    } catch (err) {
      console.error('saveProfile error', err);
      this.message = 'Error al actualizar perfil';
    } finally {
      this.busy = false;
    }
  }

}
