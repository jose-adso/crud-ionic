import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonLabel, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonMenuButton, IonButtons } from '@ionic/angular/standalone';
import { CowService, Cow, HealthRecord } from '../services/cow.service';

@Component({
  selector: 'app-health-history',
  templateUrl: './health-history.page.html',
  styleUrls: ['./health-history.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonLabel, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonMenuButton, IonButtons, CommonModule, FormsModule]
})
export class HealthHistoryPage implements OnInit {
  cows: Cow[] = [];
  selectedCowId: string = '';
  selectedCow: Cow | null = null;
  healthHistory: HealthRecord[] = [];

  constructor(private cowService: CowService) { }

  ngOnInit() {
    this.loadCows();
  }

  loadCows() {
    this.cows = this.cowService.getCows();
  }

  onCowChange() {
    if (this.selectedCowId) {
      this.selectedCow = this.cows.find(c => c.id === this.selectedCowId) || null;
      this.healthHistory = this.selectedCow ? (this.selectedCow.healthHistory || []) : [];
    } else {
      this.selectedCow = null;
      this.healthHistory = [];
    }
  }

}
