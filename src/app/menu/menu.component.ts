import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: [],
  standalone: true,
  imports: [IonContent, IonHeader, IonMenu, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonButton, IonMenuToggle, RouterModule],
})
export class MenuComponent {
  constructor(private auth: Auth, private router: Router) {}

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}