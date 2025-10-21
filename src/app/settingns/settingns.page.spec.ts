import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingnsPage } from './settingns.page';

describe('SettingnsPage', () => {
  let component: SettingnsPage;
  let fixture: ComponentFixture<SettingnsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingnsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
