import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonMenuToggle } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Auth } from './services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonMenuToggle, RouterModule],
})
export class AppComponent {
  constructor(private auth: Auth, private router: Router, private menuController: MenuController) {}

  logout() {
    this.menuController.close('main-menu');
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  closeMenu() {
    this.menuController.close('main-menu');
  }

  navigateToHome() {
    this.closeMenu();
    this.router.navigate(['/home']);
  }

  navigateToProfile() {
    this.closeMenu();
    this.router.navigate(['/profile']);
  }

  navigateToCowRegister() {
    this.closeMenu();
    this.router.navigate(['/cow-register']);
  }

  navigateToCowList() {
    this.closeMenu();
    this.router.navigate(['/cow-list']);
  }

  navigateToHealthHistory() {
    this.closeMenu();
    this.router.navigate(['/health-history']);
  }
}
