import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CowRegisterPage } from './cow-register.page';

describe('CowRegisterPage', () => {
  let component: CowRegisterPage;
  let fixture: ComponentFixture<CowRegisterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CowRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});