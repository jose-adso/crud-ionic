import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthHistoryPage } from './health-history.page';

describe('HealthHistoryPage', () => {
  let component: HealthHistoryPage;
  let fixture: ComponentFixture<HealthHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
