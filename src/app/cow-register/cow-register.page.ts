import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonMenuButton, IonButtons, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { CowService, Cow } from '../services/cow.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cow-register',
  templateUrl: './cow-register.page.html',
  styleUrls: ['./cow-register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonMenuButton, IonButtons, IonSelect, IonSelectOption, CommonModule, FormsModule]
})
export class CowRegisterPage implements OnInit {
  cowName: string = '';
  registrationNumber: string = '';
  breed: string = '';
  purchaseDate: string = '';
  status: 'cargada' | 'en seguimiento' | 'sana' = 'cargada';
  inseminationDay: string = '';
  birthDay: string = '';
  inseminationBreed: string = '';
  calfSex: 'pendiente' | 'macho' | 'hembra' = 'pendiente';
  cowPhoto: string = '';
  calfPhoto: string = '';
  saleDate: string = '';
  purgingDate: string = '';
  vaccinationDate: string = '';
  vaccines: string = '';
  otherProblems: string = '';
  busy: boolean = false;
  message: string = '';
  editingCow: Cow | null = null;

  constructor(private cowService: CowService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        const cows = this.cowService.getCows();
        this.editingCow = cows.find(c => c.id === id) || null;
        if (this.editingCow) {
          this.cowName = this.editingCow.cowName;
          this.registrationNumber = this.editingCow.registrationNumber;
          this.breed = this.editingCow.breed;
          this.purchaseDate = this.editingCow.purchaseDate;
          this.status = this.editingCow.status;
          this.inseminationDay = this.editingCow.inseminationDay;
          this.birthDay = this.editingCow.birthDay;
          this.inseminationBreed = this.editingCow.inseminationBreed;
          this.calfSex = this.editingCow.calfSex;
          this.cowPhoto = this.editingCow.cowPhoto || '';
          this.calfPhoto = this.editingCow.calfPhoto || '';
          this.saleDate = this.editingCow.saleDate || '';
          this.purgingDate = this.editingCow.purgingDate || '';
          this.vaccinationDate = this.editingCow.vaccinationDate || '';
          this.vaccines = this.editingCow.vaccines ? this.editingCow.vaccines.join(', ') : '';
          this.otherProblems = this.editingCow.otherProblems || '';
        }
      }
    });
  }

  onCowPhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.cowPhoto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCalfPhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.calfPhoto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  async registerCow() {
    this.busy = true;
    this.message = '';
    try {
      if (this.editingCow) {
        // Update existing cow
        this.cowService.updateCow(this.editingCow.id, {
          cowName: this.cowName,
          registrationNumber: this.registrationNumber,
          breed: this.breed,
          purchaseDate: this.purchaseDate,
          status: this.status,
          inseminationDay: this.inseminationDay,
          birthDay: this.birthDay,
          inseminationBreed: this.inseminationBreed,
          calfSex: this.calfSex,
          cowPhoto: this.cowPhoto || undefined,
          calfPhoto: this.calfPhoto || undefined,
          saleDate: this.saleDate || undefined,
          purgingDate: this.purgingDate || undefined,
          vaccinationDate: this.vaccinationDate || undefined,
          vaccines: this.vaccines ? this.vaccines.split(',').map(v => v.trim()) : undefined,
          otherProblems: this.otherProblems || undefined
        });
        this.message = 'Vaca actualizada correctamente';
        this.router.navigate(['/cow-list']);
      } else {
        // Register new cow
        const cow: Cow = {
          id: Date.now().toString(),
          cowName: this.cowName,
          registrationNumber: this.registrationNumber,
          breed: this.breed,
          purchaseDate: this.purchaseDate,
          status: this.status,
          inseminationDay: this.inseminationDay,
          birthDay: this.birthDay,
          inseminationBreed: this.inseminationBreed,
          calfSex: this.calfSex,
          cowPhoto: this.cowPhoto || undefined,
          calfPhoto: this.calfPhoto || undefined,
          saleDate: this.saleDate || undefined,
          purgingDate: this.purgingDate || undefined,
          vaccinationDate: this.vaccinationDate || undefined,
          vaccines: this.vaccines ? this.vaccines.split(',').map(v => v.trim()) : undefined,
          otherProblems: this.otherProblems || undefined
        };
        this.cowService.saveCow(cow);
        this.message = 'Vaca registrada correctamente';
        // Limpiar campos
        this.cowName = '';
        this.registrationNumber = '';
        this.breed = '';
        this.purchaseDate = '';
        this.status = 'cargada';
        this.inseminationDay = '';
        this.birthDay = '';
        this.inseminationBreed = '';
        this.calfSex = 'pendiente';
        this.cowPhoto = '';
        this.calfPhoto = '';
        this.saleDate = '';
        this.purgingDate = '';
        this.vaccinationDate = '';
        this.vaccines = '';
        this.otherProblems = '';
      }
    } catch (err) {
      console.error('registerCow error', err);
      this.message = 'Error al registrar vaca';
    } finally {
      this.busy = false;
    }
  }
}