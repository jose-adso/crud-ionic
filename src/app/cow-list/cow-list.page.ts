import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons } from '@ionic/angular/standalone';
import { CowService, Cow } from '../services/cow.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cow-list',
  templateUrl: './cow-list.page.html',
  styleUrls: ['./cow-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons, CommonModule]
})
export class CowListPage implements OnInit {
  cows: Cow[] = [];

  constructor(private cowService: CowService, private router: Router) { }

  ngOnInit() {
    this.loadCows();
  }

  loadCows() {
    this.cows = this.cowService.getCows();
  }

  editCow(cow: Cow) {
    // Navigate to register with cow id as query param
    this.router.navigate(['/cow-register'], { queryParams: { id: cow.id } });
  }

  addNewCow() {
    this.router.navigate(['/cow-register']);
  }

  viewHealth(cow: Cow) {
    this.router.navigate(['/health-control', cow.id]);
  }

  deleteCow(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta vaca?')) {
      this.cowService.deleteCow(id);
      this.loadCows(); // Reload the list
    }
  }
}