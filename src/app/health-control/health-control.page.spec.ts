import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthControlPage } from './health-control.page';

describe('HealthControlPage', () => {
  let component: HealthControlPage;
  let fixture: ComponentFixture<HealthControlPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
