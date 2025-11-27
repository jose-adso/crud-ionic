import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonMenuButton, IonButtons, IonTextarea } from '@ionic/angular/standalone';
import { CowService, Cow, HealthRecord } from '../services/cow.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-health-control',
  templateUrl: './health-control.page.html',
  styleUrls: ['./health-control.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonMenuButton, IonButtons, IonTextarea, CommonModule, FormsModule]
})
export class HealthControlPage implements OnInit {
  cowId: string = '';
  cow: Cow | null = null;
  healthHistory: HealthRecord[] = [];
  newHealthDate: string = '';
  newHealthType: 'visita_veterinario' | 'vacunacion' | 'tratamiento' | 'otro' = 'visita_veterinario';
  newHealthDescription: string = '';
  newHealthDetails: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private cowService: CowService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.cowId = params.get('cowId') || '';
      if (this.cowId) {
        this.loadCow();
      }
    });
  }

  loadCow() {
    const cows = this.cowService.getCows();
    this.cow = cows.find(c => c.id === this.cowId) || null;
    if (this.cow) {
      this.healthHistory = this.cow.healthHistory || [];
    }
  }

  addHealthRecord() {
    if (this.newHealthDate && this.newHealthDescription && this.cowId) {
      const record = this.cowService.addHealthRecord(this.cowId, {
        date: this.newHealthDate,
        type: this.newHealthType,
        description: this.newHealthDescription,
        details: this.newHealthDetails || undefined
      });
      if (record) {
        this.healthHistory.push(record);
        this.newHealthDate = '';
        this.newHealthType = 'visita_veterinario';
        this.newHealthDescription = '';
        this.newHealthDetails = '';
      }
    }
  }

  goBack() {
    this.router.navigate(['/cow-list']);
  }
}
