import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CowListPage } from './cow-list.page';

describe('CowListPage', () => {
  let component: CowListPage;
  let fixture: ComponentFixture<CowListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CowListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});